import type { User } from '@supabase/supabase-js';

export enum Language {
  ES = 'es',
  EN = 'en',
  ZH = 'zh',
}

export enum Category {
  Favorites = 'favorites',
  Applications = 'applications',
  Navigation = 'navigation',
  Processes = 'processes',
  Admin = 'admin',
}

export interface Module {
  id: number;
  name_es: string;
  name_en: string;
  name_zh: string;
  // Fix: Use Exclude for union types, not Omit. Omit is for object property types.
  category: Exclude<Category, Category.Favorites | Category.Admin>;
  url: string;
  icon: string | null;
  description?: string | null;
  created_at?: string;
}

export interface Profile {
    id: string;
    role: 'admin' | 'user';
    username?: string;
}

export interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    logout: () => Promise<void>;
}