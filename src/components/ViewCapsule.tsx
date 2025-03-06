import React, { useState } from 'react';
import { Key, Search, Calendar, FileText, FileImage, AlertCircle } from 'lucide-react';

const ViewCapsule: React.FC = () => {
  const [capsuleKey, setCapsuleKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capsule, setCapsule] = useState<any | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Play search sound
    const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_search.mp3');
    audio.volume = 0.2;
    audio.play().catch(error => console.log('Audio play prevented:', error));
    
    // Simulate API call
    setTimeout(() => {
      if (capsuleKey.length < 10) {
        setError('Invalid capsule key. Please check and try again.');
        setIsLoading(false);
        
        const errorAudio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_error.mp3');
        errorAudio.volume = 0.2;
        errorAudio.play().catch(error => console.log('Audio play prevented:', error));
        return;
      }
      
      const mockCapsule = {
        id: capsuleKey,
        message: "This is a message from the past! Remember when Windows XP was the coolest thing ever? Those were the days of AIM, Napster, and dial-up internet. Hope you're doing well in the future!",
        createdAt: "2023-05-15",
        unlockDate: "2025-05-15",
        images: [
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        ]
      };
      
      setCapsule(mockCapsule);
      setIsLoading(false);
    }, 1500);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="view-capsule">
      {!capsule ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <Key size={16} />
              <span>Enter your capsule key:</span>
            </label>
            <input 
              type="text" 
              className="xp-input"
              value={capsuleKey}
              onChange={(e) => setCapsuleKey(e.target.value)}
              placeholder="Enter your unique capsule key"
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="xp-button primary"
              disabled={isLoading}
            >
              <Search size={16} />
              <span>{isLoading ? 'Searching...' : 'Open Capsule'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="capsule-content">
          <div className="capsule-header">
            <h3>Time Capsule Opened!</h3>
            <div className="capsule-dates">
              <div className="capsule-date">
                <Calendar size={16} />
                <span>Created: {formatDate(capsule.createdAt)}</span>
              </div>
              <div className="capsule-date">
                <Calendar size={16} />
                <span>Unlocked: {formatDate(capsule.unlockDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="capsule-message">
            <div className="message-header">
              <FileText size={16} />
              <span>Message from the past:</span>
            </div>
            <div className="message-content">
              {capsule.message}
            </div>
          </div>
          
          {capsule.images && capsule.images.length > 0 && (
            <div className="capsule-images">
              <div className="images-header">
                <FileImage size={16} />
                <span>Images from the past:</span>
              </div>
              <div className="images-grid">
                {capsule.images.map((url: string, index: number) => (
                  <div key={index} className="capsule-image">
                    <img src={url} alt={`Capsule image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewCapsule;