import React from 'react';
import { Player } from '../lib/supabase';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  winnerId?: string;
  myPlayerId: string;
  targetScore: number;
}

interface PlayerCardProps {
  player: Player;
  isCurrent: boolean;
  isWinner: boolean;
  isMe: boolean;
  targetScore: number;
}

function PlayerCard({ player, isCurrent, isWinner, isMe, targetScore }: PlayerCardProps) {
  const progressPercentage = Math.min((player.total_score / targetScore) * 100, 100);

  return (
    <div className={`player-card ${isCurrent ? 'current' : ''} ${isWinner ? 'winner' : ''} mb-md`}>
      <div className="flex justify-between items-center mb-sm">
        <div className="flex items-center gap-sm">
          <span className="text-base font-weight-600">
            {player.name}
            {isMe && ' (You)'}
          </span>
          {isCurrent && <span style={{ color: 'var(--color-current-player)' }}>●</span>}
          {isWinner && <span>👑</span>}
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          #{player.player_order}
        </div>
      </div>

      <div className="flex justify-between items-center mb-sm">
        <div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Total Score
          </div>
          <div className="score large">
            {player.total_score}
          </div>
        </div>

        {player.turn_score > 0 && (
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Turn Points
            </div>
            <div className="score" style={{ color: 'var(--color-current-player)' }}>
              +{player.turn_score}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-sm">
        <div 
          className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          style={{ 
            backgroundColor: 'var(--color-border)',
            height: '6px',
            borderRadius: '3px'
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: isWinner 
                ? 'var(--color-winner)' 
                : isCurrent 
                  ? 'var(--color-current-player)' 
                  : 'var(--color-primary)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span>0</span>
          <span>{targetScore}</span>
        </div>
      </div>
    </div>
  );
}

export default function PlayerList({ 
  players, 
  currentPlayerId, 
  winnerId, 
  myPlayerId, 
  targetScore 
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg mb-md">Players</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          No players yet...
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg mb-md">
        Players ({players.length})
      </h3>
      <div>
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrent={player.id === currentPlayerId}
            isWinner={player.id === winnerId}
            isMe={player.id === myPlayerId}
            targetScore={targetScore}
          />
        ))}
      </div>
    </div>
  );
} 