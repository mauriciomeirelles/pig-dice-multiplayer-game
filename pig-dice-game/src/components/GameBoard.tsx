import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import PlayerList from './PlayerList';
import DiceDisplay from './DiceDisplay';
import GameActions from './GameActions';
import GameHeader from './GameHeader';
import GameHistory from './GameHistory';
import TurnStatus from './TurnStatus';


interface GameBoardProps {
  gameId: string;
  playerId: string;
  gameCode: string;
  onBackToLobby: () => void;
}

export default function GameBoard({ gameId, playerId, gameCode, onBackToLobby }: GameBoardProps) {
  const [startingGame, setStartingGame] = useState(false);
  const gameState = useGame(gameId, playerId);
  
  const {
    game,
    players,
    actions,
    currentPlayer,
    myPlayer,
    isMyTurn,
    loading,
    error,
    rollDice,
    holdTurn,
    startGame,
    diceValue,
    diceRolling
  } = gameState;

  const handleStartGame = async () => {
    setStartingGame(true);
    try {
      await startGame();
    } catch (err) {
      console.error('Error starting game:', err);
    } finally {
      setStartingGame(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="card text-center">
            <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}></div>
            <p>Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="card text-center">
            <h2 className="text-lg mb-md">Error</h2>
            <p className="mb-lg" style={{ color: 'var(--color-danger)' }}>{error}</p>
            <button className="btn btn-primary" onClick={onBackToLobby}>
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!game || !myPlayer) {
    return (
      <div className="container">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="card text-center">
            <h2 className="text-lg mb-md">Game Not Found</h2>
            <button className="btn btn-primary" onClick={onBackToLobby}>
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if game is finished
  const gameFinished = game.status === 'finished';
  const winner = gameFinished ? players.find(p => p.id === game.winner_id) : null;

  return (
    <div className="container">
      <div style={{ padding: '1rem 0', minHeight: '100vh' }}>
        {/* Game Header */}
        <GameHeader
          gameCode={gameCode}
          gameStatus={game.status}
          targetScore={game.target_score}
          onBackToLobby={onBackToLobby}
        />

        {/* Game Content */}
        <div className="flex gap-xl" style={{ marginTop: '2rem' }}>
          {/* Left Sidebar - Players */}
          <div style={{ minWidth: '280px' }}>
            <PlayerList
              players={players}
              currentPlayerId={game.current_player_id}
              winnerId={game.winner_id}
              myPlayerId={playerId}
              targetScore={game.target_score}
            />

            {/* Start Game Button (only for waiting games) */}
            {game.status === 'waiting' && players.length >= 2 && (
              <div className="mt-lg">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleStartGame}
                  disabled={startingGame}
                  style={{ width: '100%' }}
                >
                  {startingGame ? (
                    <>
                      <div className="loading" style={{ marginRight: '0.5rem' }}></div>
                      Starting Game...
                    </>
                  ) : (
                    'Start Game'
                  )}
                </button>
              </div>
            )}

            {/* Debug: Force Refresh */}
            <div className="mt-md">
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
                style={{ width: '100%' }}
              >
                🔄 Refresh Page
              </button>
            </div>

            {/* Waiting for Players */}
            {game.status === 'waiting' && players.length < 2 && (
              <div className="card mt-lg text-center">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Waiting for more players to join...
                  <br />
                  Share the game code: <strong>{gameCode}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Main Game Area */}
          <div style={{ flex: 1, maxWidth: '600px' }}>
            {/* Game Status */}
            {game.status === 'active' && (
              <TurnStatus
                currentPlayer={currentPlayer}
                isMyTurn={isMyTurn}
                myPlayer={myPlayer}
              />
            )}

            {/* Winner Announcement */}
            {gameFinished && winner && (
              <div 
                className="card text-center mb-xl" 
                style={{ 
                  backgroundColor: winner.id === playerId ? 'rgba(16, 185, 129, 0.1)' : 'rgba(243, 244, 246, 0.8)',
                  borderColor: winner.id === playerId ? 'var(--color-success)' : 'var(--color-border)'
                }}
              >
                <h2 className="text-xl mb-md">🎉 Game Over!</h2>
                <p className="text-lg">
                  <strong>{winner.name}</strong> wins with {winner.total_score} points!
                </p>
                {winner.id === playerId && (
                  <p className="mt-md" style={{ color: 'var(--color-success)' }}>
                    Congratulations! You won! 🏆
                  </p>
                )}
              </div>
            )}

            {/* Dice and Actions */}
            {game.status === 'active' && !gameFinished && (
              <div className="flex flex-col items-center gap-xl">
                <DiceDisplay
                  value={diceValue}
                  rolling={diceRolling}
                  lastAction={actions[0]}
                  myPlayerId={playerId}
                />

                <GameActions
                  canRoll={isMyTurn && !diceRolling}
                  canHold={isMyTurn && myPlayer && myPlayer.turn_score > 0 && !diceRolling}
                  turnScore={myPlayer?.turn_score || 0}
                  onRoll={rollDice}
                  onHold={holdTurn}
                  loading={diceRolling}
                />
              </div>
            )}

            {/* Game Instructions for waiting state */}
            {game.status === 'waiting' && (
              <div className="card text-center">
                <h3 className="text-lg mb-md">Ready to Play?</h3>
                <p className="text-sm mb-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  Invite friends with code <strong>{gameCode}</strong>
                  <br />
                  Need at least 2 players to start the game.
                </p>
                <div className="flex gap-md justify-center">
                  <span className="text-sm">
                    Players: <strong>{players.length}</strong> / {8}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Game History */}
          <div style={{ minWidth: '280px' }}>
            <GameHistory actions={actions} players={players} />
          </div>
        </div>
      </div>
    </div>
  );
} 