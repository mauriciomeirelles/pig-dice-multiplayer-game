# Product Requirements Document - Pig Dice Game MVP

## Overview
A multiplayer web-based implementation of the classic "Pig" dice game where players take turns rolling a die to accumulate points, with the risk of losing their turn points if they roll a 1.

## Game Rules
1. **Objective**: First player to reach 100 points wins
2. **Turn Structure**: 
   - Player rolls a single die
   - If roll is 2-6: points are added to turn total, player can choose to "Hold" or "Roll Again"
   - If roll is 1: turn ends immediately, turn points are lost
   - If player chooses "Hold": turn points are added to total score, turn passes to next player
3. **Winning**: Game ends when a player reaches or exceeds 100 points

## Core Features (MVP)
- **Game Creation**: Players can create a new game room
- **Game Joining**: Players can join existing games via game code/ID
- **Real-time Gameplay**: Live dice rolling and score updates
- **Turn Management**: Clear indication of whose turn it is
- **Score Tracking**: Display current scores and turn progress
- **Game History**: Show recent rolls and actions
- **Winner Declaration**: Clear end game state with winner announcement

## User Stories
1. As a player, I want to create a new game so I can invite friends
2. As a player, I want to join a game using a game code
3. As a player, I want to roll the dice during my turn
4. As a player, I want to see my current turn points and decide to hold or continue
5. As a player, I want to see all players' scores in real-time
6. As a player, I want to know when it's my turn
7. As a player, I want to see the game history (recent rolls)
8. As a player, I want to know when the game ends and who won

## Non-MVP Features (Future)
- Player profiles and statistics
- Multiple game rooms management
- Game spectating
- Custom scoring rules
- Analytics and reporting
- Accessibility features 