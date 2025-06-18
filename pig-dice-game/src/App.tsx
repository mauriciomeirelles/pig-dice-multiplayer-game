import React, { useState } from 'react';
import GameLobby from './components/GameLobby';
import GameBoard from './components/GameBoard';
import './index.css';

type AppState = 
  | { screen: 'lobby' }
  | { screen: 'game'; gameId: string; playerId: string; gameCode: string };

function App() {
  const [appState, setAppState] = useState<AppState>({ screen: 'lobby' });

  const handleGameCreated = async (gameCode: string, playerId: string) => {
    try {
      // Get the actual game ID from the game code
      const gameApi = await import('./lib/gameApi');
      const gameState = await gameApi.getGameState(gameCode);
      setAppState({
        screen: 'game',
        gameId: gameState.game.id,
        playerId,
        gameCode
      });
    } catch (error) {
      console.error('Error fetching game state:', error);
      // Fallback to lobby if we can't get the game state
      setAppState({ screen: 'lobby' });
    }
  };

  const handleGameJoined = (gameId: string, playerId: string) => {
    // Extract gameCode from the gameId if it's a gameCode
    // This is a bit of a hack - in a real app you'd want cleaner state management
    setAppState({
      screen: 'game',
      gameId,
      playerId,
      gameCode: gameId.length === 6 ? gameId : 'UNKNOWN'
    });
  };

  const handleBackToLobby = () => {
    setAppState({ screen: 'lobby' });
  };

  switch (appState.screen) {
    case 'lobby':
      return (
        <GameLobby
          onGameCreated={handleGameCreated}
          onGameJoined={handleGameJoined}
        />
      );
    
    case 'game':
      return (
        <GameBoard
          gameId={appState.gameId}
          playerId={appState.playerId}
          gameCode={appState.gameCode}
          onBackToLobby={handleBackToLobby}
        />
      );
    
    default:
      return (
        <div className="container">
          <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
            <div className="card text-center">
              <h2 className="text-lg mb-md">Error</h2>
              <p className="mb-lg">Something went wrong</p>
              <button className="btn btn-primary" onClick={handleBackToLobby}>
                Back to Lobby
              </button>
            </div>
          </div>
        </div>
      );
  }
}

export default App;
