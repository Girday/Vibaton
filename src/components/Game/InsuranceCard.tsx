import { FC } from 'react';
import { InsuranceCard as InsuranceCardType, ProtectableType } from '@/types/game.types';
import Image from 'next/image';

interface InsuranceCardProps {
  card: InsuranceCardType;
  onUse?: (card: InsuranceCardType) => void;
  disabled?: boolean;
  isActive?: boolean;
}

const InsuranceCard: FC<InsuranceCardProps> = ({
  card,
  onUse,
  disabled = false,
  isActive = false,
}) => {
  // Helper to get target names
  const getTargetNames = (targets: ProtectableType[]): string => {
    const targetMap: Record<ProtectableType, string> = {
      [ProtectableType.HOUSE]: 'Дом',
      [ProtectableType.FAMILY]: 'Семья',
      [ProtectableType.CAR]: 'Автомобиль',
      [ProtectableType.WORK]: 'Работа',
    };
    
    return targets.map(target => targetMap[target]).join(', ');
  };
  
  // Class for the card border/highlight
  const cardBorderClass = isActive 
    ? 'border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]' 
    : 'border-gray-300/50';
  
  // Classes for the usage button
  const buttonClasses = disabled
    ? 'bg-gray-500 cursor-not-allowed opacity-50'
    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer';

  return (
    <div 
      className={`w-56 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 ${cardBorderClass} flex flex-col shadow-lg transition-transform transform hover:scale-105`}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-3 rounded-t-lg border-b border-gray-700">
        <h3 className="text-white font-bold text-lg truncate">{card.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-yellow-300 font-semibold">{card.cost}₽</span>
          <div className="text-xs text-gray-300">Тип: {card.type}</div>
        </div>
      </div>
      
      {/* Card Image (if available) */}
      <div className="flex-shrink-0 h-28 bg-gray-800 flex items-center justify-center overflow-hidden">
        {card.imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain p-2"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-blue-800/50 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white/70">🛡️</span>
          </div>
        )}
      </div>
      
      {/* Card Info */}
      <div className="p-3 flex-grow flex flex-col">
        <div className="text-xs text-gray-300 mb-1">
          <span className="font-semibold">Защита:</span> {card.protection}%
        </div>
        <div className="text-xs text-gray-300 mb-1">
          <span className="font-semibold">Цель:</span> {getTargetNames(card.targets)}
        </div>
        <div className="text-xs text-gray-300 mb-1">
          <span className="font-semibold">Использования:</span> {card.uses === -1 ? "∞" : card.uses}
        </div>
        
        {/* Card Description */}
        <div className="mt-1 text-xs text-gray-400 flex-grow">
          {card.description}
        </div>
        
        {/* Special Effect */}
        {card.specialEffect && (
          <div className="mt-1 text-xs text-blue-400 italic">
            {card.specialEffect}
          </div>
        )}
        
        {/* Use Button */}
        <button
          className={`mt-2 w-full rounded-lg py-1.5 px-3 text-white text-sm font-semibold transition-colors ${buttonClasses}`}
          onClick={() => onUse && !disabled && onUse(card)}
          disabled={disabled}
        >
          Использовать
        </button>
      </div>
    </div>
  );
};

export default InsuranceCard;