# Database & Supabase Integration Tasks

## Supabase Project Setup
- [ ] Create new Supabase project
- [ ] Configure environment variables (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Set up database connection in React app

## Database Schema Creation

### Games Table
- [ ] Create `games` table with correct schema
  - [ ] id (UUID, primary key, auto-generated)
  - [ ] game_code (VARCHAR(6), unique, not null)
  - [ ] status (VARCHAR(20), default 'waiting')
  - [ ] current_player_id (UUID, foreign key)
  - [ ] winner_id (UUID, foreign key)
  - [ ] target_score (INTEGER, default 100)
  - [ ] created_at (TIMESTAMP, default NOW())
  - [ ] updated_at (TIMESTAMP, default NOW())
- [ ] Add indexes for game_code lookup
- [ ] Add foreign key constraints

### Players Table
- [ ] Create `players` table with correct schema
  - [ ] id (UUID, primary key, auto-generated)
  - [ ] game_id (UUID, foreign key to games)
  - [ ] name (VARCHAR(50), not null)
  - [ ] total_score (INTEGER, default 0)
  - [ ] turn_score (INTEGER, default 0)
  - [ ] player_order (INTEGER, not null)
  - [ ] is_active (BOOLEAN, default true)
  - [ ] created_at (TIMESTAMP, default NOW())
- [ ] Add CASCADE DELETE for game_id foreign key
- [ ] Add composite index on (game_id, player_order)

### Game Actions Table
- [ ] Create `game_actions` table with correct schema
  - [ ] id (UUID, primary key, auto-generated)
  - [ ] game_id (UUID, foreign key to games)
  - [ ] player_id (UUID, foreign key to players)
  - [ ] action_type (VARCHAR(20), not null - 'roll', 'hold', 'bust')
  - [ ] dice_value (INTEGER, nullable)
  - [ ] turn_score (INTEGER, nullable)
  - [ ] total_score (INTEGER, nullable)
  - [ ] created_at (TIMESTAMP, default NOW())
- [ ] Add CASCADE DELETE for foreign keys
- [ ] Add index on (game_id, created_at) for history queries

## Row Level Security (RLS) Policies

### Games Table RLS
- [ ] Enable RLS on games table
- [ ] Create policy: Players can read games they're part of
- [ ] Create policy: Players can update games they're part of
- [ ] Create policy: Anyone can create new games
- [ ] Test RLS policies with different user scenarios

### Players Table RLS
- [ ] Enable RLS on players table
- [ ] Create policy: Players can read other players in same game
- [ ] Create policy: Players can update their own records
- [ ] Create policy: Players can insert into games they can access
- [ ] Test RLS policies with multiple players

### Game Actions Table RLS
- [ ] Enable RLS on game_actions table
- [ ] Create policy: Players can read actions for their games
- [ ] Create policy: Players can insert actions for themselves
- [ ] Create policy: No updates/deletes allowed on actions
- [ ] Test RLS policies for action history

## API Functions Implementation

### Game Management Functions
- [ ] Implement `createGame(playerName: string)` function
  - [ ] Generate unique 6-character game code
  - [ ] Create game record in database
  - [ ] Create first player record
  - [ ] Return game code and player ID
  - [ ] Add proper error handling

- [ ] Implement `joinGame(gameCode: string, playerName: string)` function
  - [ ] Find game by code
  - [ ] Validate game is in 'waiting' status
  - [ ] Check player limit not exceeded
  - [ ] Create player record with correct order
  - [ ] Return player ID
  - [ ] Add proper error handling

- [ ] Implement `startGame(gameId: string)` function
  - [ ] Validate minimum players (2)
  - [ ] Set game status to 'active'
  - [ ] Set first player as current player
  - [ ] Add proper error handling

- [ ] Implement `endGame(gameId: string, winnerId: string)` function
  - [ ] Set game status to 'finished'
  - [ ] Set winner_id
  - [ ] Add proper error handling

### Game Action Functions
- [ ] Implement `rollDice(gameId: string, playerId: string)` function
  - [ ] Server-side dice generation (1-6)
  - [ ] Validate player's turn
  - [ ] Calculate new turn score
  - [ ] Handle bust scenario (dice = 1)
  - [ ] Update player turn_score
  - [ ] Record action in game_actions
  - [ ] Switch turn if bust
  - [ ] Return dice value and new scores

- [ ] Implement `holdTurn(gameId: string, playerId: string)` function
  - [ ] Validate player's turn and turn_score > 0
  - [ ] Add turn_score to total_score
  - [ ] Reset turn_score to 0
  - [ ] Check win condition
  - [ ] Record hold action
  - [ ] Switch to next player or end game
  - [ ] Return updated scores

- [ ] Implement `switchTurn(gameId: string)` function
  - [ ] Get next player in order
  - [ ] Update current_player_id
  - [ ] Reset current player's turn_score
  - [ ] Add proper error handling

### Utility Functions
- [ ] Implement `generateGameCode()` function
  - [ ] Generate 6-character alphanumeric code
  - [ ] Ensure uniqueness in database
  - [ ] Retry if collision occurs

- [ ] Implement `validateGameAction()` function
  - [ ] Check if player's turn
  - [ ] Check if game is active
  - [ ] Validate action type
  - [ ] Return validation result

- [ ] Implement `getGameState(gameId: string)` function
  - [ ] Fetch game details
  - [ ] Fetch all players for game
  - [ ] Fetch recent actions
  - [ ] Return complete game state

## Real-time Subscriptions

### Game State Subscription
- [ ] Set up real-time subscription for games table
- [ ] Filter by specific game ID
- [ ] Handle status changes (waiting → active → finished)
- [ ] Handle current player changes
- [ ] Handle winner declaration
- [ ] Implement proper cleanup on unmount

### Player Scores Subscription
- [ ] Set up real-time subscription for players table
- [ ] Filter by game ID
- [ ] Handle total_score updates
- [ ] Handle turn_score updates
- [ ] Handle player join/leave events
- [ ] Update UI immediately on changes

### Game Actions Subscription
- [ ] Set up real-time subscription for game_actions table
- [ ] Filter by game ID for INSERT events only
- [ ] Handle new dice rolls
- [ ] Handle hold actions
- [ ] Handle bust events
- [ ] Update game history in real-time

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