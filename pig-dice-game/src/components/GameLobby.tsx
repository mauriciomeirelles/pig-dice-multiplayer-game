import React, { useState } from 'react';
import * as gameApi from '../lib/gameApi';

interface GameLobbyProps {
  onGameCreated: (gameCode: string, playerId: string) => Promise<void>;
  onGameJoined: (gameId: string, playerId: string) => void;
}

interface CreateGameFormProps {
  onGameCreated: (gameCode: string, playerId: string) => Promise<void>;
}

interface JoinGameFormProps {
  onGameJoined: (gameId: string, playerId: string) => void;
}

// Create Game Form Component
function CreateGameForm({ onGameCreated }: CreateGameFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const { gameCode, playerId } = await gameApi.createGame(playerName.trim());
      await onGameCreated(gameCode, playerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl mb-lg text-center">Create New Game</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerName" className="label">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            className={`input ${error ? 'error' : ''}`}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            required
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || !playerName.trim()}
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <div className="loading"></div>
              Creating Game...
            </>
          ) : (
            'Create Game'
          )}
        </button>
      </form>
    </div>
  );
}

// Join Game Form Component
function JoinGameForm({ onGameJoined }: JoinGameFormProps) {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode.trim() || !playerName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const playerId = await gameApi.joinGame(gameCode.trim().toUpperCase(), playerName.trim());
      
      // We need to get the game ID from the game code
      const gameState = await gameApi.getGameState(gameCode.trim().toUpperCase());
      onGameJoined(gameState.game.id, playerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    } finally {
      setLoading(false);
    }
  };

  const handleGameCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6);
    setGameCode(value);
  };

  return (
    <div className="card">
      <h2 className="text-xl mb-lg text-center">Join Game</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gameCode" className="label">
            Game Code
          </label>
          <input
            type="text"
            id="gameCode"
            className={`input text-center text-mono ${error ? 'error' : ''}`}
            value={gameCode}
            onChange={handleGameCodeChange}
            placeholder="ABC123"
            maxLength={6}
            required
            style={{ letterSpacing: '0.1em' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="joinPlayerName" className="label">
            Your Name
          </label>
          <input
            type="text"
            id="joinPlayerName"
            className={`input ${error ? 'error' : ''}`}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            required
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button
          type="submit"
          className="btn btn-secondary btn-lg"
          disabled={loading || !gameCode.trim() || !playerName.trim()}
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <div className="loading"></div>
              Joining Game...
            </>
          ) : (
            'Join Game'
          )}
        </button>
      </form>
    </div>
  );
}

// Main Game Lobby Component
export default function GameLobby({ onGameCreated, onGameJoined }: GameLobbyProps) {
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '2rem 0' }}>
        {/* Header */}
        <div className="text-center mb-xl">
          <h1 className="text-xl mb-md">🎲 Pig Dice Game</h1>
          <p className="text-base text-secondary">
            Roll the dice and race to 100 points! But be careful - roll a 1 and lose your turn points!
          </p>
        </div>

        {/* Game Options */}
        <div className="flex gap-xl" style={{ width: '100%', maxWidth: '800px' }}>
          <div style={{ flex: 1 }}>
            <CreateGameForm onGameCreated={onGameCreated} />
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              OR
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <JoinGameForm onGameJoined={onGameJoined} />
          </div>
        </div>

        {/* Game Rules */}
        <div className="card mt-xl" style={{ maxWidth: '600px' }}>
          <h3 className="text-lg mb-md text-center">How to Play</h3>
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-sm">🎯 <strong>Goal:</strong> First player to reach 100 points wins</li>
              <li className="mb-sm">🎲 <strong>Roll:</strong> Roll 2-6 to add points to your turn total</li>
              <li className="mb-sm">✋ <strong>Hold:</strong> Bank your turn points and pass the dice</li>
              <li className="mb-sm">💥 <strong>Bust:</strong> Roll a 1 and lose all turn points!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 