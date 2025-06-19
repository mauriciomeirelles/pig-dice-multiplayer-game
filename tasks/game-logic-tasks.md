# Game Logic & State Management Tasks

## Core Game Rules Implementation

### Game Constants & Configuration
- [x] Define game constants (TARGET_SCORE, BUST_VALUE, MIN/MAX_PLAYERS)
- [x] Create game configuration object
- [x] Implement game code generation logic (6 characters)
- [x] Add game status enums ('waiting', 'active', 'finished')
- [x] Define action types ('roll', 'hold', 'bust')
- [x] Add customizable target score configuration
  - [x] Update createGame API to accept target score parameter
  - [x] Add target score validation (10-1000 range)
  - [x] Implement dynamic win condition based on game target score
  - [x] Create UI controls for target score selection during game creation

### Game State Types & Interfaces
- [ ] Define `Game` interface with all required fields
- [ ] Define `Player` interface with score tracking
- [ ] Define `GameAction` interface for history
- [ ] Define `GameState` combined interface
- [ ] Create TypeScript types for game status
- [ ] Create types for player actions and responses

### Score Calculation Logic
- [ ] Implement `calculateScores()` function
  - [ ] Handle normal dice roll (2-6)
  - [ ] Handle bust scenario (dice = 1)
  - [ ] Calculate new turn score
  - [ ] Maintain total score until hold
  - [ ] Return score state object

- [ ] Implement `applyHoldAction()` function
  - [ ] Add turn score to total score
  - [ ] Reset turn score to 0
  - [ ] Return updated player state

- [ ] Implement score validation
  - [ ] Validate score ranges (non-negative)
  - [ ] Validate turn score accumulation
  - [ ] Check for score overflow edge cases

### Turn Management System
- [ ] Implement `getNextPlayer()` function
  - [ ] Handle player order cycling
  - [ ] Skip inactive players
  - [ ] Return next valid player
  - [ ] Handle edge cases (single player, all inactive)

- [ ] Implement `switchTurn()` function
  - [ ] Update current player
  - [ ] Reset turn score for previous player
  - [ ] Validate turn transition
  - [ ] Handle turn notification

- [ ] Implement turn validation
  - [ ] Check if player can act
  - [ ] Validate action timing
  - [ ] Ensure game is active

### Win Condition Logic
- [ ] Implement `checkWinCondition()` function
  - [ ] Compare total score to target
  - [ ] Handle exact score vs. exceed scenarios
  - [ ] Return winner information
  - [ ] Validate win state

- [ ] Implement `endGame()` logic
  - [ ] Set game status to finished
  - [ ] Record winner
  - [ ] Stop accepting new actions
  - [ ] Trigger end game events

### Game Action Validation
- [ ] Implement `validateGameAction()` function
  - [ ] Check if player's turn
  - [ ] Verify game is active
  - [ ] Validate action type
  - [ ] Check turn score for hold actions
  - [ ] Return validation result with error messages

- [ ] Implement action security checks
  - [ ] Prevent unauthorized actions
  - [ ] Validate player ownership
  - [ ] Check game membership

## Dice Rolling System

### Dice Generation Logic
- [ ] Implement server-side dice rolling
  - [ ] Generate random values 1-6
  - [ ] Ensure cryptographically secure randomness
  - [ ] Handle edge cases
  - [ ] Return dice value

- [ ] Implement dice validation
  - [ ] Validate dice value range
  - [ ] Check for tampering attempts
  - [ ] Log suspicious activity

### Dice Animation Coordination
- [ ] Implement client-side dice animation
  - [ ] Create rolling animation states
  - [ ] Sync with server-generated results
  - [ ] Handle animation timing
  - [ ] Provide visual feedback

- [ ] Implement `useDice` hook
  - [ ] Manage dice rolling state
  - [ ] Handle animation lifecycle
  - [ ] Coordinate with server calls
  - [ ] Return dice state and controls

### Dice Result Processing
- [ ] Implement dice result classification
  - [ ] Identify bust scenarios (value = 1)
  - [ ] Categorize safe/good rolls
  - [ ] Return result metadata

- [ ] Implement bust handling
  - [ ] Reset turn score to 0
  - [ ] Switch to next player
  - [ ] Record bust action
  - [ ] Trigger bust animations

## Game State Management

### State Management Hook (`useGameState`)
- [ ] Implement game state initialization
  - [ ] Load game from database
  - [ ] Initialize player list
  - [ ] Set up subscriptions
  - [ ] Handle loading states

- [ ] Implement state updates
  - [ ] Handle score changes
  - [ ] Update current player
  - [ ] Manage turn scores
  - [ ] Sync with database

- [ ] Implement action execution
  - [ ] Validate actions before execution
  - [ ] Call appropriate API functions
  - [ ] Handle optimistic updates
  - [ ] Manage error states

- [ ] Implement real-time synchronization
  - [ ] Subscribe to game changes
  - [ ] Handle player updates
  - [ ] Process action notifications
  - [ ] Manage connection states

### State Persistence
- [ ] Implement local state backup
  - [ ] Store critical game state
  - [ ] Handle connection drops
  - [ ] Restore state on reconnect
  - [ ] Validate restored state

- [ ] Implement state reconciliation
  - [ ] Compare local vs. server state
  - [ ] Resolve conflicts
  - [ ] Update inconsistent data
  - [ ] Handle merge scenarios

### Optimistic Updates
- [ ] Implement optimistic dice rolling
  - [ ] Update UI immediately
  - [ ] Revert on server error
  - [ ] Show loading indicators
  - [ ] Handle failure cases

- [ ] Implement optimistic score updates
  - [ ] Update scores before server response
  - [ ] Sync with actual results
  - [ ] Handle discrepancies
  - [ ] Provide user feedback

## Game Flow Control

### Game Lifecycle Management
- [x] Implement game creation flow
  - [x] Initialize game state
  - [x] Create first player
  - [x] Set waiting status
  - [x] Generate shareable code

- [x] Implement player joining flow
  - [x] Validate game code
  - [x] Check game capacity
  - [x] Add player to game
  - [x] Update player list

- [x] Implement game start flow
  - [x] Validate minimum players
  - [x] Set active status
  - [x] Initialize first turn
  - [x] Notify all players

### Turn Flow Management
- [x] Implement roll action flow
  - [x] Validate turn
  - [x] Generate dice value
  - [x] Update turn score
  - [x] Handle bust scenario
  - [x] Record action

- [x] Implement hold action flow
  - [x] Validate hold ability
  - [x] Apply score changes
  - [x] Check win condition
  - [x] Switch turns
  - [x] Record action

- [x] Implement turn transition flow
  - [x] Update current player
  - [x] Reset turn state
  - [x] Notify players
  - [x] Update UI

### Game End Flow
- [x] Implement win detection
  - [x] Monitor score thresholds
  - [x] Trigger win condition
  - [x] Stop game actions
  - [x] Record winner

- [x] Implement end game cleanup
  - [x] Update game status
  - [x] Calculate final scores
  - [x] Clean up subscriptions
  - [x] Show results

## Custom Hooks Implementation

### `useGame` Hook
- [x] Implement game state management
  - [x] Load and track game data
  - [x] Provide game actions
  - [x] Handle error states
  - [x] Manage loading states

- [x] Implement action handlers
  - [x] `rollDice()` function
  - [x] `holdTurn()` function
  - [x] `joinGame()` function (via game creation/joining)
  - [ ] `leaveGame()` function

- [x] Implement state selectors
  - [x] `getCurrentPlayer()`
  - [x] `getPlayerScore()` (via myPlayer)
  - [x] `isMyTurn()`
  - [x] `getGameStatus()`

### `useDice` Hook
- [ ] Implement dice state management
  - [ ] Track dice value
  - [ ] Manage rolling state
  - [ ] Handle animations
  - [ ] Provide controls

- [ ] Implement rolling logic
  - [ ] Coordinate server calls
  - [ ] Manage UI feedback
  - [ ] Handle errors
  - [ ] Update game state

### `useGameActions` Hook
- [ ] Implement action management
  - [ ] Queue actions
  - [ ] Handle conflicts
  - [ ] Manage timeouts
  - [ ] Provide feedback

- [ ] Implement action validation
  - [ ] Check prerequisites
  - [ ] Validate permissions
  - [ ] Handle edge cases
  - [ ] Return clear errors

## Error Handling & Edge Cases

### Game Logic Errors
- [ ] Handle invalid game states
  - [ ] Corrupted data scenarios
  - [ ] Inconsistent player states
  - [ ] Invalid turn sequences
  - [ ] Score calculation errors

- [ ] Handle network-related errors
  - [ ] Connection timeouts
  - [ ] Sync failures
  - [ ] Action conflicts
  - [ ] Data inconsistencies

### Edge Case Handling
- [ ] Handle player disconnections
  - [ ] Pause/resume game
  - [ ] Skip inactive players
  - [ ] Handle reconnections
  - [ ] Maintain game state

- [ ] Handle concurrent actions
  - [ ] Prevent double submissions
  - [ ] Handle race conditions
  - [ ] Resolve conflicts
  - [ ] Maintain consistency

- [ ] Handle invalid inputs
  - [ ] Validate user actions
  - [ ] Sanitize data
  - [ ] Prevent cheating
  - [ ] Log suspicious activity

## Testing & Validation

### Unit Tests
- [ ] Test score calculation functions
  - [ ] Normal score scenarios
  - [ ] Bust scenarios
  - [ ] Edge cases (max scores)
  - [ ] Invalid inputs

- [ ] Test turn management
  - [ ] Player cycling
  - [ ] Turn validation
  - [ ] State transitions
  - [ ] Edge cases

- [ ] Test win condition logic
  - [ ] Exact target score
  - [ ] Exceeding target
  - [ ] Multiple winners
  - [ ] Invalid scenarios

### Integration Tests
- [ ] Test complete game flows
  - [ ] Normal game completion
  - [ ] Player joining/leaving
  - [ ] Network interruptions
  - [ ] Error recovery

- [ ] Test hook interactions
  - [ ] State synchronization
  - [ ] Action coordination
  - [ ] Error propagation
  - [ ] Cleanup behavior

### Performance Tests
- [ ] Test with maximum players
- [ ] Test rapid action sequences
- [ ] Test long-running games
- [ ] Test memory usage
- [ ] Test state update frequency

## Game Logic Utilities

### Helper Functions
- [ ] Implement `formatScore()` function
- [ ] Implement `formatGameCode()` function
- [ ] Implement `getPlayerName()` function
- [ ] Implement `isValidAction()` function
- [ ] Implement `getGameDuration()` function

### Game Statistics
- [ ] Implement turn counting
- [ ] Implement action statistics
- [ ] Implement score history
- [ ] Implement game metrics
- [ ] Implement performance tracking

### Debug & Development Tools
- [ ] Implement game state debugger
- [ ] Implement action history viewer
- [ ] Implement state validation tools
- [ ] Implement test data generators
- [ ] Implement simulation tools 