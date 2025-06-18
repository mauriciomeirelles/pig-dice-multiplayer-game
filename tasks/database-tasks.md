# Database & Supabase Integration Tasks

## Supabase Project Setup
- [x] Create new Supabase project
- [x] Configure environment variables (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY)
- [x] Enable Row Level Security (RLS) on all tables
- [x] Set up database connection in React app

## Database Schema Creation

### Games Table
- [x] Create `games` table with correct schema
  - [x] id (UUID, primary key, auto-generated)
  - [x] game_code (VARCHAR(6), unique, not null)
  - [x] status (VARCHAR(20), default 'waiting')
  - [x] current_player_id (UUID, foreign key)
  - [x] winner_id (UUID, foreign key)
  - [x] target_score (INTEGER, default 100)
  - [x] created_at (TIMESTAMP, default NOW())
  - [x] updated_at (TIMESTAMP, default NOW())
- [x] Add indexes for game_code lookup
- [x] Add foreign key constraints

### Players Table
- [x] Create `players` table with correct schema (as pig_dice_players)
  - [x] id (UUID, primary key, auto-generated)
  - [x] game_id (UUID, foreign key to games)
  - [x] name (VARCHAR(50), not null)
  - [x] total_score (INTEGER, default 0)
  - [x] turn_score (INTEGER, default 0)
  - [x] player_order (INTEGER, not null)
  - [x] is_active (BOOLEAN, default true)
  - [x] created_at (TIMESTAMP, default NOW())
- [x] Add CASCADE DELETE for game_id foreign key
- [x] Add composite index on (game_id, player_order)

### Game Actions Table
- [x] Create `game_actions` table with correct schema
  - [x] id (UUID, primary key, auto-generated)
  - [x] game_id (UUID, foreign key to games)
  - [x] player_id (UUID, foreign key to players)
  - [x] action_type (VARCHAR(20), not null - 'roll', 'hold', 'bust')
  - [x] dice_value (INTEGER, nullable)
  - [x] turn_score (INTEGER, nullable)
  - [x] total_score (INTEGER, nullable)
  - [x] created_at (TIMESTAMP, default NOW())
- [x] Add CASCADE DELETE for foreign keys
- [x] Add index on (game_id, created_at) for history queries

## Row Level Security (RLS) Policies

### Games Table RLS
- [x] Enable RLS on games table
- [x] Create policy: Players can read games they're part of
- [x] Create policy: Players can update games they're part of
- [x] Create policy: Anyone can create new games
- [ ] Test RLS policies with different user scenarios

### Players Table RLS
- [x] Enable RLS on players table
- [x] Create policy: Players can read other players in same game
- [x] Create policy: Players can update their own records
- [x] Create policy: Players can insert into games they can access
- [ ] Test RLS policies with multiple players

### Game Actions Table RLS
- [x] Enable RLS on game_actions table
- [x] Create policy: Players can read actions for their games
- [x] Create policy: Players can insert actions for themselves
- [x] Create policy: No updates/deletes allowed on actions
- [ ] Test RLS policies for action history

## API Functions Implementation

### Game Management Functions
- [x] Implement `createGame(playerName: string)` function
  - [x] Generate unique 6-character game code
  - [x] Create game record in database
  - [x] Create first player record
  - [x] Return game code and player ID
  - [x] Add proper error handling

- [x] Implement `joinGame(gameCode: string, playerName: string)` function
  - [x] Find game by code
  - [x] Validate game is in 'waiting' status
  - [x] Check player limit not exceeded
  - [x] Create player record with correct order
  - [x] Return player ID
  - [x] Add proper error handling

- [x] Implement `startGame(gameId: string)` function
  - [x] Validate minimum players (2)
  - [x] Set game status to 'active'
  - [x] Set first player as current player
  - [x] Add proper error handling

- [x] Implement `endGame(gameId: string, winnerId: string)` function (handled in holdTurn)
  - [x] Set game status to 'finished'
  - [x] Set winner_id
  - [x] Add proper error handling

### Game Action Functions
- [x] Implement `rollDice(gameId: string, playerId: string)` function
  - [x] Server-side dice generation (1-6)
  - [x] Validate player's turn
  - [x] Calculate new turn score
  - [x] Handle bust scenario (dice = 1)
  - [x] Update player turn_score
  - [x] Record action in game_actions
  - [x] Switch turn if bust
  - [x] Return dice value and new scores

- [x] Implement `holdTurn(gameId: string, playerId: string)` function
  - [x] Validate player's turn and turn_score > 0
  - [x] Add turn_score to total_score
  - [x] Reset turn_score to 0
  - [x] Check win condition
  - [x] Record hold action
  - [x] Switch to next player or end game
  - [x] Return updated scores

- [x] Implement `switchTurn(gameId: string)` function
  - [x] Get next player in order
  - [x] Update current_player_id
  - [x] Reset current player's turn_score
  - [x] Add proper error handling

### Utility Functions
- [x] Implement `generateGameCode()` function
  - [x] Generate 6-character alphanumeric code
  - [x] Ensure uniqueness in database
  - [x] Retry if collision occurs

- [x] Implement `validateGameAction()` function (built into each action)
  - [x] Check if player's turn
  - [x] Check if game is active
  - [x] Validate action type
  - [x] Return validation result

- [x] Implement `getGameState(gameId: string)` function
  - [x] Fetch game details
  - [x] Fetch all players for game
  - [x] Fetch recent actions
  - [x] Return complete game state

## Real-time Subscriptions

### Game State Subscription
- [x] Set up real-time subscription for games table
- [x] Filter by specific game ID
- [x] Handle status changes (waiting → active → finished)
- [x] Handle current player changes
- [x] Handle winner declaration
- [x] Implement proper cleanup on unmount

### Player Scores Subscription
- [x] Set up real-time subscription for players table
- [x] Filter by game ID
- [x] Handle total_score updates
- [x] Handle turn_score updates
- [x] Handle player join/leave events
- [x] Update UI immediately on changes

### Game Actions Subscription
- [x] Set up real-time subscription for game_actions table
- [x] Filter by game ID for INSERT events only
- [x] Handle new dice rolls
- [x] Handle hold actions
- [x] Handle bust events
- [x] Update game history in real-time

## Database Optimization

### Indexing Strategy
- [ ] Add index on games.game_code for fast lookups
- [ ] Add composite index on players(game_id, player_order)
- [ ] Add index on game_actions(game_id, created_at)
- [ ] Monitor query performance
- [ ] Optimize slow queries

### Connection Management
- [ ] Implement connection pooling
- [ ] Handle connection timeouts
- [ ] Implement retry logic for failed queries
- [ ] Monitor connection health
- [ ] Handle network disconnections

## Testing & Validation

### Unit Tests
- [ ] Test all API functions with valid inputs
- [ ] Test all API functions with invalid inputs
- [ ] Test edge cases (empty games, max players, etc.)
- [ ] Test concurrent operations
- [ ] Test RLS policy enforcement

### Integration Tests
- [ ] Test complete game flow (create → join → play → finish)
- [ ] Test multiple concurrent games
- [ ] Test real-time subscription accuracy
- [ ] Test network failure scenarios
- [ ] Test security boundaries

### Performance Tests
- [ ] Test with maximum players per game
- [ ] Test with multiple simultaneous games
- [ ] Test subscription performance
- [ ] Measure query execution times
- [ ] Test under load conditions

## Error Handling & Monitoring

### Error Scenarios
- [ ] Handle duplicate game codes
- [ ] Handle invalid game codes
- [ ] Handle game not found
- [ ] Handle player not found
- [ ] Handle invalid turn attempts
- [ ] Handle network connectivity issues
- [ ] Handle Supabase service unavailability

### Logging & Monitoring
- [ ] Set up error logging for API functions
- [ ] Monitor subscription connection status
- [ ] Track game creation/completion rates
- [ ] Monitor database performance metrics
- [ ] Set up alerts for critical failures

### Data Consistency
- [ ] Implement transaction boundaries
- [ ] Handle partial update failures
- [ ] Ensure referential integrity
- [ ] Handle concurrent modification conflicts
- [ ] Implement data validation rules 