import React, { useRef, useEffect } from 'react';
import { Computer, Clock, User, Settings, HelpCircle, LogOut, Archive } from 'lucide-react';

interface StartMenuProps {
  onItemClick: (item: string) => void;
  onClickOutside: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onItemClick, onClickOutside }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);
  
  const playMenuSound = () => {
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_menu.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
  };
  
  return (
    <div className="start-menu" ref={menuRef}>
      <div className="start-menu-header">
        <div className="user-info">
          <User size={48} className="user-icon" />
          <span className="user-name">User</span>
        </div>
      </div>
      
      <div className="start-menu-content">
        <div className="start-menu-left">
          <div 
            className="start-menu-item" 
            onClick={() => {
              playMenuSound();
              onItemClick('createCapsule');
            }}
          >
            <Computer size={24} className="menu-icon" />
            <span>Create New Time Capsule</span>
          </div>
          <div 
            className="start-menu-item"
            onClick={() => {
              playMenuSound();
              onItemClick('sampleCapsules');
            }}
          >
            <Archive size={24} className="menu-icon" />
            <span>My Time Capsules</span>
          </div>
          <div className="start-menu-separator"></div>
          <div className="start-menu-item">
            <Settings size={24} className="menu-icon" />
            <span>Settings</span>
          </div>
          <div className="start-menu-item">
            <HelpCircle size={24} className="menu-icon" />
            <span>Help and Support</span>
          </div>
        </div>
        
        <div className="start-menu-right">
          <div className="start-menu-item logout">
            <LogOut size={16} className="menu-icon" />
            <span>Log Off</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;