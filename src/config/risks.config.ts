import { ProtectableType, RiskCard, RiskType } from "@/types/game.types";

// Карты рисков
export const RISK_CARDS: RiskCard[] = [
  {
    id: 'minor_accident',
    type: RiskType.CAR_ACCIDENT,
    name: 'Легкое ДТП',
    damage: 50,   // Уменьшили урон
    target: ProtectableType.CAR,
    description: 'Мелкое ДТП с небольшими повреждениями.',
    imageUrl: '/shield.svg', // Временно используем доступные иконки
  },
  {
    id: 'major_accident',
    type: RiskType.CAR_ACCIDENT,
    name: 'Серьезное ДТП',
    damage: 100,  // Уменьшили урон
    target: ProtectableType.CAR,
    description: 'Серьезная авария с крупным ущербом.',
    imageUrl: '/shield.svg',
    specialEffect: 'Может повредить и членов семьи',
  },
  {
    id: 'house_fire',
    type: RiskType.FIRE,
    name: 'Пожар в доме',
    damage: 150,  // Уменьшили урон
    target: ProtectableType.HOUSE,
    description: 'Пожар в квартире с серьезными повреждениями.',
    imageUrl: '/shield-plus.svg',
    specialEffect: 'Распространяется на соседние объекты',
  },
  {
    id: 'illness',
    type: RiskType.ILLNESS,
    name: 'Болезнь',
    damage: 80,  // Уменьшили урон
    target: ProtectableType.FAMILY,
    description: 'Заболевание, требующее серьезного лечения.',
    imageUrl: '/shield.svg',
  },
  {
    id: 'apartment_flood',
    type: RiskType.FLOOD,
    name: 'Затопление',
    damage: 70,  // Уменьшили урон
    target: ProtectableType.HOUSE,
    description: 'Прорыв трубы и затопление квартиры.',
    imageUrl: '/globe.svg',
  },
  {
    id: 'theft',
    type: RiskType.THEFT,
    name: 'Кража',
    damage: 90,  // Уменьшили урон
    target: ProtectableType.HOUSE,
    description: 'Ограбление квартиры.',
    imageUrl: '/shield-plus.svg',
    specialEffect: 'Игнорирует часть защиты',
  },
  {
    id: 'car_theft',
    type: RiskType.THEFT,
    name: 'Угон',
    damage: 200,  // Уменьшили урон
    target: ProtectableType.CAR,
    description: 'Угон автомобиля.',
    imageUrl: '/shield.svg',
  },
  {
    id: 'fraud',
    type: RiskType.FRAUD,
    name: 'Мошенничество',
    damage: 100,  // Уменьшили урон
    target: ProtectableType.WORK,
    description: 'Финансовое мошенничество.',
    imageUrl: '/shield-plus.svg',
    specialEffect: 'Может атаковать любую цель',
  },
];