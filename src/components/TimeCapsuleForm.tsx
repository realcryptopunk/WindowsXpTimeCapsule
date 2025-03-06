import React, { useState, useRef } from 'react';
import { Calendar, FileText, FileImage, Save, Trash2, Key, Lock, Eye, EyeOff, Upload } from 'lucide-react';
import { useCapsuleStore } from '../store/capsuleStore';

interface TimeCapsuleFormProps {
  onCapsuleCreated: (key: string) => void;
}

const TimeCapsuleForm: React.FC<TimeCapsuleFormProps> = ({ onCapsuleCreated }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState(() => {
    // Set default to 1 hour from now, rounded to nearest minute
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(Math.ceil(date.getMinutes() / 5) * 5);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  });
  const [capsuleKey, setCapsuleKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createCapsule = useCapsuleStore(state => state.createCapsule);

  // Calculate min and max dates for the unlock date input
  const getMinDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5); // 5 minutes from now
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10); // 10 years from now
    return date;
  };

  const formatDateForInput = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(Math.ceil(date.getMinutes() / 5) * 5);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleUnlockDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const minDate = getMinDate();
    const maxDate = getMaxDate();
    
    if (selectedDate < minDate) {
      setError('Please select a future date (at least 5 minutes from now)');
      return;
    }
    
    if (selectedDate > maxDate) {
      setError('Please select a date within the next 10 years');
      return;
    }
    
    // Round to nearest 5 minutes
    selectedDate.setMinutes(Math.ceil(selectedDate.getMinutes() / 5) * 5);
    setUnlockDate(formatDateForInput(selectedDate));
    setError(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalSize = [...files, ...newFiles].reduce((acc, file) => acc + file.size, 0);
      
      // Check total size (10MB limit)
      if (totalSize > 10 * 1024 * 1024) {
        setError('Total file size cannot exceed 10MB');
        return;
      }
      
      setFiles([...files, ...newFiles]);
      
      // Create preview URLs for images
      const newPreviewUrls = newFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '/file-icon.png'; // Default icon for non-image files
      });
      
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
      setError(null);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!capsuleKey || capsuleKey.length < 8) {
        throw new Error('Please enter a secure key (at least 8 characters)');
      }
      
      // Play save sound
      const audio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_save.mp3');
      audio.volume = 0.2;
      audio.play().catch(error => console.log('Audio play prevented:', error));
      
      const capsuleId = await createCapsule({
        title,
        content: message,
        unlockDate: new Date(unlockDate),
        key: capsuleKey,
        files,
        visibility: 'private'
      });
      
      // Clean up preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      onCapsuleCreated(capsuleKey);
    } catch (error) {
      setError((error as Error).message);
      
      // Play error sound
      const errorAudio = new Audio('https://www.winhistory.de/more/winstart/mp3/xp_error.mp3');
      errorAudio.volume = 0.2;
      errorAudio.play().catch(error => console.log('Audio play prevented:', error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const length = 12;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCapsuleKey(result);
  };
  
  return (
    <div className="capsule-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <FileText size={16} />
            <span>Title:</span>
          </label>
          <input 
            type="text"
            className="xp-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your capsule a title..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>
            <FileText size={16} />
            <span>Message for your future self:</span>
          </label>
          <textarea 
            className="xp-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to your future self..."
            required
            rows={6}
          />
        </div>
        
        <div className="form-group">
          <label>
            <Calendar size={16} />
            <span>When should this capsule be opened?</span>
          </label>
          <input 
            type="datetime-local" 
            className="xp-input"
            value={unlockDate}
            onChange={handleUnlockDateChange}
            min={formatDateForInput(getMinDate())}
            max={formatDateForInput(getMaxDate())}
            step="300"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose a date between {formatDateForInput(getMinDate())} and {formatDateForInput(getMaxDate())}
          </p>
        </div>
        
        <div className="form-group">
          <label>
            <Key size={16} />
            <span>Set a Secret Key:</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type={showKey ? 'text' : 'password'}
                className="xp-input pr-10"
                value={capsuleKey}
                onChange={(e) => setCapsuleKey(e.target.value)}
                placeholder="Enter a secure key..."
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button 
              type="button"
              className="xp-button"
              onClick={generateRandomKey}
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This key will be required to open your capsule. Keep it safe!
          </p>
        </div>
        
        <div className="form-group">
          <label>
            <Upload size={16} />
            <span>Add files to your capsule:</span>
          </label>
          <div className="file-input-container">
            <input 
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="file-input"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="xp-button file-button">
              <FileImage size={16} />
              <span>Choose Files</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Supported files: Images, videos, audio, PDF, DOC, TXT (Max 10MB total)
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Selected Files:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square border rounded-lg overflow-hidden bg-gray-50">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={imagePreviewUrls[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FileText size={32} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message mb-4">
            <Lock size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="xp-button primary"
            disabled={isSubmitting}
          >
            <Save size={16} />
            <span>{isSubmitting ? 'Creating...' : 'Create Time Capsule'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimeCapsuleForm;