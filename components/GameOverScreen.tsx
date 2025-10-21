import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  didWin: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart, didWin }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in">
      {didWin ? (
        <>
          <h1 className="text-5xl font-bold text-green-600 mb-4">승리!</h1>
          <p className="text-gray-700 text-2xl mb-2">축하합니다! 똥비를 피하는 데 성공했습니다!</p>
          <p className="text-gray-700 text-xl mb-2">최종 점수:</p>
          <p className="text-6xl font-bold text-blue-700 mb-8">{score}</p>
        </>
      ) : (
        <>
          <h1 className="text-5xl font-bold text-red-600 mb-4">게임 오버!</h1>
          <p className="text-gray-700 text-2xl mb-2">당신의 최종 점수는...</p>
          <p className="text-6xl font-bold text-amber-700 mb-8">{score}</p>
        </>
      )}
      <button
        onClick={onRestart}
        className="w-full bg-blue-500 text-white font-bold text-xl py-3 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 shadow-lg"
      >
        다시하기
      </button>
    </div>
  );
};

export default GameOverScreen;