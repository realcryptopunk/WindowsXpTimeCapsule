export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface TimeCapsule {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_preview: string;
  unlock_date: string;
  created_at: string;
  images: string[];
  is_locked: boolean;
  visibility: 'private' | 'public';
  mystery_mode: boolean;
  time_skip_enabled: boolean;
  time_skip_interval: string | null;
  thumbnail_url: string | null;
  ai_summary: string | null;
  last_notified_at: string | null;
}

export interface CapsuleKey {
  id: string;
  capsule_id: string;
  key_hash: string;
  created_at: string;
}

export interface CapsuleShare {
  id: string;
  capsule_id: string;
  shared_with: string;
  access_level: 'view' | 'contribute';
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      time_capsules: {
        Row: TimeCapsule;
        Insert: Omit<TimeCapsule, 'id' | 'created_at' | 'content_preview' | 'is_locked'>;
        Update: Partial<Omit<TimeCapsule, 'id' | 'user_id' | 'created_at'>>;
      };
      capsule_keys: {
        Row: CapsuleKey;
        Insert: Omit<CapsuleKey, 'id' | 'created_at'>;
        Update: Partial<Omit<CapsuleKey, 'id' | 'capsule_id' | 'created_at'>>;
      };
      capsule_shares: {
        Row: CapsuleShare;
        Insert: Omit<CapsuleShare, 'id' | 'created_at'>;
        Update: Partial<Omit<CapsuleShare, 'id' | 'capsule_id' | 'created_at'>>;
      };
    };
  };
}