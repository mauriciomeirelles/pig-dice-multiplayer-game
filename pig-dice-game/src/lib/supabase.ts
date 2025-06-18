import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Game {
  id: string;
  game_code: string;
  status: 'waiting' | 'active' | 'finished';
  current_player_id?: string;
  winner_id?: string;
  target_score: number;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  game_id: string;
  name: string;
  total_score: number;
  turn_score: number;
  player_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GameAction {
  id: string;
  game_id: string;
  player_id: string;
  action_type: 'roll' | 'hold' | 'bust';
  dice_value?: number;
  turn_score?: number;
  total_score?: number;
  created_at: string;
}

export interface GameState {
  game: Game;
  players: Player[];
  actions: GameAction[];
} 