'use client';

import { FC } from 'react';
import { RiskCard as RiskCardType, ProtectableType } from '@/types/game.types';

interface RiskCardProps {
  card: RiskCardType;
  position?: { x: number; y: number };
  progress?: number; // 0 to 100 - how close risk is to its target
  onDefeat?: (card: RiskCardType) => void; // Callback when risk is defeated
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
    if (card.damage >= 150) return 'from-red-900 to-red-700';
    if (card.damage >= 90) return 'from-orange-800 to-orange-600';
    return 'from-yellow-700 to-yellow-500';
  };

  // Выбор эмодзи в зависимости от типа риска
  const getRiskEmoji = () => {
    switch (card.type) {
      case 'car_accident': return '💥';
      case 'fire': return '🔥';
      case 'illness': return '🤒';
      case 'theft': return '🕵️';
      case 'flood': return '💧';
      case 'fraud': return '💰';
      default: return '⚠️';
    }
  };

  return (
    <div 
      className={`w-40 h-70 bg-gradient-to-b ${getSeverityClass()} rounded-xl border-2 border-gray-700 flex flex-col shadow-lg relative`}
      style={{ 
        ...positionStyle,
        margin: '0.5rem',
        zIndex: 0 
      }}
    >
      {/* Card Header */}
      <div className="bg-black/30 p-2 rounded-t-lg border-b border-gray-700">
        <h3 className="text-white font-bold text-base truncate">{card.name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-white text-xs">Урон: {card.damage}</span>
        </div>
      </div>
      
      {/* Card Image */}
      <div className="flex-shrink-0 h-24 bg-black/20 flex items-center justify-center overflow-hidden">
        <div className="w-12 h-12 bg-red-800/50 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white/70">
            {getRiskEmoji()}
          </span>
        </div>
      </div>
      
      {/* Card Info */}
      <div className="p-2 flex-grow flex flex-col">
        <div className="text-xs text-white mb-1">
          <span className="font-semibold">Цель:</span> {getTargetName(card.target)}
        </div>
        
        {/* Card Description */}
        <div className="mt-1 text-xs text-white/80 flex-grow overflow-auto">
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
            className={`h-1.5 rounded-full transition-all ${
              progress && progress > 80 ? 'bg-red-400 animate-pulse' : 'bg-white'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Distance indicator */}
        <div className="mt-1 text-xs text-white text-center">
          {progress && progress < 100 
            ? `${100 - progress}% до цели` 
            : progress === 100 
              ? "Атакует!" 
              : "Приближается..." }
        </div>
      </div>
    </div>
  );
};

export default RiskCard;