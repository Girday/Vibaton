'use client';

import { FC } from 'react';
import Modal from '../UI/Modal';

interface WaveHistoryItem {
  wave: number;
  damageTaken: number;
  moneyEarned: number;
  risksDefeated: number;
}

interface WaveSummaryProps {
  waveHistory: WaveHistoryItem[];
  currentWave: number;
  totalWaves: number;
  isOpen: boolean;
  onContinue: () => void;
}

const WaveSummary: FC<WaveSummaryProps> = ({ 
  waveHistory, 
  currentWave,
  totalWaves,
  isOpen,
  onContinue 
}) => {
  // Получаем историю текущей волны, если она существует
  const currentWaveHistory = waveHistory.find(h => h.wave === currentWave);
  const isGameComplete = currentWave >= totalWaves;
  
  // Вычисление общей статистики для всех волн
  const totalStats = waveHistory.reduce(
    (acc, wave) => {
      return {
        damageTaken: acc.damageTaken + wave.damageTaken,
        moneyEarned: acc.moneyEarned + wave.moneyEarned,
        risksDefeated: acc.risksDefeated + wave.risksDefeated,
      };
    },
    { damageTaken: 0, moneyEarned: 0, risksDefeated: 0 }
  );

  // Определяем оценку прохождения волны
  const getWaveRating = (waveHistory: WaveHistoryItem): string => {
    if (!waveHistory) return "Без оценки";
    
    if (waveHistory.damageTaken === 0) return "Идеально!";
    if (waveHistory.damageTaken < 100) return "Отлично!";
    if (waveHistory.damageTaken < 300) return "Хорошо";
    if (waveHistory.damageTaken < 500) return "Удовлетворительно";
    return "Выжил";
  };
  
  // Обработчик продолжения/перезапуска с дополнительным логированием
  const handleContinueClick = () => {
    console.log("Кнопка нажата в WaveSummary");
    onContinue();
  };
  
  return (
    <Modal isOpen={isOpen}>
      {isGameComplete ? (
        // Экран завершения игры
        <>
          <h2 className="text-3xl font-bold text-center text-white mb-6">Игра завершена!</h2>
          <div className="text-lg text-center text-blue-300 mb-8">
            Вы успешно прошли все {totalWaves} волн атаки рисков!
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Общая статистика:</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{totalStats.moneyEarned}₽</div>
                <div className="text-sm text-gray-300">Заработано</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{totalStats.damageTaken}</div>
                <div className="text-sm text-gray-300">Урон получен</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{totalStats.risksDefeated}</div>
                <div className="text-sm text-gray-300">Рисков отражено</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-white mb-6">
            <p className="mb-4">Вы стали настоящим профессионалом в управлении рисками!</p>
            <p className="text-sm text-gray-300">
              Страховая защита - ключ к спокойствию и безопасности в неопределенном мире.
            </p>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleContinueClick}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
            >
              Сыграть снова
            </button>
          </div>
        </>
      ) : (
        // Экран итогов волны
        <>
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Результаты волны {currentWave}
          </h2>
          
          {currentWaveHistory ? (
            <>
              <div className="text-center mb-6">
                <span className={`text-lg font-semibold inline-block px-4 py-1 rounded-full ${
                  currentWaveHistory.damageTaken === 0 ? 'bg-green-600' : 
                  currentWaveHistory.damageTaken < 200 ? 'bg-green-500' : 
                  currentWaveHistory.damageTaken < 400 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}>
                  {getWaveRating(currentWaveHistory)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-yellow-400">{currentWaveHistory.moneyEarned}₽</div>
                  <div className="text-xs text-gray-300">Заработано</div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-red-400">{currentWaveHistory.damageTaken}</div>
                  <div className="text-xs text-gray-300">Урон получен</div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-400">{currentWaveHistory.risksDefeated}</div>
                  <div className="text-xs text-gray-300">Рисков отражено</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-300 mb-6">
              Данные о волне не найдены
            </div>
          )}
          
          <div className="text-center mb-6">
            <p className="text-white">
              Вы успешно защитили свои активы! Впереди еще больше испытаний.
            </p>
            <p className="text-sm text-gray-300 mt-2">
              {`Следующая волна: ${currentWave + 1}/${totalWaves}`}
            </p>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleContinueClick}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
            >
              Продолжить
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default WaveSummary;