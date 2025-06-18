import React, { useState } from 'react';
import GameLobby from './components/GameLobby';
import GameBoard from './components/GameBoard';
import './index.css';

type AppState = 
  | { screen: 'lobby' }
  | { screen: 'game'; gameId: string; playerId: string; gameCode: string };

function App() {
  const [appState, setAppState] = useState<AppState>({ screen: 'lobby' });

  const handleGameCreated = (gameCode: string, playerId: string) => {
    // For created games, we need to get the game ID from the game code
    // We'll handle this in the GameBoard component by looking it up
    setAppState({
      screen: 'game',
      gameId: gameCode, // We'll use gameCode as gameId for now and fix in GameBoard
      playerId,
      gameCode
    });
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
