# Technical Requirements Document - Pig Dice Game MVP

## Tech Stack
- **Frontend**: React (with functional components and hooks)
- **Backend/Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Styling**: CSS Modules or Tailwind CSS
- **State Management**: React useState/useEffect + Supabase real-time
- **Deployment**: Vercel/Netlify (Frontend) + Supabase (Backend)

## Database Schema (Supabase Tables)

### 1. `games` Table
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code VARCHAR(6) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  current_player_id UUID,
  winner_id UUID,
  target_score INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. `players` Table
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  total_score INTEGER DEFAULT 0,
  turn_score INTEGER DEFAULT 0,
  player_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. `game_actions` Table
```sql
CREATE TABLE game_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  action_type VARCHAR(20) NOT NULL, -- 'roll', 'hold', 'bust'
  dice_value INTEGER,
  turn_score INTEGER,
  total_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## React Component Architecture

### Core Components
1. **App**: Main application wrapper
2. **GameLobby**: Join/Create game interface
3. **GameBoard**: Main game interface
4. **PlayerList**: Display all players and scores
5. **DiceRoller**: Dice rolling interface
6. **GameActions**: Hold/Roll buttons
7. **GameHistory**: Recent actions log
8. **GameStatus**: Current turn and game state

### Custom Hooks
1. **useGame**: Manage game state and actions
2. **useSupabaseSubscription**: Handle real-time updates
3. **useDice**: Handle dice rolling logic

## API Functions (Supabase)

### Game Management
- `createGame(playerName)`: Create new game and return game code
- `joinGame(gameCode, playerName)`: Join existing game
- `startGame(gameId)`: Start the game when ready
- `endGame(gameId, winnerId)`: Mark game as finished

### Game Actions
- `rollDice(gameId, playerId)`: Roll dice and record action
- `holdTurn(gameId, playerId)`: Hold current turn score
- `switchTurn(gameId)`: Move to next player

### Real-time Subscriptions
- Subscribe to `games` table for game status changes
- Subscribe to `players` table for score updates
- Subscribe to `game_actions` table for game history

## Real-time Features
- **Live Score Updates**: All players see score changes immediately
- **Turn Notifications**: Clear indication when it's your turn
- **Game Actions**: Real-time dice rolls and decisions
- **Player Join/Leave**: Dynamic player list updates

## Security & Data Validation
- **Row Level Security (RLS)**: Enable on all tables
- **Input Validation**: Validate game codes, player names, dice values
- **Game State Validation**: Ensure only current player can make moves
- **Anti-cheating**: Server-side dice generation and validation

## Performance Considerations
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Efficient Queries**: Use proper indexing on frequently queried fields
- **Connection Management**: Handle Supabase connection states
- **Error Handling**: Graceful degradation for network issues

## Environment Configuration
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Dependencies
```json
{
  "react": "^18.x",
  "@supabase/supabase-js": "^2.x",
  "react-router-dom": "^6.x"
}
``` 