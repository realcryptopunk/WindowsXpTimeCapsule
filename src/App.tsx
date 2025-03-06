import React, { useState, useEffect } from 'react';
import { Computer, Clock, Lock, Unlock, Share2, X, Minus, Maximize2, Save, FileImage, FileText, Calendar, ChevronDown, Archive } from 'lucide-react';
import Desktop from './components/Desktop';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import TimeCapsuleForm from './components/TimeCapsuleForm';
import SampleCapsules from './components/SampleCapsules';
import VirusAlert from './components/VirusAlert';
import './styles/windows-xp.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [activeWindows, setActiveWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [capsuleKey, setCapsuleKey] = useState<string | null>(null);
  const [virusAlerts, setVirusAlerts] = useState<string[]>([]);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Random virus alerts
  useEffect(() => {
    const showRandomAlert = () => {
      const id = crypto.randomUUID();
      setVirusAlerts(prev => [...prev, id]);
      
      // Remove alert after 10 seconds
      setTimeout(() => {
        setVirusAlerts(prev => prev.filter(alertId => alertId !== id));
      }, 10000);
    };
    
    // Show first alert after 30 seconds
    const initialTimer = setTimeout(() => {
      showRandomAlert();
      
      // Then show new alerts randomly between 30-90 seconds
      const interval = setInterval(() => {
        if (Math.random() < 0.5) { // 50% chance to show alert
          showRandomAlert();
        }
      }, 30000 + Math.random() * 60000);
      
      return () => clearInterval(interval);
    }, 30000);
    
    return () => clearTimeout(initialTimer);
  }, []);
  
  // Play startup sound on initial load
  useEffect(() => {
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/winxp.mp3');
    audio.volume = 0.3;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Auto-play was prevented:', error);
      });
    }
  }, []);
  
  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu);
  };
  
  const openWindow = (windowName: string) => {
    if (!activeWindows.includes(windowName)) {
      setActiveWindows([...activeWindows, windowName]);
    }
    setActiveWindow(windowName);
    setShowStartMenu(false);
  };
  
  const closeWindow = (windowName: string) => {
    setActiveWindows(activeWindows.filter(name => name !== windowName));
    if (activeWindow === windowName) {
      setActiveWindow(activeWindows.length > 1 ? 
        activeWindows.filter(name => name !== windowName)[0] : null);
    }
  };
  
  const focusWindow = (windowName: string) => {
    setActiveWindow(windowName);
  };
  
  const handleCapsuleCreated = (key: string) => {
    setCapsuleKey(key);
    openWindow('capsuleSuccess');
  };
  
  return (
    <div className="xp-container">
      <Desktop>
        <div className="desktop-icons">
          <div className="desktop-icon" onDoubleClick={() => openWindow('createCapsule')}>
            <Computer size={32} className="icon-img" />
            <span>Create Capsule</span>
          </div>
          <div className="desktop-icon" onDoubleClick={() => openWindow('sampleCapsules')}>
            <Archive size={32} className="icon-img" />
            <span>My Capsules</span>
          </div>
        </div>
        
        {activeWindows.includes('createCapsule') && (
          <Window 
            title="Create New Time Capsule" 
            icon={<Save size={16} />}
            isActive={activeWindow === 'createCapsule'}
            onClose={() => closeWindow('createCapsule')}
            onFocus={() => focusWindow('createCapsule')}
          >
            <TimeCapsuleForm onCapsuleCreated={handleCapsuleCreated} />
          </Window>
        )}
        
        {activeWindows.includes('sampleCapsules') && (
          <Window 
            title="My Time Capsules" 
            icon={<Archive size={16} />}
            isActive={activeWindow === 'sampleCapsules'}
            onClose={() => closeWindow('sampleCapsules')}
            onFocus={() => focusWindow('sampleCapsules')}
            width={800}
            height={600}
          >
            <SampleCapsules />
          </Window>
        )}
        
        {activeWindows.includes('capsuleSuccess') && (
          <Window 
            title="Time Capsule Created" 
            icon={<Lock size={16} />}
            isActive={activeWindow === 'capsuleSuccess'}
            onClose={() => closeWindow('capsuleSuccess')}
            onFocus={() => focusWindow('capsuleSuccess')}
            width={400}
            height={300}
          >
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Time Capsule Created Successfully!</h3>
              <p>Your unique capsule key is:</p>
              <div className="capsule-key">{capsuleKey}</div>
              <p className="key-warning">Save this key! You'll need it to open your capsule.</p>
            </div>
          </Window>
        )}
        
        {virusAlerts.map(id => (
          <VirusAlert
            key={id}
            onClose={() => setVirusAlerts(prev => prev.filter(alertId => alertId !== id))}
          />
        ))}
        
        <div className="taskbar">
          <div className="start-button" onClick={toggleStartMenu}>
            <div className="start-logo">
              <img src="https://i.imgur.com/vzpBjyE.png" alt="Windows XP logo" className="windows-logo" />
            </div>
            <span>start</span>
          </div>
          
          <div className="taskbar-programs">
            {activeWindows.map(window => (
              <div 
                key={window} 
                className={`taskbar-item ${activeWindow === window ? 'active' : ''}`}
                onClick={() => focusWindow(window)}
              >
                {window === 'createCapsule' && <Save size={16} />}
                {window === 'sampleCapsules' && <Archive size={16} />}
                {window === 'capsuleSuccess' && <Lock size={16} />}
                <span>
                  {window === 'createCapsule' && 'Create New Time Capsule'}
                  {window === 'sampleCapsules' && 'My Time Capsules'}
                  {window === 'capsuleSuccess' && 'Time Capsule Created'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="taskbar-tray">
            <div className="time">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        
        {showStartMenu && (
          <StartMenu 
            onItemClick={(item) => {
              if (item === 'createCapsule' || item === 'sampleCapsules') {
                openWindow(item);
              }
            }}
            onClickOutside={() => setShowStartMenu(false)}
          />
        )}
      </Desktop>
    </div>
  );
}

export default App;