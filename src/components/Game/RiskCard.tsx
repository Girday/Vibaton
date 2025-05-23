import { FC } from 'react';
import { RiskCard as RiskCardType, ProtectableType } from '@/types/game.types';
import Image from 'next/image';

interface RiskCardProps {
  card: RiskCardType;
  position?: { x: number; y: number };
  progress?: number; // 0 to 100 - how close risk is to its target
}

const RiskCard: FC<RiskCardProps> = ({
  card,
  position,
  progress = 0
}) => {
  // Helper to get target name
  const getTargetName = (target: ProtectableType): string => {
    const targetMap: Record<ProtectableType, string> = {
      [ProtectableType.HOUSE]: 'Дом',
      [ProtectableType.FAMILY]: 'Семья',
      [ProtectableType.CAR]: 'Автомобиль',
      [ProtectableType.WORK]: 'Работа',
    };
    
    return targetMap[target];
  };
  
  // Dynamic styles for moving cards if position is provided
  const positionStyle = position 
    ? { transform: `translate(${position.x}px, ${position.y}px)` }
    : {};
    
  // Class for severity based on damage
  const getSeverityClass = () => {
    if (card.damage >= 600) return 'from-red-900 to-red-700';
    if (card.damage >= 400) return 'from-orange-800 to-orange-600';
    return 'from-yellow-700 to-yellow-500';
  };

  return (
    <div 
      className={`w-40 h-64 bg-gradient-to-b ${getSeverityClass()} rounded-xl border-2 border-gray-700 flex flex-col shadow-lg transition-all`}
      style={positionStyle}
    >
      {/* Card Header */}
      <div className="bg-black/30 p-2 rounded-t-lg border-b border-gray-700">
        <h3 className="text-white font-bold text-base truncate">{card.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-white text-xs">Урон: {card.damage}</span>
          <div className="text-xs text-gray-300">Скорость: {card.speed}</div>
        </div>
      </div>
      
      {/* Card Image (if available) */}
      <div className="flex-shrink-0 h-24 bg-black/20 flex items-center justify-center overflow-hidden">
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
          <div className="w-12 h-12 bg-red-800/50 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white/70">⚠️</span>
          </div>
        )}
      </div>
      
      {/* Card Info */}
      <div className="p-2 flex-grow flex flex-col">
        <div className="text-xs text-white mb-1">
          <span className="font-semibold">Цель:</span> {getTargetName(card.target)}
        </div>
        
        {/* Card Description */}
        <div className="mt-1 text-xs text-white/80 flex-grow">
          {card.description}
        </div>
        
        {/* Special Effect */}
        {card.specialEffect && (
          <div className="mt-1 text-xs text-yellow-300 italic">
            {card.specialEffect}
          </div>
        )}
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-white h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskCard;