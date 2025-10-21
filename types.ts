
export enum GameState {
  Start,
  Playing,
  GameOver,
}

export interface DifficultyLevel {
  name: string;
  poopSpeed: number; // pixels per frame
  poopSpawnRate: number; // milliseconds
  poopSize: number; // pixels
}

export interface Poop {
  id: number;
  x: number;
  y: number;
}
