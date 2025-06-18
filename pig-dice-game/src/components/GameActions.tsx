import React from 'react';

interface GameActionsProps {
  canRoll: boolean;
  canHold: boolean;
  turnScore: number;
  onRoll: () => void;
  onHold: () => void;
  loading: boolean;
}

export default function GameActions({
  canRoll,
  canHold,
  turnScore,
  onRoll,
  onHold,
  loading
}: GameActionsProps) {
  return (
    <div className="flex flex-col items-center gap-lg">
      {/* Turn Score Display */}
      {turnScore > 0 && (
        <div className="card text-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Turn Points
          </div>
          <div className="score large" style={{ color: 'var(--color-current-player)' }}>
            +{turnScore}
          </div>
          <div className="text-xs mt-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Hold to bank these points!
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-lg">
        {/* Roll Dice Button */}
        <button
          className="btn btn-primary btn-lg"
          onClick={onRoll}
          disabled={!canRoll || loading}
          style={{ minWidth: '140px' }}
        >
          {loading ? (
            <>
              <div className="loading"></div>
              Rolling...
            </>
          ) : (
            <>
              🎲 Roll Dice
            </>
          )}
        </button>

        {/* Hold Turn Button */}
        <button
          className="btn btn-secondary btn-lg"
          onClick={onHold}
          disabled={!canHold || loading}
          style={{ minWidth: '140px' }}
        >
          ✋ Hold ({turnScore})
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {!canRoll && !canHold && (
          <p>Wait for your turn...</p>
        )}
        {canRoll && turnScore === 0 && (
          <p>Roll the dice to start scoring points</p>
        )}
        {canRoll && turnScore > 0 && (
          <p>Roll again to add more points, or hold to bank them</p>
        )}
        {!canRoll && canHold && (
          <p>Your turn - choose to roll or hold</p>
        )}
      </div>

      {/* Risk Warning */}
      {turnScore > 0 && (
        <div className="text-center text-xs" style={{ 
          color: 'var(--color-warning)',
          maxWidth: '300px'
        }}>
          ⚠️ Warning: Rolling a 1 will lose all {turnScore} turn points!
        </div>
      )}
    </div>
  );
} 