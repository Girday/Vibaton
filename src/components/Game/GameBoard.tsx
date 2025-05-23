import { FC, useState, useEffect } from 'react';
import { 
  GameState, 
  ProtectableType, 
  InsuranceCard as InsuranceCardType,
  RiskCard as RiskCardType
} from '@/types/game.types';
import { GAME_CONFIG } from '@/config/game.config';
import { INSURANCE_CARDS } from '@/config/insurance.config';
import { RISK_CARDS } from '@/config/risks.config';
import InsuranceCard from './InsuranceCard';
import RiskCard from './RiskCard';

// Protectable object component
const ProtectableObject: FC<{ type: ProtectableType; hp: number; maxHp: number }> = ({ 
  type, hp, maxHp 
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
      <h3 className="text-lg font-bold mb-2">{getProtectableLabel()}</h3>
      <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
        <div 
          className={`h-4 rounded-full transition-all ${
            hpPercentage > 70 ? 'bg-green-500' : 
            hpPercentage > 40 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} 
          style={{ width: `${hpPercentage}%` }} 
        />
      </div>
      <div className="text-sm text-right">{hp} / {maxHp}</div>
    </div>
  );
};

// Wave and time display
const WaveInfo: FC<{ wave: number; timeLeft: number; phase: GameState['gamePhase'] }> = ({ 
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
  // This state will be moved to a custom hook later
  const [gameState, setGameState] = useState<GameState>({
    wave: 1,
    money: GAME_CONFIG.STARTING_MONEY,
    reputation: 100,
    gamePhase: 'preparation',
    timeLeft: GAME_CONFIG.WAVE_PREPARATION_TIME,
    protectables: {
      [ProtectableType.HOUSE]: {
        type: ProtectableType.HOUSE,
        maxHp: GAME_CONFIG.HOUSE_HP,
        currentHp: GAME_CONFIG.HOUSE_HP,
        defenses: [],
      },
      [ProtectableType.FAMILY]: {
        type: ProtectableType.FAMILY,
        maxHp: GAME_CONFIG.FAMILY_HP,
        currentHp: GAME_CONFIG.FAMILY_HP,
        defenses: [],
      },
      [ProtectableType.CAR]: {
        type: ProtectableType.CAR,
        maxHp: GAME_CONFIG.CAR_HP,
        currentHp: GAME_CONFIG.CAR_HP,
        defenses: [],
      },
      [ProtectableType.WORK]: {
        type: ProtectableType.WORK,
        maxHp: GAME_CONFIG.WORK_HP,
        currentHp: GAME_CONFIG.WORK_HP,
        defenses: [],
      },
    },
    hand: [], // Will be filled with initial cards
    activeRisks: [], // Empty at start
    playedCards: [], // Empty at start
    waveHistory: [],
  });

  // Initialize game with cards
  useEffect(() => {
    // Add some initial insurance cards to the player's hand
    setGameState(prev => ({
      ...prev,
      hand: INSURANCE_CARDS.slice(0, 4) // Start with first 4 insurance cards
    }));
    
    // For demo purposes, add a risk after 5 seconds to show how they appear
    const timer = setTimeout(() => {
      if (gameState.gamePhase === 'attack') {
        setGameState(prev => ({
          ...prev,
          activeRisks: [RISK_CARDS[0], RISK_CARDS[2]] // Add some example risks
        }));
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [gameState.gamePhase]);
  
  // Handler for using insurance cards
  const handleUseInsurance = (card: InsuranceCardType) => {
    // Check if player has enough money
    if (gameState.money < card.cost) {
      console.log("Недостаточно денег");
      return;
    }
    
    // Remove card from hand, add to played cards, and deduct money
    setGameState(prev => ({
      ...prev,
      money: prev.money - card.cost,
      hand: prev.hand.filter(c => c.id !== card.id),
      playedCards: [...prev.playedCards, card],
      // Add the card to relevant protectable objects' defenses
      protectables: {
        ...prev.protectables,
        ...Object.fromEntries(
          card.targets.map((target: ProtectableType) => [
            target,
            {
              ...prev.protectables[target],
              defenses: [...prev.protectables[target].defenses, card]
            }
          ])
        )
      }
    }));
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
        
        {/* Game field with protectable objects */}
        <div className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Защищаемые объекты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(gameState.protectables).map((protectable) => (
              <ProtectableObject 
                key={protectable.type}
                type={protectable.type}
                hp={protectable.currentHp}
                maxHp={protectable.maxHp}
              />
            ))}
          </div>
        </div>
        
        {/* Insurance cards hand */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Доступные страховки</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {gameState.hand.map((card: InsuranceCardType) => (
              <InsuranceCard 
                key={card.id} 
                card={card} 
                onUse={handleUseInsurance}
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
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Активные риски</h2>
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
      </div>
    </div>
  );
};

export default GameBoard;