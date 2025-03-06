import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  width?: number;
  height?: number;
}

const Window: React.FC<WindowProps> = ({ 
  title, 
  icon, 
  children, 
  isActive, 
  onClose, 
  onFocus,
  width = 600,
  height = 400
}) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && e.target === windowRef.current.querySelector('.window-title-bar')) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      onFocus();
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && windowRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Ensure window stays within viewport
      const maxX = window.innerWidth - windowRef.current.offsetWidth;
      const maxY = window.innerHeight - windowRef.current.offsetHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  const playClickSound = () => {
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_click.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
  };
  
  const playCloseSound = () => {
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_close.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
  };
  
  const handleClose = () => {
    playCloseSound();
    onClose();
  };
  
  return (
    <div 
      ref={windowRef}
      className={`xp-window ${isActive ? 'active' : ''}`} 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: isActive ? 10 : 5
      }}
      onMouseDown={onFocus}
    >
      <div 
        className="window-title-bar"
        onMouseDown={handleMouseDown}
      >
        <div className="window-title">
          <span className="window-icon">{icon}</span>
          <span className="window-title-text">{title}</span>
        </div>
        <div className="window-controls">
          <button className="window-button minimize" onClick={playClickSound}>
            <Minus size={10} />
          </button>
          <button className="window-button maximize" onClick={playClickSound}>
            <Maximize2 size={10} />
          </button>
          <button className="window-button close" onClick={handleClose}>
            <X size={10} />
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;