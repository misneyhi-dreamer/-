import React, { useState, useRef, useCallback } from 'react';
import type { DifficultyLevel } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';

interface StartScreenProps {
  onStart: (difficulty: DifficultyLevel, playerImage: string, playerName: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DIFFICULTY_LEVELS[2]);
  const [playerImage, setPlayerImage] = useState<string>('https://picsum.photos/100');
  const [playerName, setPlayerName] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setImageError('이미지 파일은 2MB를 초과할 수 없습니다.');
          return;
      }
      if (!file.type.startsWith('image/')) {
          setImageError('이미지 파일만 업로드할 수 있습니다.');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
        setImageError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = useCallback(() => {
      fileInputRef.current?.click();
  }, []);

  const handleStartClick = () => {
    if (playerName.trim()) {
        onStart(selectedDifficulty, playerImage, playerName.trim());
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center max-w-lg w-full transform transition-all hover:scale-105 duration-300">
      <h1 className="text-4xl font-bold text-yellow-800 mb-2">하늘에서 내리는 똥피하기</h1>
      <p className="text-gray-600 mb-6">얼굴과 이름을 등록하고 똥비를 피해보세요!</p>

       <div className="mb-6">
        <p className="font-semibold text-lg mb-4 text-gray-700">캐릭터 설정</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 shadow-md mb-4 bg-gray-200">
                    <img src={playerImage} alt="Player character" className="w-full h-full object-cover" />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <button
                    onClick={triggerFileSelect}
                    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                    이미지 선택
                </button>
                {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
            </div>
            <div className="w-full sm:w-auto">
                 <label htmlFor="playerName" className="font-semibold text-gray-700 mb-2 block">이름</label>
                 <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={10}
                    placeholder="이름 입력 (10자 이내)"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition"
                />
            </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="font-semibold text-lg mb-3 text-gray-700">난이도 선택</p>
        <div className="flex flex-wrap justify-center gap-2">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.name}
              onClick={() => setSelectedDifficulty(level)}
              className={`py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                selectedDifficulty.name === level.name
                  ? 'bg-amber-600 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStartClick}
        disabled={!playerName.trim()}
        className="w-full bg-green-500 text-white font-bold text-xl py-3 rounded-lg hover:bg-green-600 transition duration-300 transform hover:scale-105 shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
      >
        게임 시작!
      </button>
    </div>
  );
};

export default StartScreen;