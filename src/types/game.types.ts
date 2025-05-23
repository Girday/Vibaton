// Типы объектов для защиты
export enum ProtectableType {
  HOUSE = 'house',
  FAMILY = 'family',
  CAR = 'car',
  WORK = 'work',
}

// Типы рисков (карты врагов)
export enum RiskType {
  CAR_ACCIDENT = 'car_accident',
  FIRE = 'fire',
  ILLNESS = 'illness',
  THEFT = 'theft',
  FLOOD = 'flood',
  FRAUD = 'fraud',
}

// Типы страховок (карты защиты)
export enum InsuranceType {
  OSAGO = 'osago',
  KASKO = 'kasko',
  PROPERTY = 'property',
  HEALTH = 'health',
  TRAVEL = 'travel',
  VIP = 'vip',
}

// Интерфейс для карты риска
export interface RiskCard {
  id: string;
  type: RiskType;
  name: string;
  damage: number;
  speed: number; // Скорость движения (меньше = быстрее)
  target: ProtectableType;
  description: string;
  imageUrl?: string;
  specialEffect?: string;
}

// Интерфейс для карты страховки
export interface InsuranceCard {
  id: string;
  type: InsuranceType;
  name: string;
  cost: number;
  protection: number; // % блокируемого урона (0-100)
  targets: ProtectableType[];
  cooldown: number; // Время перезарядки (мс)
  uses: number; // Сколько раз можно использовать (-1 = бесконечно)
  description: string;
  imageUrl?: string;
  specialEffect?: string;
}

// Состояние защищаемого объекта
export interface Protectable {
  type: ProtectableType;
  maxHp: number;
  currentHp: number;
  defenses: InsuranceCard[];
}

// Состояние игры
export interface GameState {
  wave: number;
  money: number;
  reputation: number;
  gamePhase: 'preparation' | 'attack' | 'summary' | 'game_over';
  timeLeft: number;
  protectables: Record<ProtectableType, Protectable>;
  hand: InsuranceCard[];
  activeRisks: RiskCard[];
  playedCards: InsuranceCard[];
  waveHistory: {
    wave: number;
    damageTaken: number;
    moneyEarned: number;
    risksDefeated: number;
  }[];
}