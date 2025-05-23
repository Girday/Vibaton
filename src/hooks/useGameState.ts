import { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  InsuranceCard,
  RiskCard,
  ProtectableType
} from '@/types/game.types';
import { GAME_CONFIG } from '@/config/game.config';
import { WAVE_DIFFICULTY } from '@/config/game.config';
import { INSURANCE_CARDS } from '@/config/insurance.config';
import { RISK_CARDS } from '@/config/risks.config';

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const useGameState = () => {
  // Initialize the game state
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

  // Initialize the game
  useEffect(() => {
    // Draw initial insurance cards
    drawCards(4);
  }, []);

  // Новый таймер с исправленной логикой
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Для использования внутри таймера
    const runAttackPhase = (wave: number) => {
      console.log("Запуск фазы атаки для волны", wave);
      
      // Сначала спауним риски
      const waveDifficulty = WAVE_DIFFICULTY[wave as keyof typeof WAVE_DIFFICULTY];
      if (!waveDifficulty) return;
      
      const { enemiesCount, difficultyMultiplier } = waveDifficulty;
      
      // Создаем риски
      const risks = RISK_CARDS
        .sort(() => Math.random() - 0.5)
        .slice(0, enemiesCount)
        .map(risk => ({
          ...risk,
          id: `${risk.id}_${generateId()}`,
          damage: Math.floor(risk.damage * difficultyMultiplier)
        }));
        
      // Обновляем состояние с новыми рисками
      setGameState(prev => ({
        ...prev,
        activeRisks: risks
      }));
      
      // После небольшой задержки (для визуализации) применяем урон
      setTimeout(() => {
        console.log("Применяем урон от рисков");
        
        setGameState(prev => {
          // Apply damage from each risk
          const newProtectables = { ...prev.protectables };
          let gameOver = false;
          let totalMoney = prev.money;
          let defeatedRisks = 0;
          
          // Для каждого риска считаем и применяем урон ОДИН РАЗ
          prev.activeRisks.forEach(risk => {
            console.log(`Риск ${risk.name} атакует ${risk.target}`);
            console.log(`Базовый урон: ${risk.damage}`);
            
            const targetType = risk.target;
            const target = newProtectables[targetType];
            
            // Calculate damage after defense
            let finalDamage = risk.damage;
            console.log(`Защиты: ${target.defenses.length}`);
            
            // Если есть защиты, то дополнительно даем деньги за успешную защиту
            if (target.defenses.length > 0) {
              // Бонус за каждую страховку
              const bonusPerInsurance = 1000;
              totalMoney += target.defenses.length * bonusPerInsurance;
              defeatedRisks++;
              
              console.log(`Получен бонус за защиту: ${target.defenses.length * bonusPerInsurance}₽`);
            }
            
            target.defenses.forEach(defense => {
              // Apply protection percentage
              const reduction = defense.protection / 100;
              const reducedAmount = Math.floor(finalDamage * reduction);
              console.log(`Защита ${defense.name} блокирует ${reducedAmount} (${defense.protection}%)`);
              finalDamage = finalDamage - reducedAmount;
            });
            
            console.log(`Финальный урон после защиты: ${finalDamage}`);
            
            // Apply damage - проверяем, чтобы не получился отрицательный урон
            const damageToApply = Math.max(0, Math.floor(finalDamage));
            const newHp = Math.max(0, target.currentHp - damageToApply);
            
            console.log(`Текущее HP: ${target.currentHp}, после урона: ${newHp}`);
            target.currentHp = newHp;
            
            // Check if target is destroyed
            if (target.currentHp === 0) {
              console.log(`${risk.target} уничтожен!`);
              gameOver = true;
            }
          });
          
          // Add wave history
          const damageTaken = calculateWaveDamage(prev);
          
          const waveHistory = {
            wave: prev.wave,
            damageTaken,
            moneyEarned: GAME_CONFIG.WAVE_COMPLETION_BONUS + (defeatedRisks * 1000),
            risksDefeated: defeatedRisks
          };
          
          // Добавляем бонус за завершение волны
          totalMoney += GAME_CONFIG.WAVE_COMPLETION_BONUS;
          console.log(`Бонус за завершение волны: ${GAME_CONFIG.WAVE_COMPLETION_BONUS}₽`);
          console.log(`Итого денег: ${totalMoney}₽`);
          
          // Check for game over
          if (gameOver) {
            return {
              ...prev,
              gamePhase: 'game_over',
              timeLeft: 0,
              money: totalMoney,
              waveHistory: [...prev.waveHistory, waveHistory]
            };
          }
          
          // Переходим сразу к итогам вместо ожидания
          return {
            ...prev,
            gamePhase: 'summary',
            timeLeft: 5000, // 5 секунд для просмотра итогов
            money: totalMoney,
            protectables: newProtectables,
            activeRisks: [], // Очищаем риски - они сыграли свою роль
            waveHistory: [...prev.waveHistory, waveHistory]
          };
        });
      }, 1500); // Небольшая задержка для визуализации рисков
    };
    
    // Основной таймер
    timer = setInterval(() => {
      setGameState(prev => {
        // Don't update if we're in summary or game over phase
        if (prev.gamePhase === 'summary' || prev.gamePhase === 'game_over') {
          return prev;
        }
        
        // Decrease time
        let newTimeLeft = prev.timeLeft - 1000;
        let newPhase = prev.gamePhase;
        
        // Phase transitions
        if (newTimeLeft <= 0) {
          if (prev.gamePhase === 'preparation') {
            console.log("Закончилась фаза подготовки");
            
            // Запускаем фазу атаки через отдельный таймаут
            setTimeout(() => {
              runAttackPhase(prev.wave);
            }, 0);
            
            return {
              ...prev,
              gamePhase: 'attack',
              timeLeft: 3000 // Даем немного времени для визуализации атаки
            };
          }
        }
        
        return { 
          ...prev, 
          timeLeft: newTimeLeft,
          gamePhase: newPhase
        };
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Function to draw cards
  const drawCards = useCallback((count: number) => {
    setGameState(prev => {
      const currentHandSize = prev.hand.length;
      const maxHandSize = GAME_CONFIG.CARD_HAND_SIZE;
      const cardsToDraw = Math.min(count, maxHandSize - currentHandSize);
      
      if (cardsToDraw <= 0) return prev;
      
      // In a real game, we'd implement a proper card drawing mechanic
      // For now, just take random cards from the insurance deck
      const newCards = INSURANCE_CARDS
        .sort(() => Math.random() - 0.5)
        .slice(0, cardsToDraw)
        .map(card => ({
          ...card,
          id: `${card.id}_${generateId()}` // Ensure unique IDs
        }));
      
      return {
        ...prev,
        hand: [...prev.hand, ...newCards]
      };
    });
  }, []);

  // Function to spawn risks based on wave difficulty - для внутреннего использования
  const spawnRisks = useCallback((wave: number) => {
    const waveDifficulty = WAVE_DIFFICULTY[wave as keyof typeof WAVE_DIFFICULTY];
    
    if (!waveDifficulty) return;
    
    const { enemiesCount, difficultyMultiplier } = waveDifficulty;
    
    // Select random risks and scale their damage based on difficulty
    const risks = RISK_CARDS
      .sort(() => Math.random() - 0.5)
      .slice(0, enemiesCount)
      .map(risk => ({
        ...risk,
        id: `${risk.id}_${generateId()}`, // Ensure unique IDs
        damage: Math.floor(risk.damage * difficultyMultiplier)
      }));
    
    setGameState(prev => ({
      ...prev,
      activeRisks: risks
    }));
  }, []);

  // Function to use an insurance card
  const useInsuranceCard = useCallback((card: InsuranceCard) => {
    console.log("Применяем страховку:", card.name);
    console.log("Цели:", card.targets);
    
    setGameState(prev => {
      // Check if player has enough money
      if (prev.money < card.cost) {
        console.log("Недостаточно денег!");
        return prev;
      }
      
      // Создаем копию объектов для защиты
      const updatedProtectables = {...prev.protectables};
      
      // Применяем защиту к каждой цели
      card.targets.forEach(target => {
        console.log(`Применяем защиту к ${target}`);
        updatedProtectables[target] = {
          ...updatedProtectables[target],
          defenses: [...updatedProtectables[target].defenses, card]
        };
      });
      
      // Обновляем состояние игры
      console.log("Карта применена, обновляем состояние");
      return {
        ...prev,
        money: prev.money - card.cost,
        hand: prev.hand.filter(c => c.id !== card.id),
        playedCards: [...prev.playedCards, card],
        protectables: updatedProtectables
      };
    });
  }, []);

  // Helper to calculate total damage taken in a wave
  const calculateWaveDamage = (state: GameState): number => {
    // In a real implementation, this would track damage taken during the wave
    // For now, just calculate difference between max and current HP
    return Object.values(state.protectables).reduce((total, obj) => {
      return total + (obj.maxHp - obj.currentHp);
    }, 0);
  };

  // Функция для создания начального состояния
  const resetInitialState = () => ({
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
    hand: [],
    activeRisks: [],
    playedCards: [],
    waveHistory: [],
  });

  // Функция для перехода к следующей волне - полностью переписана
  const startNextWave = useCallback(() => {
    console.log("Принудительное начало следующей волны");
    
    // Принудительно обновляем состояние для перехода к следующей волне
    setGameState(prev => {
      // Если мы в последней волне, то перезапускаем игру
      if (prev.wave >= GAME_CONFIG.TOTAL_WAVES) {
        console.log("Достигнута последняя волна, возвращаемся в режим подготовки");
        
        // Перезапуск игры
        return resetInitialState();
      }
      
      console.log(`Переход с волны ${prev.wave} на волну ${prev.wave + 1}`);
      
      // Подготовка к следующей волне
      return {
        ...prev,
        wave: prev.wave + 1,
        gamePhase: 'preparation',
        timeLeft: GAME_CONFIG.WAVE_PREPARATION_TIME,
        hand: [], // Очистим руку для новых карт
      };
    });
    
    // Добавляем карты после обновления состояния
    setTimeout(() => {
      drawCards(4); // Всегда даем 4 новые карты
    }, 100);
  }, [drawCards]);

  // Функция для полного сброса игры
  const resetGame = useCallback(() => {
    console.log("Полный сброс игры");
    setGameState(resetInitialState());
    
    // Выдаем начальные карты после сброса состояния
    setTimeout(() => {
      drawCards(4);
    }, 100);
  }, [drawCards]);

  return {
    gameState,
    drawCards,
    useInsuranceCard,
    startNextWave,
    resetGame,
  };
};

export default useGameState;