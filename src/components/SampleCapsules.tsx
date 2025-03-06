import React, { useState } from 'react';
import { Calendar, FileText, FileImage, Archive, ChevronRight, Trash2, Key, Lock, Unlock } from 'lucide-react';
import { useCapsuleStore } from '../store/capsuleStore';
import type { TimeCapsule } from '../store/capsuleStore';

const SampleCapsules: React.FC = () => {
  const [selectedCapsule, setSelectedCapsule] = useState<string | null>(null);
  const [unlockKey, setUnlockKey] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const { capsules, unlockCapsule, removeCapsule } = useCapsuleStore();
  
  const handleCapsuleClick = (id: string) => {
    // Play click sound
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_click.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
    
    setSelectedCapsule(id);
    setUnlockKey('');
    setUnlockError(null);
  };

  const handleUnlock = async () => {
    if (!selectedCapsule || !unlockKey) return;

    const success = await unlockCapsule(selectedCapsule, unlockKey);
    if (success) {
      // Play success sound
      const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_unlock.mp3');
      audio.volume = 0.2;
      audio.play().catch(error => console.log('Audio play prevented:', error));
      setUnlockError(null);
    } else {
      // Play error sound
      const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_error.mp3');
      audio.volume = 0.2;
      audio.play().catch(error => console.log('Audio play prevented:', error));
      setUnlockError('Invalid key. Please try again.');
    }
  };

  const handleRemove = (id: string) => {
    // Play delete sound
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_delete.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));

    removeCapsule(id);
    if (selectedCapsule === id) {
      setSelectedCapsule(null);
    }
  };
  
  const selectedCapsuleData = selectedCapsule !== null 
    ? capsules.find(capsule => capsule.id === selectedCapsule) 
    : null;
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="sample-capsules">
      <div className="sample-capsules-header">
        <h3>My Time Capsules</h3>
        <p>Here are all the time capsules you've created.</p>
      </div>
      
      <div className="sample-capsules-container">
        <div className="capsules-list">
          {capsules.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              No time capsules yet. Create one to get started!
            </div>
          ) : (
            capsules.map(capsule => (
              <div 
                key={capsule.id}
                className={`capsule-item ${selectedCapsule === capsule.id ? 'selected' : ''}`}
                onClick={() => handleCapsuleClick(capsule.id)}
              >
                <div className="capsule-item-icon">
                  {capsule.isLocked ? <Lock size={24} /> : <Unlock size={24} />}
                </div>
                <div className="capsule-item-info">
                  <div className="capsule-item-title">{capsule.title}</div>
                  <div className="capsule-item-date">
                    Unlocks: {formatDate(capsule.unlockDate)}
                  </div>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(capsule.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="capsule-preview">
          {selectedCapsuleData ? (
            <div className="capsule-content">
              <div className="capsule-header">
                <h3>{selectedCapsuleData.title}</h3>
                <div className="capsule-dates">
                  <div className="capsule-date">
                    <Calendar size={16} />
                    <span>Created: {formatDate(selectedCapsuleData.createdAt)}</span>
                  </div>
                  <div className="capsule-date">
                    <Calendar size={16} />
                    <span>Unlocks: {formatDate(selectedCapsuleData.unlockDate)}</span>
                  </div>
                </div>
              </div>
              
              {selectedCapsuleData.isLocked && (
                <div className="unlock-form">
                  <div className="flex items-center gap-2 mb-4">
                    <Key size={16} />
                    <span>Enter your key to unlock this capsule:</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      className="xp-input flex-1"
                      value={unlockKey}
                      onChange={(e) => setUnlockKey(e.target.value)}
                      placeholder="Enter your capsule key..."
                    />
                    <button
                      className="xp-button primary"
                      onClick={handleUnlock}
                      disabled={!unlockKey}
                    >
                      <Unlock size={16} />
                      <span>Unlock</span>
                    </button>
                  </div>
                  {unlockError && (
                    <div className="error-message mt-2">
                      <Lock size={16} />
                      <span>{unlockError}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="capsule-message">
                <div className="message-header">
                  <FileText size={16} />
                  <span>Message:</span>
                </div>
                <div className="message-content">
                  {selectedCapsuleData.isLocked ? (
                    <div className="text-gray-500 italic">
                      This message is locked until {formatDate(selectedCapsuleData.unlockDate)}
                    </div>
                  ) : (
                    selectedCapsuleData.content
                  )}
                </div>
              </div>
              
              {selectedCapsuleData.images && selectedCapsuleData.images.length > 0 && (
                <div className="capsule-images">
                  <div className="images-header">
                    <FileImage size={16} />
                    <span>Attached Images:</span>
                  </div>
                  <div className="images-grid">
                    {selectedCapsuleData.images.map((url: string, index: number) => (
                      <div key={index} className="capsule-image">
                        {selectedCapsuleData.isLocked ? (
                          <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500">
                            <Lock size={24} />
                          </div>
                        ) : (
                          <img src={url} alt={`Capsule image ${index + 1}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-capsule-selected">
              <Archive size={48} className="no-selection-icon" />
              <p>Select a capsule from the list to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleCapsules;