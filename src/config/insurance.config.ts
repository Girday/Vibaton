import { InsuranceCard, InsuranceType, ProtectableType } from "@/types/game.types";

// Карты страховок
export const INSURANCE_CARDS: InsuranceCard[] = [
  {
    id: 'osago_basic',
    type: InsuranceType.OSAGO,
    name: 'ОСАГО',
    cost: 5000,
    protection: 90,
    targets: [ProtectableType.CAR],
    cooldown: 0, // Мгновенная
    uses: 3, // 3 использования
    description: 'Обязательное автострахование. Защищает от базовых ДТП.',
    imageUrl: '/shield.svg',
    specialEffect: 'Обязательная защита для всех водителей',
  },
  {
    id: 'kasko_full',
    type: InsuranceType.KASKO,
    name: 'КАСКО Полное',
    cost: 15000,
    protection: 95,
    targets: [ProtectableType.CAR],
    cooldown: 5000, // 5 секунд
    uses: 2, // 2 использования
    description: 'Полная защита автомобиля, включая угон и ущерб.',
    imageUrl: '/shield-plus.svg',
    specialEffect: 'Возмещение полной стоимости при тотальном ущербе',
  },
  {
    id: 'property_insurance',
    type: InsuranceType.PROPERTY,
    name: 'Недвижимость',
    cost: 8000,
    protection: 95,
    targets: [ProtectableType.HOUSE],
    cooldown: 10000, // 10 секунд
    uses: 2,
    description: 'Защита от пожара, затопления, и других повреждений.',
    imageUrl: '/home.svg',
    specialEffect: 'Защищает даже от стихийных бедствий',
  },
  {
    id: 'health_insurance',
    type: InsuranceType.HEALTH,
    name: 'ДМС',
    cost: 12000,
    protection: 80,
    targets: [ProtectableType.FAMILY],
    cooldown: 8000, // 8 секунд
    uses: 3,
    description: 'Добровольное медицинское страхование для всей семьи.',
    imageUrl: '/heart.svg',
    specialEffect: 'Постепенно восстанавливает здоровье',
  },
  {
    id: 'travel_insurance',
    type: InsuranceType.TRAVEL,
    name: 'Путешествия',
    cost: 3000,
    protection: 70,
    targets: [ProtectableType.FAMILY],
    cooldown: 3000, // 3 секунды
    uses: 1,
    description: 'Защита в поездках: медпомощь, отмена рейса, багаж.',
    imageUrl: '/globe.svg',
    specialEffect: 'Работает даже в экзотических странах',
  },
  {
    id: 'vip_package',
    type: InsuranceType.VIP,
    name: 'VIP Пакет',
    cost: 25000,
    protection: 50,
    targets: [ProtectableType.HOUSE, ProtectableType.CAR, ProtectableType.FAMILY, ProtectableType.WORK],
    cooldown: 20000, // 20 секунд
    uses: 1,
    description: 'Комплексная защита всего имущества и семьи.',
    imageUrl: '/vip.svg',
    specialEffect: 'Один раз за игру может полностью восстановить объект',
  },
];