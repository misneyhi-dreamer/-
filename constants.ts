
import type { DifficultyLevel } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 60;
export const PLAYER_SPEED = 10;

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { name: '아주 쉬움', poopSpeed: 2, poopSpawnRate: 1000, poopSize: 40 },
  { name: '쉬움', poopSpeed: 3, poopSpawnRate: 700, poopSize: 36 },
  { name: '보통', poopSpeed: 4, poopSpawnRate: 500, poopSize: 32 },
  { name: '어려움', poopSpeed: 5, poopSpawnRate: 350, poopSize: 28 },
  { name: '지옥', poopSpeed: 7, poopSpawnRate: 200, poopSize: 24 },
];
