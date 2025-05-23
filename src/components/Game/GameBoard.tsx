'use client';

import { FC } from 'react';
import { 
  ProtectableType, 
  InsuranceCard as InsuranceCardType,
  RiskCard as RiskCardType,
} from '@/types/game.types';
import { GAME_CONFIG } from '@/config/game.config';
import useGameState from '@/hooks/useGameState';
import InsuranceCard from './InsuranceCard';
import RiskCard from './RiskCard';
import WaveSummary from './WaveSummary';

// Helper to calculate total protection from all defenses
const calculateTotalProtection = (defenses: InsuranceCardType[]): number => {
  // Simple implementation: take the highest protection value
  // A more complex implementation could be a weighted average or cumulative value
  if (defenses.length === 0) return 0;
  return Math.max(...defenses.map(d => d.protection));
};

// Protectable object component
const ProtectableObject: FC<{ 
  type: ProtectableType; 
  hp: number; 
  maxHp: number;
  defenses?: InsuranceCardType[];
}> = ({ 
  type, hp, maxHp, defenses = []
}) => {
  const hpPercentage = (hp / maxHp) * 100;
  const getProtectableLabel = () => {
    switch (type) {
      case ProtectableType.HOUSE: return 'Дом';
      case ProtectableType.FAMILY: return 'Семья';
      case ProtectableType.CAR: return 'Автомобиль';
      case ProtectableType.WORK: return 'Работа';
    }
  };

  return (
    <div className="bg-white/20 rounded-lg p-4 shadow-md border border-gray-300/30 w-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{getProtectableLabel()}</h3>
        {defenses.length > 0 && (
          <div className="flex space-x-1">
            {defenses.slice(0, 3).map((defense, index) => (
              <div 
                key={index} 
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm border-2 border-blue-700"
                title={defense.name}
              >
                {defense.name.charAt(0)}
              </div>
            ))}
            {defenses.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm border-2 border-blue-700">
                +{defenses.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
        <div 
          className={`h-4 rounded-full transition-all ${
            hpPercentage > 70 ? 'bg-green-500' : 
            hpPercentage > 40 ? 'bg-yellow-500' : 
            'bg-red-500 health-critical'
          }`} 
          style={{ width: `${hpPercentage}%` }} 
        />
      </div>
      <div className="text-sm text-right">{hp} / {maxHp}</div>
      
      {/* Total protection indicator */}
      {defenses.length > 0 && (
        <div className="mt-2 text-xs text-blue-300">
          Общая защита: {calculateTotalProtection(defenses)}%
        </div>
      )}
    </div>
  );
};

// Wave and time display
const WaveInfo: FC<{ wave: number; timeLeft: number; phase: string }> = ({ 
  wave, timeLeft, phase 
}) => {
  return (
    <div className="flex justify-between items-center bg-blue-900/80 text-white p-3 rounded-lg shadow-md">
      <div className="text-lg font-bold">Волна: {wave}/{GAME_CONFIG.TOTAL_WAVES}</div>
      <div className="flex flex-col items-center">
        <div className="text-sm uppercase font-medium">
          {phase === 'preparation' ? 'Подготовка' : 
           phase === 'attack' ? 'Атака' : 
           phase === 'summary' ? 'Итоги' : 'Конец игры'}
        </div>
        <div className="text-xl font-mono">{Math.ceil(timeLeft / 1000)}с</div>
      </div>
    </div>
  );
};

// Resources display
const ResourcesPanel: FC<{ money: number; reputation: number }> = ({ 
  money, reputation 
}) => {
  return (
    <div className="flex gap-4 bg-gray-800/80 text-white p-3 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 font-bold text-lg">💰</span>
        <span className="font-bold">{money}₽</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-blue-400 font-bold text-lg">⭐</span>
        <span className="font-bold">{reputation}</span>
      </div>
    </div>
  );
};

// Main GameBoard component
const GameBoard: FC = () => {
  console.log("Рендеринг GameBoard");
  
  // Используем хук useGameState вместо локального состояния
  const { gameState, useInsuranceCard, startNextWave, resetGame } = useGameState();

  // Обработчик для продолжения или перезапуска игры
  const handleContinue = () => {
    console.log("Вызван handleContinue");
    console.log("Текущая волна:", gameState.wave, "Всего волн:", GAME_CONFIG.TOTAL_WAVES);
    
    if (gameState.wave >= GAME_CONFIG.TOTAL_WAVES) {
      console.log("Игра завершена, перезапускаем");
      resetGame();
    } else {
      console.log("Переходим к следующей волне");
      startNextWave();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      <div className="container mx-auto p-4 max-w-5xl">
        {/* Wave info and resources */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <WaveInfo 
            wave={gameState.wave} 
            timeLeft={gameState.timeLeft} 
            phase={gameState.gamePhase}
          />
          <ResourcesPanel 
            money={gameState.money} 
            reputation={gameState.reputation} 
          />
        </div>
        
        {/* Game field with protectable objects - увеличен размер grid-ячеек */}
        <div className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Защищаемые объекты</h2>
          <div className="grid grid-cols-1 gap-10">
            {Object.values(gameState.protectables).map((protectable) => (
              <ProtectableObject 
                key={protectable.type}
                type={protectable.type}
                hp={protectable.currentHp}
                maxHp={protectable.maxHp}
                defenses={protectable.defenses}
              />
            ))}
          </div>
        </div>
        
        {/* Insurance cards hand - компактное размещение */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-2xl shadow-lg mb-4">
          <h2 className="text-xl font-bold mb-2">Доступные страховки</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {gameState.hand.map((card: InsuranceCardType) => (
              <InsuranceCard 
                key={card.id} 
                card={card} 
                onUse={useInsuranceCard}
                disabled={gameState.gamePhase !== 'preparation' || gameState.money < card.cost}
              />
            ))}
            {gameState.hand.length === 0 && (
              <div className="text-center p-4 text-gray-300 w-full">
                У вас нет доступных страховок.
              </div>
            )}
          </div>
        </div>
        
        {/* Risks section */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">Активные риски</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {gameState.activeRisks.map((riskCard: RiskCardType) => (
              <RiskCard 
                key={riskCard.id} 
                card={riskCard} 
                progress={50} // This will be dynamic in the full implementation
              />
            ))}
            {gameState.activeRisks.length === 0 && (
              <div className="text-center p-4 text-gray-300 w-full">
                Рисков пока нет. Готовьтесь к волне!
              </div>
            )}
          </div>
        </div>
        
        {/* Wave Summary - теперь используем модальное окно */}
        <WaveSummary 
          waveHistory={gameState.waveHistory}
          currentWave={gameState.wave}
          totalWaves={GAME_CONFIG.TOTAL_WAVES}
          isOpen={gameState.gamePhase === 'summary' || gameState.gamePhase === 'game_over'}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
};

export default GameBoard;