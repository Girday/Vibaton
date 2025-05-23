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

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        // Decrease time
        let newTimeLeft = prev.timeLeft - 1000;
        let newPhase = prev.gamePhase;
        let newWave = prev.wave;
        
        // Phase transitions
        if (newTimeLeft <= 0) {
          if (newPhase === 'preparation') {
            // Start attack phase
            newPhase = 'attack';
            newTimeLeft = GAME_CONFIG.WAVE_DURATION;
            // Spawn risks for this wave
            spawnRisks(newWave);
          } else if (newPhase === 'attack') {
            // Move to summary phase
            newPhase = 'summary';
            newTimeLeft = 5000; // 5 seconds for summary
            
            // Add wave history
            const damageTaken = calculateWaveDamage(prev);
            
            const waveHistory = {
              wave: newWave,
              damageTaken,
              moneyEarned: GAME_CONFIG.WAVE_COMPLETION_BONUS,
              risksDefeated: prev.activeRisks.length
            };
            
            // Give wave completion bonus
            const newMoney = prev.money + GAME_CONFIG.WAVE_COMPLETION_BONUS;
            
            return {
              ...prev,
              gamePhase: newPhase,
              timeLeft: newTimeLeft,
              money: newMoney,
              waveHistory: [...prev.waveHistory, waveHistory],
              activeRisks: [] // Clear active risks
            };
          } else if (newPhase === 'summary') {
            // Start next wave or end game
            if (newWave < GAME_CONFIG.TOTAL_WAVES) {
              // Next wave
              newPhase = 'preparation';
              newWave = newWave + 1;
              newTimeLeft = GAME_CONFIG.WAVE_PREPARATION_TIME;
              
              // Draw new cards
              return {
                ...prev,
                gamePhase: newPhase,
                timeLeft: newTimeLeft,
                wave: newWave,
              };
            } else {
              // End game
              return {
                ...prev,
                gamePhase: 'game_over',
                timeLeft: 0
              };
            }
          }
        }
        
        return { 
          ...prev, 
          timeLeft: newTimeLeft,
          gamePhase: newPhase
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Update function for active risks during attack phase
  useEffect(() => {
    if (gameState.gamePhase !== 'attack' || gameState.activeRisks.length === 0) return;
    
    const riskTimer = setInterval(() => {
      setGameState(prev => {
        // Simple demonstration - damage random protectable
        // In a real implementation, we'd model risk movement and apply damage accordingly
        
        // Apply damage from each risk
        const newProtectables = { ...prev.protectables };
        let gameOver = false;
        
        prev.activeRisks.forEach(risk => {
          const targetType = risk.target;
          const target = newProtectables[targetType];
          
          // Calculate damage after defense
          let finalDamage = risk.damage;
          target.defenses.forEach(defense => {
            // Apply protection percentage
            finalDamage = finalDamage * (1 - defense.protection / 100);
          });
          
          // Apply damage
          target.currentHp = Math.max(0, target.currentHp - Math.floor(finalDamage));
          
          // Check if target is destroyed
          if (target.currentHp === 0) {
            gameOver = true;
          }
        });
        
        // Check for game over
        if (gameOver) {
          return {
            ...prev,
            gamePhase: 'game_over',
            timeLeft: 0
          };
        }
        
        return {
          ...prev,
          protectables: newProtectables
        };
      });
    }, 3000); // Apply damage every 3 seconds
    
    return () => clearInterval(riskTimer);
  }, [gameState.gamePhase, gameState.activeRisks]);

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

  // Function to spawn risks based on wave difficulty
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
    setGameState(prev => {
      // Check if player has enough money
      if (prev.money < card.cost) {
        return prev;
      }
      
      // Remove from hand, add to played cards, and apply to protectables
      return {
        ...prev,
        money: prev.money - card.cost,
        hand: prev.hand.filter(c => c.id !== card.id),
        playedCards: [...prev.playedCards, card],
        protectables: {
          ...prev.protectables,
          ...Object.fromEntries(
            card.targets.map(target => [
              target,
              {
                ...prev.protectables[target],
                defenses: [...prev.protectables[target].defenses, card]
              }
            ])
          )
        }
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

  return {
    gameState,
    drawCards,
    useInsuranceCard,
  };
};

export default useGameState;