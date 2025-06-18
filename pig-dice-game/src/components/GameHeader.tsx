import React, { useState } from 'react';

interface GameHeaderProps {
  gameCode: string;
  gameStatus: string;
  targetScore: number;
  onBackToLobby: () => void;
}

export default function GameHeader({
  gameCode,
  gameStatus,
  targetScore,
  onBackToLobby
}: GameHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const statusDisplay = {
    waiting: { text: 'Waiting for Players', color: 'var(--color-warning)' },
    active: { text: 'Game in Progress', color: 'var(--color-success)' },
    finished: { text: 'Game Finished', color: 'var(--color-text-secondary)' }
  };

  const status = statusDisplay[gameStatus as keyof typeof statusDisplay] || statusDisplay.waiting;

  return (
    <div className="flex justify-between items-center p-lg" style={{ borderBottom: '1px solid var(--color-border)' }}>
      {/* Left side - Back button */}
      <button
        className="btn btn-primary"
        onClick={onBackToLobby}
      >
        ← Back to Lobby
      </button>

      {/* Center - Game info */}
      <div className="text-center">
        <h1 className="text-xl mb-sm">🎲 Pig Dice Game</h1>
        
        {/* Game Code */}
        <div className="flex items-center gap-sm justify-center mb-sm">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Game Code:
          </span>
          <button
            className="text-mono font-weight-600 text-lg"
            onClick={handleCopyCode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--color-border)',
              letterSpacing: '0.1em'
            }}
            title="Click to copy"
          >
            {gameCode}
          </button>
          {copied && (
            <span className="text-xs" style={{ color: 'var(--color-success)' }}>
              Copied!
            </span>
          )}
        </div>

        {/* Game Status */}
        <div className="flex items-center gap-md justify-center">
          <span className="text-sm" style={{ color: status.color }}>
            ● {status.text}
          </span>
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Race to {targetScore}
          </span>
        </div>
      </div>

      {/* Right side - Share code */}
      <div className="text-right">
        <button
          className="btn btn-secondary"
          onClick={handleCopyCode}
        >
          📋 Copy Code
        </button>
      </div>
    </div>
  );
} 