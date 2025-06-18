import React from 'react';
import { Player } from '../lib/supabase';

interface TurnStatusProps {
  currentPlayer: Player | null;
  isMyTurn: boolean;
  myPlayer: Player | null;
}

export default function TurnStatus({ currentPlayer, isMyTurn, myPlayer }: TurnStatusProps) {
  if (!currentPlayer) {
    return (
      <div className="card text-center mb-lg">
        <h3 className="text-lg">Game Starting...</h3>
      </div>
    );
  }

  return (
    <div className={`card text-center mb-lg ${isMyTurn ? 'highlighted' : ''}`}>
      <div className="flex flex-col items-center gap-md">
        {isMyTurn ? (
          <>
            <h3 className="text-lg" style={{ color: 'var(--color-current-player)' }}>
              🎯 Your Turn!
            </h3>
            <p className="text-sm">
              Roll the dice to start scoring points, or hold to bank your current turn score.
            </p>
            {myPlayer && myPlayer.turn_score > 0 && (
              <div className="text-sm">
                Current turn score: 
                <span className="score" style={{ color: 'var(--color-current-player)', marginLeft: '8px' }}>
                  +{myPlayer.turn_score}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg">
              {currentPlayer.name}'s Turn
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Wait for your turn to roll the dice
            </p>
            {currentPlayer.turn_score > 0 && (
              <div className="text-sm">
                {currentPlayer.name} has 
                <span className="score" style={{ color: 'var(--color-current-player)', margin: '0 4px' }}>
                  +{currentPlayer.turn_score}
                </span>
                turn points
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 