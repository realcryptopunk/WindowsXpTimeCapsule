import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimeCapsule {
  id: string;
  title: string;
  content: string;
  unlockDate: Date;
  createdAt: Date;
  images: string[];
  isLocked: boolean;
  visibility: 'private' | 'public';
  mysteryMode: boolean;
  timeSkipEnabled: boolean;
  timeSkipInterval?: string;
  thumbnailUrl?: string;
}

interface CreateCapsuleData {
  title: string;
  content: string;
  unlockDate: Date;
  key: string;
  files?: File[];
  visibility?: 'private' | 'public';
  mysteryMode?: boolean;
  timeSkipEnabled?: boolean;
  timeSkipInterval?: string;
}

interface CapsuleStore {
  capsules: TimeCapsule[];
  capsuleKeys: Record<string, string>; // id -> hashed key
  isLoading: boolean;
  error: string | null;
  createCapsule: (data: CreateCapsuleData) => Promise<string>;
  unlockCapsule: (id: string, key: string) => Promise<boolean>;
  removeCapsule: (id: string) => void;
  toggleVisibility: (id: string) => Promise<void>;
  skipToNextDate: (id: string) => Promise<void>;
}

const hashKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const useCapsuleStore = create<CapsuleStore>()(
  persist(
    (set, get) => ({
      capsules: [],
      capsuleKeys: {},
      isLoading: false,
      error: null,

      createCapsule: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const id = crypto.randomUUID();
          const keyHash = await hashKey(data.key);
          let thumbnailUrl: string | undefined;
          const uploadedFiles: string[] = [];
          
          // Handle files
          if (data.files?.length) {
            for (const file of data.files) {
              if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                uploadedFiles.push(url);
                
                // Use first image as thumbnail
                if (!thumbnailUrl) {
                  thumbnailUrl = url;
                }
              }
            }
          }
          
          const capsule: TimeCapsule = {
            id,
            title: data.title,
            content: data.content,
            unlockDate: data.unlockDate,
            createdAt: new Date(),
            images: uploadedFiles,
            isLocked: true,
            visibility: data.visibility || 'private',
            mysteryMode: data.mysteryMode || false,
            timeSkipEnabled: data.timeSkipEnabled || false,
            timeSkipInterval: data.timeSkipInterval,
            thumbnailUrl
          };
          
          set(state => ({
            capsules: [...state.capsules, capsule],
            capsuleKeys: { ...state.capsuleKeys, [id]: keyHash },
            isLoading: false
          }));
          
          return id;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      unlockCapsule: async (id: string, key: string) => {
        try {
          const keyHash = await hashKey(key);
          const storedHash = get().capsuleKeys[id];
          
          if (keyHash === storedHash) {
            set(state => ({
              capsules: state.capsules.map(c =>
                c.id === id ? { ...c, isLocked: false } : c
              )
            }));
            return true;
          }
          
          return false;
        } catch {
          return false;
        }
      },

      removeCapsule: (id: string) => {
        set(state => ({
          capsules: state.capsules.filter(c => c.id !== id),
          capsuleKeys: Object.fromEntries(
            Object.entries(state.capsuleKeys).filter(([key]) => key !== id)
          )
        }));
      },
      
      toggleVisibility: async (id: string) => {
        set(state => ({
          capsules: state.capsules.map(c =>
            c.id === id
              ? { ...c, visibility: c.visibility === 'public' ? 'private' : 'public' }
              : c
          )
        }));
      },
      
      skipToNextDate: async (id: string) => {
        set(state => ({
          capsules: state.capsules.map(c =>
            c.id === id
              ? {
                  ...c,
                  unlockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
              : c
          )
        }));
      }
    }),
    {
      name: 'time-capsules-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          
          // Convert date strings back to Date objects
          if (data.state?.capsules) {
            data.state.capsules = data.state.capsules.map((c: any) => ({
              ...c,
              unlockDate: new Date(c.unlockDate),
              createdAt: new Date(c.createdAt)
            }));
          }
          
          return data;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);