import { supabase } from './supabase';
import { Game, Player, GameAction } from './supabase';

// Game constants
export const GAME_CONSTANTS = {
  TARGET_SCORE: 100,
  BUST_VALUE: 1,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 8,
} as const;

// Generate unique 6-character game code
export async function generateGameCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if code already exists
    const { data } = await supabase
      .from('games')
      .select('id')
      .eq('game_code', code)
      .single();

    if (!data) {
      return code;
    }
    attempts++;
  }

  throw new Error('Unable to generate unique game code');
}

// Create a new game
export async function createGame(playerName: string): Promise<{ gameCode: string; playerId: string }> {
  try {
    const gameCode = await generateGameCode();

    // Create game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        game_code: gameCode,
        status: 'waiting',
        target_score: GAME_CONSTANTS.TARGET_SCORE,
      })
      .select()
      .single();

    if (gameError) throw gameError;

    // Create first player
    const { data: player, error: playerError } = await supabase
      .from('pig_dice_players')
      .insert({
        game_id: game.id,
        name: playerName,
        player_order: 1,
        total_score: 0,
        turn_score: 0,
      })
      .select()
      .single();

    if (playerError) throw playerError;

    return { gameCode, playerId: player.id };
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error('Failed to create game');
  }
}

// Join an existing game
export async function joinGame(gameCode: string, playerName: string): Promise<string> {
  try {
    // Find game by code
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, status')
      .eq('game_code', gameCode)
      .single();

    if (gameError || !game) {
      throw new Error('Game not found');
    }

    if (game.status !== 'waiting') {
      throw new Error('Game has already started');
    }

    // Check current player count
    const { data: players, error: playersError } = await supabase
      .from('pig_dice_players')
      .select('player_order')
      .eq('game_id', game.id)
      .order('player_order', { ascending: false })
      .limit(1);

    if (playersError) throw playersError;

    const nextOrder = players.length > 0 ? players[0].player_order + 1 : 1;

    if (nextOrder > GAME_CONSTANTS.MAX_PLAYERS) {
      throw new Error('Game is full');
    }

    // Create player record
    const { data: player, error: playerError } = await supabase
      .from('pig_dice_players')
      .insert({
        game_id: game.id,
        name: playerName,
        player_order: nextOrder,
        total_score: 0,
        turn_score: 0,
      })
      .select()
      .single();

    if (playerError) throw playerError;

    return player.id;
  } catch (error) {
    console.error('Error joining game:', error);
    throw error;
  }
}

// Start a game
export async function startGame(gameId: string): Promise<void> {
  try {
    // Check minimum players
    const { data: players, error: playersError } = await supabase
      .from('pig_dice_players')
      .select('id, player_order')
      .eq('game_id', gameId)
      .order('player_order');

    if (playersError) throw playersError;

    if (players.length < GAME_CONSTANTS.MIN_PLAYERS) {
      throw new Error(`Need at least ${GAME_CONSTANTS.MIN_PLAYERS} players to start`);
    }

    // Set game status to active and set first player
    const { error } = await supabase
      .from('games')
      .update({
        status: 'active',
        current_player_id: players[0].id,
      })
      .eq('id', gameId);

    if (error) throw error;
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
}

// Server-side dice roll
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// Roll dice action
export async function rollDiceAction(gameId: string, playerId: string): Promise<{ 
  diceValue: number; 
  newTurnScore: number; 
  bust: boolean;
  gameWon?: boolean;
  winnerId?: string;
}> {
  try {
    // Validate it's player's turn
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('current_player_id, status')
      .eq('id', gameId)
      .single();

    if (gameError || !game) throw new Error('Game not found');
    if (game.status !== 'active') throw new Error('Game is not active');
    if (game.current_player_id !== playerId) throw new Error('Not your turn');

    const diceValue = rollDice();
    const isBust = diceValue === GAME_CONSTANTS.BUST_VALUE;

    // Get current player data
    const { data: player, error: playerError } = await supabase
      .from('pig_dice_players')
      .select('turn_score, total_score')
      .eq('id', playerId)
      .single();

    if (playerError || !player) throw new Error('Player not found');

    let newTurnScore = player.turn_score;
    let actionType: 'roll' | 'bust' = 'roll';

    if (isBust) {
      // Reset turn score to 0
      newTurnScore = 0;
      actionType = 'bust';

      // Update player turn score
      const { error: updateError } = await supabase
        .from('pig_dice_players')
        .update({ turn_score: 0 })
        .eq('id', playerId);

      if (updateError) throw updateError;

      // Switch to next player
      await switchTurn(gameId);
    } else {
      // Add dice value to turn score
      newTurnScore = player.turn_score + diceValue;

      // Update player turn score
      const { error: updateError } = await supabase
        .from('pig_dice_players')
        .update({ turn_score: newTurnScore })
        .eq('id', playerId);

      if (updateError) throw updateError;
    }

    // Record action
    await supabase
      .from('game_actions')
      .insert({
        game_id: gameId,
        player_id: playerId,
        action_type: actionType,
        dice_value: diceValue,
        turn_score: newTurnScore,
        total_score: player.total_score,
      });

    return {
      diceValue,
      newTurnScore,
      bust: isBust,
    };
  } catch (error) {
    console.error('Error rolling dice:', error);
    throw error;
  }
}

// Hold turn action
export async function holdTurn(gameId: string, playerId: string): Promise<{
  newTotalScore: number;
  gameWon: boolean;
  winnerId?: string;
}> {
  try {
    // Validate it's player's turn
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('current_player_id, status, target_score')
      .eq('id', gameId)
      .single();

    if (gameError || !game) throw new Error('Game not found');
    if (game.status !== 'active') throw new Error('Game is not active');
    if (game.current_player_id !== playerId) throw new Error('Not your turn');

    // Get current player data
    const { data: player, error: playerError } = await supabase
      .from('pig_dice_players')
      .select('turn_score, total_score')
      .eq('id', playerId)
      .single();

    if (playerError || !player) throw new Error('Player not found');

    if (player.turn_score <= 0) {
      throw new Error('No points to hold');
    }

    const newTotalScore = player.total_score + player.turn_score;
    const gameWon = newTotalScore >= game.target_score;

    // Update player scores
    const { error: updateError } = await supabase
      .from('pig_dice_players')
      .update({
        total_score: newTotalScore,
        turn_score: 0,
      })
      .eq('id', playerId);

    if (updateError) throw updateError;

    // Record hold action
    await supabase
      .from('game_actions')
      .insert({
        game_id: gameId,
        player_id: playerId,
        action_type: 'hold',
        turn_score: player.turn_score,
        total_score: newTotalScore,
      });

    if (gameWon) {
      // End game
      await supabase
        .from('games')
        .update({
          status: 'finished',
          winner_id: playerId,
        })
        .eq('id', gameId);

      return { newTotalScore, gameWon: true, winnerId: playerId };
    } else {
      // Switch to next player
      await switchTurn(gameId);
      return { newTotalScore, gameWon: false };
    }
  } catch (error) {
    console.error('Error holding turn:', error);
    throw error;
  }
}

// Switch to next player
export async function switchTurn(gameId: string): Promise<void> {
  try {
    // Get all players in order
    const { data: players, error: playersError } = await supabase
      .from('pig_dice_players')
      .select('id, player_order')
      .eq('game_id', gameId)
      .eq('is_active', true)
      .order('player_order');

    if (playersError) throw playersError;

    // Get current player
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('current_player_id')
      .eq('id', gameId)
      .single();

    if (gameError || !game) throw new Error('Game not found');

    const currentIndex = players.findIndex(p => p.id === game.current_player_id);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];

    // Update current player and reset their turn score
    await supabase
      .from('games')
      .update({ current_player_id: nextPlayer.id })
      .eq('id', gameId);

    await supabase
      .from('pig_dice_players')
      .update({ turn_score: 0 })
      .eq('id', nextPlayer.id);

  } catch (error) {
    console.error('Error switching turn:', error);
    throw error;
  }
}

// Get complete game state (by ID or game code)
export async function getGameState(gameIdOrCode: string): Promise<{ game: Game; players: Player[]; actions: GameAction[] }> {
  try {
    // Determine if this is a game ID (UUID) or game code (6 chars)
    const isGameCode = gameIdOrCode.length === 6;
    
    // Get game
    const gameQuery = supabase
      .from('games')
      .select('*');
    
    const { data: game, error: gameError } = await (isGameCode 
      ? gameQuery.eq('game_code', gameIdOrCode).single()
      : gameQuery.eq('id', gameIdOrCode).single());

    if (gameError) throw gameError;

    // Get players
    const { data: players, error: playersError } = await supabase
      .from('pig_dice_players')
      .select('*')
      .eq('game_id', game.id)
      .order('player_order');

    if (playersError) throw playersError;

    // Get recent actions
    const { data: actions, error: actionsError } = await supabase
      .from('game_actions')
      .select('*')
      .eq('game_id', game.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (actionsError) throw actionsError;

    return { game, players, actions };
  } catch (error) {
    console.error('Error getting game state:', error);
    throw error;
  }
} 