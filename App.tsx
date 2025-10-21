import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState } from './types';
import type { DifficultyLevel } from './types';
import { DIFFICULTY_LEVELS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DIFFICULTY_LEVELS[2]);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [didWin, setDidWin] = useState<boolean>(false);

  const handleGameStart = useCallback((selectedDifficulty: DifficultyLevel, image: string, name: string) => {
    setDifficulty(selectedDifficulty);
    setPlayerImage(image);
    setPlayerName(name);
    setGameState(GameState.Playing);
  }, []);

  const handleGameOver = useCallback((score: number, win: boolean) => {
    setFinalScore(score);
    setDidWin(win);
    setGameState(GameState.GameOver);
  }, []);

  const handleRestart = useCallback(() => {
    setFinalScore(0);
    setDidWin(false);
    // Let's not reset the player image, name and difficulty, so they can quickly restart.
    setGameState(GameState.Start);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return <GameScreen difficulty={difficulty} playerImage={playerImage} playerName={playerName} onGameOver={handleGameOver} />;
      case GameState.GameOver:
        return <GameOverScreen score={finalScore} onRestart={handleRestart} didWin={didWin} />;
      case GameState.Start:
      default:
        return <StartScreen onStart={handleGameStart} />;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen font-sans p-4">
        {renderContent()}
    </main>
  );
};

export default App;