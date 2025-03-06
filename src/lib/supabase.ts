import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const hashCapsuleKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const uploadCapsuleFile = async (
  file: File,
  capsuleId: string,
  userId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${capsuleId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('capsule_files')
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('capsule_files')
    .getPublicUrl(fileName);
    
  return publicUrl;
};

export const generateThumbnail = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    return '/default-thumbnail.png';
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      const maxSize = 100;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
};