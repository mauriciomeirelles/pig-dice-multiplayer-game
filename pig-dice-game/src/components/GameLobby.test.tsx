import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GameLobby from './GameLobby';
import * as gameApi from '../lib/gameApi';

// Mock the gameApi module
jest.mock('../lib/gameApi', () => ({
  createGame: jest.fn(),
  joinGame: jest.fn(),
  getGameState: jest.fn(),
}));

const mockGameApi = gameApi as jest.Mocked<typeof gameApi>;

describe('GameLobby', () => {
  const mockOnGameCreated = jest.fn();
  const mockOnGameJoined = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the game lobby with both create and join forms', () => {
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      expect(screen.getByText('🎲 Pig Dice Game')).toBeInTheDocument();
      expect(screen.getByText('Create New Game')).toBeInTheDocument();
      expect(screen.getByText('Join Game')).toBeInTheDocument();
      expect(screen.getByText('How to Play')).toBeInTheDocument();
    });

    it('renders game rules section', () => {
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      expect(screen.getByText(/First player to reach the target score wins/)).toBeInTheDocument();
      expect(screen.getByText(/Roll 2-6 to add points to your turn total/)).toBeInTheDocument();
      expect(screen.getByText(/Bank your turn points and pass the dice/)).toBeInTheDocument();
      expect(screen.getByText(/Roll a 1 and lose all turn points!/)).toBeInTheDocument();
    });
  });

  describe('CreateGameForm', () => {
    it('renders all target score options including 500 points Epic', () => {
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const targetScoreSelect = screen.getByLabelText('Target Score');
      
      // Check all target score options are present
      expect(screen.getByText('50 points (Quick)')).toBeInTheDocument();
      expect(screen.getByText('100 points (Classic)')).toBeInTheDocument();
      expect(screen.getByText('150 points (Extended)')).toBeInTheDocument();
      expect(screen.getByText('200 points (Long)')).toBeInTheDocument();
      expect(screen.getByText('300 points (Marathon)')).toBeInTheDocument();
      expect(screen.getByText('500 points (Epic)')).toBeInTheDocument();
    });

    it('has 100 points as default target score', () => {
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const targetScoreSelect = screen.getByLabelText('Target Score') as HTMLSelectElement;
      expect(targetScoreSelect.value).toBe('100');
    });

    it('allows selecting 500 points Epic target score', async () => {
      const user = userEvent.setup();
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const targetScoreSelect = screen.getByLabelText('Target Score');
      
      await user.selectOptions(targetScoreSelect, '500');
      
      expect((targetScoreSelect as HTMLSelectElement).value).toBe('500');
      expect(screen.getByText('First player to reach 500 points wins!')).toBeInTheDocument();
    });

    it('updates target score description when selection changes', async () => {
      const user = userEvent.setup();
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const targetScoreSelect = screen.getByLabelText('Target Score');
      
      // Initially shows 100 points
      expect(screen.getByText('First player to reach 100 points wins!')).toBeInTheDocument();
      
      // Change to 200 points
      await user.selectOptions(targetScoreSelect, '200');
      expect(screen.getByText('First player to reach 200 points wins!')).toBeInTheDocument();
      
      // Change to 500 points Epic
      await user.selectOptions(targetScoreSelect, '500');
      expect(screen.getByText('First player to reach 500 points wins!')).toBeInTheDocument();
    });

    it('requires player name to enable submit button', async () => {
      const user = userEvent.setup();
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      const playerNameInput = screen.getByLabelText('Your Name');
      
      // Button should be disabled initially
      expect(createButton).toBeDisabled();
      
      // Type player name
      await user.type(playerNameInput, 'Test Player');
      
      // Button should be enabled now
      expect(createButton).toBeEnabled();
    });

    it('creates game with selected target score when form is submitted', async () => {
      const user = userEvent.setup();
      mockGameApi.createGame.mockResolvedValue({ gameCode: 'ABC123', playerId: 'player1' });
      
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const playerNameInput = screen.getByLabelText('Your Name');
      const targetScoreSelect = screen.getByLabelText('Target Score');
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      
      // Fill form with 500 points Epic target score
      await user.type(playerNameInput, 'Test Player');
      await user.selectOptions(targetScoreSelect, '500');
      await user.click(createButton);
      
      // Verify API was called with correct parameters
      expect(mockGameApi.createGame).toHaveBeenCalledWith('Test Player', 500);
      
      // Verify callback was called
      await waitFor(() => {
        expect(mockOnGameCreated).toHaveBeenCalledWith('ABC123', 'player1');
      });
    });

    it('shows loading state when creating game', async () => {
      const user = userEvent.setup();
      mockGameApi.createGame.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const playerNameInput = screen.getByLabelText('Your Name');
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      
      await user.type(playerNameInput, 'Test Player');
      await user.click(createButton);
      
      // Should show loading state
      expect(screen.getByText('Creating Game...')).toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });

    it('displays error message on create game failure', async () => {
      const user = userEvent.setup();
      mockGameApi.createGame.mockRejectedValue(new Error('Network error'));
      
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const playerNameInput = screen.getByLabelText('Your Name');
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      
      await user.type(playerNameInput, 'Test Player');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('JoinGameForm', () => {
    it('renders join game form fields', () => {
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      expect(screen.getByLabelText('Game Code')).toBeInTheDocument();
      expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Join Game' })).toBeInTheDocument();
    });

    it('requires both game code and player name to enable submit button', async () => {
      const user = userEvent.setup();
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const joinButton = screen.getByRole('button', { name: 'Join Game' });
      const gameCodeInput = screen.getByLabelText('Game Code');
      const joinPlayerNameInput = screen.getByLabelText('Your Name');
      
      // Button should be disabled initially
      expect(joinButton).toBeDisabled();
      
      // Type only game code
      await user.type(gameCodeInput, 'ABC123');
      expect(joinButton).toBeDisabled();
      
      // Type player name as well
      await user.type(joinPlayerNameInput, 'Test Player');
      expect(joinButton).toBeEnabled();
    });

    it('auto-uppercases and limits game code to 6 characters', async () => {
      const user = userEvent.setup();
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const gameCodeInput = screen.getByLabelText('Game Code') as HTMLInputElement;
      
      await user.type(gameCodeInput, 'abc123def');
      
      expect(gameCodeInput.value).toBe('ABC123');
    });

    it('joins game when form is submitted', async () => {
      const user = userEvent.setup();
      mockGameApi.joinGame.mockResolvedValue('player2');
      mockGameApi.getGameState.mockResolvedValue({ 
        game: { id: 'game1', target_score: 500 } 
      } as any);
      
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const gameCodeInput = screen.getByLabelText('Game Code');
      const joinPlayerNameInput = screen.getByLabelText('Your Name');
      const joinButton = screen.getByRole('button', { name: 'Join Game' });
      
      await user.type(gameCodeInput, 'ABC123');
      await user.type(joinPlayerNameInput, 'Test Player');
      await user.click(joinButton);
      
      // Verify API calls
      expect(mockGameApi.joinGame).toHaveBeenCalledWith('ABC123', 'Test Player');
      expect(mockGameApi.getGameState).toHaveBeenCalledWith('ABC123');
      
      // Verify callback was called
      await waitFor(() => {
        expect(mockOnGameJoined).toHaveBeenCalledWith('game1', 'player2');
      });
    });

    it('shows loading state when joining game', async () => {
      const user = userEvent.setup();
      mockGameApi.joinGame.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const gameCodeInput = screen.getByLabelText('Game Code');
      const joinPlayerNameInput = screen.getByLabelText('Your Name');
      const joinButton = screen.getByRole('button', { name: 'Join Game' });
      
      await user.type(gameCodeInput, 'ABC123');
      await user.type(joinPlayerNameInput, 'Test Player');
      await user.click(joinButton);
      
      // Should show loading state
      expect(screen.getByText('Joining Game...')).toBeInTheDocument();
      expect(joinButton).toBeDisabled();
    });

    it('displays error message on join game failure', async () => {
      const user = userEvent.setup();
      mockGameApi.joinGame.mockRejectedValue(new Error('Game not found'));
      
      render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
      
      const gameCodeInput = screen.getByLabelText('Game Code');
      const joinPlayerNameInput = screen.getByLabelText('Your Name');
      const joinButton = screen.getByRole('button', { name: 'Join Game' });
      
      await user.type(gameCodeInput, 'ABC123');
      await user.type(joinPlayerNameInput, 'Test Player');
      await user.click(joinButton);
      
      await waitFor(() => {
        expect(screen.getByText('Game not found')).toBeInTheDocument();
      });
    });
  });

  describe('Target Score Options Integration', () => {
    it('creates games with different target scores correctly', async () => {
      const user = userEvent.setup();
      mockGameApi.createGame.mockResolvedValue({ gameCode: 'ABC123', playerId: 'player1' });
      
      const targetScores = [
        { value: 50, label: '50 points (Quick)' },
        { value: 100, label: '100 points (Classic)' },
        { value: 150, label: '150 points (Extended)' },
        { value: 200, label: '200 points (Long)' },
        { value: 300, label: '300 points (Marathon)' },
        { value: 500, label: '500 points (Epic)' },
      ];
      
      for (const targetScore of targetScores) {
        mockGameApi.createGame.mockClear();
        
        render(<GameLobby onGameCreated={mockOnGameCreated} onGameJoined={mockOnGameJoined} />);
        
        const playerNameInput = screen.getByLabelText('Your Name');
        const targetScoreSelect = screen.getByLabelText('Target Score');
        const createButton = screen.getByRole('button', { name: 'Create Game' });
        
        await user.type(playerNameInput, 'Test Player');
        await user.selectOptions(targetScoreSelect, targetScore.value.toString());
        await user.click(createButton);
        
        await waitFor(() => {
          expect(mockGameApi.createGame).toHaveBeenCalledWith('Test Player', targetScore.value);
        });
        
        // Clean up for next iteration
        screen.unmount();
      }
    });
  });
});