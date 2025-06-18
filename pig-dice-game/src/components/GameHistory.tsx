import React from 'react';
import { GameAction, Player } from '../lib/supabase';

interface GameHistoryProps {
  actions: GameAction[];
  players: Player[];
}

interface ActionItemProps {
  action: GameAction;
  playerName: string;
}

function ActionItem({ action, playerName }: ActionItemProps) {
  const getActionIcon = () => {
    switch (action.action_type) {
      case 'roll': return '🎲';
      case 'hold': return '✋';
      case 'bust': return '💥';
      default: return '📝';
    }
  };

  const getActionText = () => {
    switch (action.action_type) {
      case 'roll':
        return `rolled a ${action.dice_value}`;
      case 'hold':
        return `held for ${action.turn_score} points`;
      case 'bust':
        return `busted with a ${action.dice_value}!`;
      default:
        return 'made an action';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const actionTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - actionTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className={`action-item ${action.action_type}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-sm">
          <span className="text-base">{getActionIcon()}</span>
          <div>
            <div className="text-sm">
              <strong>{playerName}</strong> {getActionText()}
            </div>
            {action.total_score !== null && (
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Total: {action.total_score} points
              </div>
            )}
          </div>
        </div>
        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {getTimeAgo(action.created_at)}
        </div>
      </div>
    </div>
  );
}

export default function GameHistory({ actions, players }: GameHistoryProps) {
  // Create a map of player IDs to names for quick lookup
  const playerMap = players.reduce((map, player) => {
    map[player.id] = player.name;
    return map;
  }, {} as Record<string, string>);

  if (actions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg mb-md">Game History</h3>
        <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
          No actions yet. Start playing to see the game history!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg mb-md">
        Game History ({actions.length})
      </h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {actions.map((action) => (
          <ActionItem
            key={action.id}
            action={action}
            playerName={playerMap[action.player_id] || 'Unknown Player'}
          />
        ))}
      </div>
      {actions.length >= 10 && (
        <div className="text-xs text-center mt-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Showing last 10 actions
        </div>
      )}
    </div>
  );
} 