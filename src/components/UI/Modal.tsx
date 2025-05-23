'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Закрываем модальное окно при клике вне его содержимого
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose && onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Закрываем модальное окно при нажатии Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Используем портал для рендеринга модального окна в конце DOM-дерева
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div 
        ref={modalRef}
        className="bg-gradient-to-b from-blue-900 to-gray-900 p-6 rounded-2xl max-w-2xl w-full shadow-2xl animate-fade-in"
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;