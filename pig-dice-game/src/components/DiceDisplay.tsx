import React from 'react';
import { GameAction } from '../lib/supabase';

interface DiceDisplayProps {
  value: number | null;
  rolling: boolean;
  lastAction?: GameAction;
  myPlayerId: string;
}

// Dice face emojis
const DICE_FACES = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅'
};

export default function DiceDisplay({ value, rolling, lastAction, myPlayerId }: DiceDisplayProps) {
  // Only show bust styling if the last action was a bust AND it was my action
  const isBust = lastAction?.action_type === 'bust' && lastAction?.player_id === myPlayerId;
  
  // Show rolling animation or actual value
  const displayValue = rolling ? Math.floor(Math.random() * 6) + 1 : value;
  
  return (
    <div className="flex flex-col items-center gap-md">
      <div 
        className={`dice ${rolling ? 'rolling' : ''} ${isBust ? 'bust' : ''}`}
        style={{
          borderColor: isBust ? 'var(--color-bust)' : 'var(--color-border)',
          backgroundColor: isBust ? 'rgba(239, 68, 68, 0.1)' : 'white'
        }}
      >
        {displayValue ? (
          <span style={{ fontSize: '4rem' }}>
            {DICE_FACES[displayValue as keyof typeof DICE_FACES]}
          </span>
        ) : (
          <span style={{ fontSize: '2rem', color: 'var(--color-text-secondary)' }}>
            🎲
          </span>
        )}
      </div>

      {/* Dice Status */}
      <div className="text-center">
        {rolling && (
          <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
            Rolling...
          </p>
        )}
        
        {!rolling && value && (
          <p className="text-sm">
            {isBust ? (
              <span style={{ color: 'var(--color-bust)' }}>
                💥 Bust! You rolled a 1
              </span>
            ) : (
              <span>
                You rolled a <strong>{value}</strong>
              </span>
            )}
          </p>
        )}

        {!rolling && !value && (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Click "Roll Dice" to start your turn
          </p>
        )}
      </div>
    </div>
  );
} 