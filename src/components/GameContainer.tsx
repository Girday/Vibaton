'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Динамическая загрузка GameBoard с отключенным SSR
const GameBoard = dynamic(() => import('@/components/Game/GameBoard'), { ssr: false });

const GameContainer: React.FC = () => {
  return <GameBoard />;
};

export default GameContainer;
