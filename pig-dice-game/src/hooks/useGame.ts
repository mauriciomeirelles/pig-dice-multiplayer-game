import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Game, Player, GameAction } from '../lib/supabase';
import * as gameApi from '../lib/gameApi';

export interface UseGameReturn {
  // State
  game: Game | null;
  players: Player[];
  actions: GameAction[];
  currentPlayer: Player | null;
  myPlayer: Player | null;
  isMyTurn: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  rollDice: () => Promise<void>;
  holdTurn: () => Promise<void>;
  startGame: () => Promise<void>;
  
  // Dice state
  diceValue: number | null;
  diceRolling: boolean;
}

export function useGame(gameId: string, playerId: string): UseGameReturn {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [actions, setActions] = useState<GameAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);

  // Load initial game state
  const loadGameState = useCallback(async () => {
    if (!gameId) return;
    
    try {
      setLoading(true);
      setError(null);
      const gameState = await gameApi.getGameState(gameId);
      setGame(gameState.game);
      setPlayers(gameState.players);
      setActions(gameState.actions);
    } catch (err) {
      console.error('Error loading game state:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!gameId) return;

    // Load initial state
    loadGameState();

    // Subscribe to games table changes
    const gamesSubscription = supabase
      .channel(`game-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Game updated:', payload);
          if (payload.new) {
            setGame(payload.new as Game);
          }
        }
      )
      .subscribe();

    // Subscribe to players table changes
    const playersSubscription = supabase
      .channel(`players-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pig_dice_players',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Players updated:', payload);
          if (payload.eventType === 'INSERT') {
            setPlayers(prev => [...prev, payload.new as Player].sort((a, b) => a.player_order - b.player_order));
          } else if (payload.eventType === 'UPDATE') {
            setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new as Player : p));
          } else if (payload.eventType === 'DELETE') {
            setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to game actions
    const actionsSubscription = supabase
      .channel(`actions-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_actions',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('New action:', payload);
          setActions(prev => [payload.new as GameAction, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      gamesSubscription.unsubscribe();
      playersSubscription.unsubscribe();
      actionsSubscription.unsubscribe();
    };
  }, [gameId, loadGameState]);

  // Computed values
  const currentPlayer = game?.current_player_id 
    ? players.find(p => p.id === game.current_player_id) || null 
    : null;
  
  const myPlayer = players.find(p => p.id === playerId) || null;
  const isMyTurn = game?.current_player_id === playerId;

  // Actions
  const rollDice = useCallback(async () => {
    if (!gameId || !playerId || !isMyTurn || diceRolling) return;

    try {
      setDiceRolling(true);
      setError(null);
      
      // Start dice animation
      const animationTime = 1000; // 1 second
      const result = await gameApi.rollDiceAction(gameId, playerId);
      
      // Simulate rolling animation
      const interval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setDiceValue(result.diceValue);
        setDiceRolling(false);
      }, animationTime);

    } catch (err) {
      console.error('Error rolling dice:', err);
      setError(err instanceof Error ? err.message : 'Failed to roll dice');
      setDiceRolling(false);
    }
  }, [gameId, playerId, isMyTurn, diceRolling]);

  const holdTurn = useCallback(async () => {
    if (!gameId || !playerId || !isMyTurn) return;

    try {
      setError(null);
      await gameApi.holdTurn(gameId, playerId);
      setDiceValue(null); // Clear dice after holding
    } catch (err) {
      console.error('Error holding turn:', err);
      setError(err instanceof Error ? err.message : 'Failed to hold turn');
    }
  }, [gameId, playerId, isMyTurn]);

  const startGame = useCallback(async () => {
    if (!gameId) return;

    try {
      console.log('Starting game:', gameId);
      setError(null);
      await gameApi.startGame(gameId);
      console.log('Game started successfully');
    } catch (err) {
      console.error('Error starting game:', err);
      setError(err instanceof Error ? err.message : 'Failed to start game');
    }
  }, [gameId]);

  return {
    // State
    game,
    players,
    actions,
    currentPlayer,
    myPlayer,
    isMyTurn,
    loading,
    error,

    // Actions
    rollDice,
    holdTurn,
    startGame,

    // Dice state
    diceValue,
    diceRolling,
  };
} 