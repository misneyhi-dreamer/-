import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { DifficultyLevel, Poop } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants';

interface GameScreenProps {
  difficulty: DifficultyLevel;
  playerImage: string | null;
  playerName: string;
  onGameOver: (score: number, didWin: boolean) => void;
}

const GAME_DURATION = 15; // 15 seconds

const GameScreen: React.FC<GameScreenProps> = ({ difficulty, playerImage, playerName, onGameOver }) => {
  const [playerPosition, setPlayerPosition] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [poops, setPoops] = useState<Poop[]>([]);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const gameLoopRef = useRef<number | null>(null);
  const lastPoopTimeRef = useRef(performance.now());
  const scoreIntervalRef = useRef<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Game loop for moving and spawning poops.
  // This uses functional updates to `setPoops` to avoid stale state,
  // making the callback itself stable.
  const gameLoop = useCallback(() => {
    setPoops(currentPoops => {
        let nextPoops = currentPoops.map(p => ({ ...p, y: p.y + difficulty.poopSpeed }));

        const now = performance.now();
        if (now - lastPoopTimeRef.current > difficulty.poopSpawnRate) {
            lastPoopTimeRef.current = now;
            nextPoops.push({
                id: now,
                x: Math.random() * (GAME_WIDTH - difficulty.poopSize),
                y: -difficulty.poopSize,
            });
        }
        return nextPoops.filter(p => p.y < GAME_HEIGHT);
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [difficulty]);

  // Effect to start/stop the game loop and score interval.
  useEffect(() => {
    if (isPaused) {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
        gameLoopRef.current = null;
        scoreIntervalRef.current = null;
        return;
    };

    lastPoopTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    scoreIntervalRef.current = window.setInterval(() => setScore(prev => prev + 10), 100);

    return () => {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };
  }, [isPaused, gameLoop]);
  
  // Effect for collision detection.
  useEffect(() => {
    if (isPaused) return;

    const playerRect = { x: playerPosition, y: GAME_HEIGHT - PLAYER_HEIGHT, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
    
    for (const poop of poops) {
      const poopRect = { x: poop.x, y: poop.y, width: difficulty.poopSize, height: difficulty.poopSize };
      if (
          playerRect.x < poopRect.x + poopRect.width &&
          playerRect.x + playerRect.width > poopRect.x &&
          playerRect.y < poopRect.y + poopRect.height &&
          playerRect.y + playerRect.height > poopRect.y
      ) {
          onGameOver(score, false);
          return;
      }
    }
  }, [poops, playerPosition, difficulty.poopSize, onGameOver, score, isPaused]);


  // Game timer countdown
  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      onGameOver(score, true);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, isPaused, onGameOver]);

  // Mouse movement listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current || isPaused) return;
      const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = e.clientX - gameAreaRect.left;
      let newPlayerX = mouseX - PLAYER_WIDTH / 2;
      newPlayerX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newPlayerX));
      setPlayerPosition(newPlayerX);
    };
    const gameArea = gameAreaRef.current;
    gameArea?.addEventListener('mousemove', handleMouseMove);
    return () => gameArea?.removeEventListener('mousemove', handleMouseMove);
  }, [isPaused]);

  // Keyboard listener for pausing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'ㅔ') {
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={gameAreaRef}
      className="relative bg-sky-300 rounded-lg shadow-2xl overflow-hidden border-4 border-amber-800 cursor-none"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      <div className="absolute top-2 left-2 flex gap-2 z-10">
        <div className="bg-black/50 text-white p-2 rounded-md text-xl font-bold">
          점수: {score}
        </div>
        <div className="bg-black/50 text-white p-2 rounded-md text-xl font-bold">
          남은 시간: {timeLeft}초
        </div>
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-md text-lg font-semibold z-10">
        난이도: {difficulty.name}
      </div>
      {isPaused && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
          <h2 className="text-5xl font-bold text-white mb-4">일시정지</h2>
          <p className="text-xl text-yellow-300">'P' 키를 눌러 계속하기</p>
        </div>
      )}
      
      {/* Player */}
      <div
        className="absolute bottom-0 flex flex-col items-center"
        style={{
          left: `${playerPosition}px`,
          width: `${PLAYER_WIDTH}px`,
          transform: 'translateX(0)',
        }}
      >
        <div className="bg-black/60 text-white text-sm font-bold px-2 py-1 rounded-t-lg">
          {playerName}
        </div>
        <div
          className="w-16 h-16 rounded-full bg-cover bg-center border-4 border-yellow-400"
          style={{
            width: `${PLAYER_WIDTH}px`,
            height: `${PLAYER_HEIGHT}px`,
            backgroundImage: playerImage ? `url(${playerImage})` : 'none',
            backgroundColor: !playerImage ? '#f4a261' : 'transparent',
          }}
        />
      </div>

      {/* Poops */}
      {poops.map((poop) => (
        <div
          key={poop.id}
          className="absolute text-4xl"
          style={{
            left: `${poop.x}px`,
            top: `${poop.y}px`,
            fontSize: `${difficulty.poopSize}px`
          }}
        >
          💩
        </div>
      ))}
    </div>
  );
};

export default GameScreen;