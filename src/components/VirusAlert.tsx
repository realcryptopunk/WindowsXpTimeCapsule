import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Brush as Virus, Download, HardDrive, Cpu, Zap, Bug } from 'lucide-react';

interface VirusAlertProps {
  onClose: () => void;
}

const messages = [
  {
    title: 'CRITICAL SYSTEM ERROR!!1!',
    icon: <AlertTriangle size={32} className="text-red-500" />,
    message: 'DANGER!! Your computer has been infected with SUPER_LOVE_LETTER_2025.exe!! Send this message to 10 friends in the next 10 minutes or your hard drive will be filled with cat pictures!!1!',
    buttons: ['OK!!', 'Cancel!!', 'Send to Friends!!']
  },
  {
    title: 'System32 DELETION WARNING!!!',
    icon: <Shield size={32} className="text-yellow-500" />,
    message: 'CONGRATULATIONS USER!! You are visitor number 999,999!! Your System32 folder has won a FREE deletion service! Click OK to claim your prize NOW!!',
    buttons: ['OK!!', 'Delete NOW!!', 'Call Microsoft!!']
  },
  {
    title: '!!!ANTIVIRUS EXPIRED!!!',
    icon: <Bug size={32} className="text-orange-500" />,
    message: 'YOUR ANTIVIRUS IS 999 DAYS EXPIRED!! 127 VIRUSES DETECTED!! YOUR COMPUTER IS AT RISK!! CLICK OK TO REMOVE ALL VIRUSES NOW!!',
    buttons: ['Remove Viruses!!', 'Ignore (Not Safe)', 'Download More RAM']
  },

];

const VirusAlert: React.FC<VirusAlertProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [alert] = useState(() => messages[Math.floor(Math.random() * messages.length)]);
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    // Random position within viewport
    const x = Math.random() * (window.innerWidth - 400);
    const y = Math.random() * (window.innerHeight - 200);
    setPosition({ x, y });
    
    // Play alert sound
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_error.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onClose]);
  
  const handleButtonClick = () => {
    // Play click sound
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_click.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
    
    // 50% chance to spawn another alert instead of closing
    if (Math.random() < 0.5) {
      const newAlert = document.createElement('div');
      newAlert.style.position = 'fixed';
      newAlert.style.left = '50%';
      newAlert.style.top = '50%';
      newAlert.style.transform = 'translate(-50%, -50%)';
      newAlert.style.background = '#fff';
      newAlert.style.padding = '20px';
      newAlert.style.border = '1px solid #0a246a';
      newAlert.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.3)';
      newAlert.style.zIndex = '10000';
      newAlert.innerHTML = `
        <div style="color: red; font-weight: bold; margin-bottom: 10px;">
          NICE TRY!!1! YOU CAN'T ESCAPE!!
        </div>
        <div style="text-align: center;">
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="padding: 5px 10px; cursor: pointer;">
            OK!!1!
          </button>
        </div>
      `;
      document.body.appendChild(newAlert);
    } else {
      onClose();
    }
  };
  
  return (
    <div
      className="xp-window virus-alert"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '400px',
        zIndex: 9999
      }}
    >
      <div className="window-title-bar" style={{ background: 'linear-gradient(to right, #ff0000 0%, #ff6b60 100%)' }}>
        <div className="window-title" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {alert.title}
        </div>
        <div className="window-controls">
          <button className="window-button close" onClick={handleButtonClick}>
            ✕
          </button>
        </div>
      </div>
      <div className="window-content p-4">
        <div className="flex items-start gap-4">
          {alert.icon}
          <div className="flex-1">
            <p className="text-sm font-bold mb-2" style={{ color: '#ff0000' }}>
              {alert.message}
            </p>
            <p className="text-xs text-red-500 animate-pulse">
              This message will self-destruct in {countdown} seconds!!
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {alert.buttons.map((button, index) => (
            <button
              key={index}
              className="xp-button"
              onClick={handleButtonClick}
              style={{
                background: index === 0 ? 'linear-gradient(to bottom, #ff6b60 0%, #ff0000 100%)' : undefined,
                color: index === 0 ? 'white' : undefined,
                fontWeight: index === 0 ? 'bold' : undefined
              }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirusAlert;