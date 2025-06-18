# UI Requirements Document - Pig Dice Game MVP

## Design Principles
- **Clean & Minimal**: Focus on gameplay without distractions
- **Mobile-First**: Responsive design that works on all devices
- **Clear Visual Hierarchy**: Important information stands out
- **Intuitive Actions**: Obvious buttons and clear game state
- **Real-time Feedback**: Immediate visual response to user actions

## Color Scheme
- **Primary**: Deep blue (#2563eb) for main actions
- **Secondary**: Green (#16a34a) for positive actions (Hold)
- **Danger**: Red (#dc2626) for risky actions or errors
- **Warning**: Orange (#ea580c) for turn loss (rolling 1)
- **Background**: Light gray (#f9fafb) with white cards
- **Text**: Dark gray (#1f2937) for readability

## Layout Structure

### 1. Game Lobby Screen
```
┌─────────────────────────────────────┐
│           🎲 PIG DICE GAME          │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │       CREATE GAME           │    │
│  │   [Your Name Input]         │    │
│  │   [Create Game Button]      │    │
│  └─────────────────────────────┘    │
│                                     │
│            --- OR ---               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       JOIN GAME             │    │
│  │   [Game Code Input]         │    │
│  │   [Your Name Input]         │    │
│  │   [Join Game Button]        │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 2. Game Board Screen
```
┌─────────────────────────────────────┐
│  Game: ABC123    👑 Target: 100     │
├─────────────────────────────────────┤
│                                     │
│  ┌─── PLAYERS ───┐  ┌─── DICE ───┐  │
│  │ Player 1: 45  │  │     🎲      │  │
│  │ Player 2: 23* │  │      4      │  │
│  │ Player 3: 67  │  │             │  │
│  └───────────────┘  └─────────────┘  │
│                                     │
│  ┌─────── CURRENT TURN ──────────┐  │
│  │ Player 2's Turn                │  │
│  │ Turn Score: 8                  │  │
│  │ [🎲 ROLL] [✋ HOLD]           │  │
│  └────────────────────────────────┘  │
│                                     │
│  ┌─────── GAME HISTORY ───────────┐ │
│  │ Player 2 rolled 4              │ │
│  │ Player 1 held for 12 points    │ │
│  │ Player 2 rolled 1 - BUST!      │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Component Specifications

### 1. Game Header
- **Game Code**: Large, bold, easy to share
- **Target Score**: Clear goal indicator
- **Status Indicator**: Waiting/Active/Finished states

### 2. Players List
- **Player Cards**: Individual cards for each player
- **Current Player**: Highlighted with border/background
- **Scores**: Large, readable numbers
- **Turn Indicator**: Clear visual marker (*)

### 3. Dice Display
- **Large Dice Visual**: Prominent 3D-style dice or emoji
- **Roll Animation**: Smooth rolling animation (1-2 seconds)
- **Value Display**: Large, clear number

### 4. Game Actions
- **Roll Button**: 
  - Primary blue color
  - Large, finger-friendly size (min 44px)
  - Disabled when not player's turn
  - Loading state during roll
- **Hold Button**:
  - Green color for positive action
  - Same size as roll button
  - Shows current turn score

### 5. Turn Status
- **Current Player**: Bold name with highlight
- **Turn Score**: Large number with label
- **Instructions**: Clear next action guidance

### 6. Game History
- **Scrollable Feed**: Recent 5-7 actions
- **Action Types**: Different icons for roll/hold/bust
- **Timestamps**: Relative time (e.g., "2 seconds ago")
- **Color Coding**: Green for holds, red for busts

## Interactive States

### Button States
1. **Default**: Normal appearance
2. **Hover**: Slight color darkening
3. **Active**: Pressed state
4. **Disabled**: Grayed out with cursor not-allowed
5. **Loading**: Spinner or animation

### Visual Feedback
- **Successful Actions**: Green checkmark or flash
- **Bust (Roll 1)**: Red flash with shake animation
- **Turn Change**: Smooth transition to next player
- **Game End**: Confetti or celebration animation

## Responsive Design

### Mobile (320px - 768px)
- Single column layout
- Stack components vertically
- Larger touch targets (48px minimum)
- Simplified player list (compact view)

### Tablet (768px - 1024px)
- Two-column layout (players + game area)
- Medium-sized components
- Touch-friendly interactions

### Desktop (1024px+)
- Three-column layout option
- Hover states for buttons
- Larger dice and visual elements

## Typography
- **Headings**: Bold, sans-serif (e.g., Inter, Roboto)
- **Body Text**: Regular weight, high contrast
- **Numbers**: Monospace for scores (e.g., JetBrains Mono)
- **Buttons**: Medium weight, uppercase

## Animations & Transitions
- **Dice Roll**: 1-2 second rolling animation
- **Score Updates**: Number counting animation
- **Turn Changes**: Smooth highlight transitions
- **Page Transitions**: Fade in/out (300ms)
- **Button Feedback**: Scale on press (150ms)

## Error States
- **Network Error**: Toast notification with retry option
- **Invalid Game Code**: Red border on input with message
- **Connection Lost**: Banner with reconnect status
- **Game Full**: Clear message with alternative actions

## Loading States
- **Initial Load**: Skeleton screens
- **Dice Roll**: Rolling animation
- **Joining Game**: Loading spinner
- **Action Processing**: Button loading state

## Empty States
- **No Game History**: "Game just started" message
- **Waiting for Players**: "Share game code" prompt
- **Game Ended**: Winner celebration with "Play Again" option 