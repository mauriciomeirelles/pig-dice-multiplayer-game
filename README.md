# 🎲 Pig Dice Multiplayer Game

A real-time multiplayer implementation of the classic Pig Dice game built with React, TypeScript, and Supabase. Challenge friends to race to your target score, but watch out for those dangerous 1s!

![Game Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 🎮 Game Features

### Core Gameplay
- **Real-time Multiplayer**: Play with 2-8 players simultaneously
- **Customizable Target Score**: Choose from 50-300 points (Quick to Marathon modes)
- **Live Game Updates**: See other players' moves in real-time
- **Responsive Design**: Play on desktop, tablet, or mobile

### Game Mechanics
- **Rolling**: Roll 2-6 to add points to your turn total
- **Holding**: Bank your turn points and pass the dice
- **Busting**: Roll a 1 and lose all turn points!
- **Winning**: First player to reach the target score wins

### Technical Features
- **TypeScript**: Full type safety throughout the codebase
- **Real-time Subscriptions**: Powered by Supabase real-time engine
- **Animated UI**: Smooth dice rolling and score animations
- **Game History**: See the last 10 actions taken by all players
- **Error Handling**: Comprehensive error handling and loading states

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mauriciomeirelles/pig-dice-multiplayer-game.git
   cd pig-dice-multiplayer-game
   ```

2. **Install dependencies**
   ```bash
   cd pig-dice-game
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Add your Supabase credentials
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Run these SQL commands in your Supabase SQL editor:
   
   ```sql
   -- Create games table
   CREATE TABLE games (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     game_code VARCHAR(6) UNIQUE NOT NULL,
     status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
     current_player_id UUID,
     winner_id UUID,
     target_score INTEGER DEFAULT 100,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create players table
   CREATE TABLE pig_dice_players (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     game_id UUID REFERENCES games(id) ON DELETE CASCADE,
     name VARCHAR(50) NOT NULL,
     total_score INTEGER DEFAULT 0,
     turn_score INTEGER DEFAULT 0,
     player_order INTEGER NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create game actions table
   CREATE TABLE game_actions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     game_id UUID REFERENCES games(id) ON DELETE CASCADE,
     player_id UUID REFERENCES pig_dice_players(id) ON DELETE CASCADE,
     action_type VARCHAR(10) NOT NULL CHECK (action_type IN ('roll', 'hold', 'bust')),
     dice_value INTEGER,
     turn_score INTEGER DEFAULT 0,
     total_score INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE games ENABLE ROW LEVEL SECURITY;
   ALTER TABLE pig_dice_players ENABLE ROW LEVEL SECURITY;
   ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;

   -- Create policies (simplified for demo)
   CREATE POLICY "Allow all access to games" ON games FOR ALL USING (true);
   CREATE POLICY "Allow all access to pig_dice_players" ON pig_dice_players FOR ALL USING (true);
   CREATE POLICY "Allow all access to game_actions" ON game_actions FOR ALL USING (true);

   -- Enable real-time subscriptions
   ALTER PUBLICATION supabase_realtime ADD TABLE games;
   ALTER PUBLICATION supabase_realtime ADD TABLE pig_dice_players;
   ALTER PUBLICATION supabase_realtime ADD TABLE game_actions;
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` and start playing!

## 🎯 How to Play

1. **Create a Game**: Enter your name and choose a target score (50-300 points)
2. **Share the Code**: Give the 6-character game code to your friends
3. **Start Playing**: Once you have 2+ players, click "Start Game"
4. **Take Turns**: 
   - **Roll**: Click "Roll Dice" to roll 2-6 and add to your turn score
   - **Hold**: Click "Hold" to bank your turn score and pass the dice
   - **Bust**: Roll a 1 and lose all your turn points!
5. **Win**: First player to reach the target score wins!

## 🏗️ Project Structure

```
pig-dice-game/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── GameLobby.tsx  # Create/Join game interface
│   │   ├── GameBoard.tsx  # Main game interface
│   │   ├── PlayerList.tsx # Player cards and scores
│   │   ├── DiceDisplay.tsx# Animated dice component
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   └── useGame.ts     # Main game state management
│   ├── lib/               # API and utilities
│   │   ├── supabase.ts    # Supabase client setup
│   │   └── gameApi.ts     # Game API functions
│   └── index.css          # Global styles and design system
├── tasks/                 # Development task tracking
└── specs/                 # Project requirements
```

## 🛠️ Technical Architecture

### Frontend
- **React 18** with functional components and hooks
- **TypeScript** for type safety and better developer experience
- **Custom CSS** with design system and CSS variables
- **Real-time Updates** via Supabase subscriptions

### Backend (Supabase)
- **PostgreSQL** database with relational schema
- **Real-time subscriptions** for live game updates
- **Row Level Security** for data protection
- **Edge Functions** for server-side game logic

### Key Components
- **useGame Hook**: Manages game state, real-time subscriptions, and actions
- **GameAPI**: Server-side game logic and validation
- **DiceDisplay**: Animated dice with bust effects
- **PlayerList**: Real-time player status and scores

## 🎨 Design System

The game features a comprehensive design system with:

- **Color Palette**: Primary blue, secondary green, with status colors
- **Typography**: Inter font family with monospace scores
- **Spacing**: Consistent 4px-based spacing scale
- **Components**: Reusable buttons, cards, and form elements
- **Animations**: Smooth dice rolling, score updates, and transitions

## 🚀 Deployment

### Netlify/Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in your hosting platform
3. Deploy with build command: `npm run build`

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the build/ folder to your hosting service
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Classic Pig Dice game rules
- Supabase for excellent real-time database
- React and TypeScript communities
- Game design inspiration from traditional dice games

## 📞 Support

If you have any questions or run into issues:
- Open an issue on GitHub
- Check the troubleshooting section in the docs
- Review the game rules if you're unsure about gameplay

---

**Have fun playing! 🎲** 