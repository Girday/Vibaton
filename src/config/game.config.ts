// Основные настройки игры
export const GAME_CONFIG = {
  // Игровые параметры
  WAVE_PREPARATION_TIME: 15000, // 15 секунд подготовки
  WAVE_DURATION: 30000, // 30 секунд волны
  TOTAL_WAVES: 8, // Всего волн
  
  // Экономика
  STARTING_MONEY: 25000, // Стартовые деньги
  MONEY_PER_KILL: 1000, // Деньги за убийство врага
  WAVE_COMPLETION_BONUS: 5000, // Бонус за завершение волны
  DAMAGE_PENALTY: 500, // Штраф за каждые 100 HP урона
  
  // HP объектов
  HOUSE_HP: 1000,
  FAMILY_HP: 800,
  CAR_HP: 600,
  WORK_HP: 500,
  
  // Интерфейс
  CARD_HAND_SIZE: 6, // Карт в руке
  MAX_DEFENSES_ON_FIELD: 8, // Максимум защит на поле
  
  // Анимации
  ATTACK_ANIMATION_DURATION: 1000,
  CARD_PLAY_ANIMATION: 500,
  
} as const;

// Сложность по волнам
export const WAVE_DIFFICULTY = {
  1: { enemiesCount: 2, difficultyMultiplier: 1.0 },
  2: { enemiesCount: 3, difficultyMultiplier: 1.2 },
  3: { enemiesCount: 4, difficultyMultiplier: 1.4 },
  4: { enemiesCount: 5, difficultyMultiplier: 1.6 },
  5: { enemiesCount: 6, difficultyMultiplier: 1.8 },
  6: { enemiesCount: 7, difficultyMultiplier: 2.0 },
  7: { enemiesCount: 8, difficultyMultiplier: 2.5 },
  8: { enemiesCount: 10, difficultyMultiplier: 3.0 }, // Boss wave
} as const;