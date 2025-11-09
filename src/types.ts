// Tipos existentes
export enum Language {
  ES = 'es',
  EN = 'en',
  ZH = 'zh'
}

export enum Category {
  Applications = 'applications',
  Reports = 'reports',
  Favorites = 'favorites',
  Admin = 'admin',
  Users = 'users' // Nuevo para gestión de usuarios
}

export interface Module {
  id: number;
  name_es: string;
  name_en: string;
  name_zh: string;
  url: string;
  icon: string | null;
  category: Category;
  created_at: string;
  updated_at: string;
}

// Nuevos tipos para gestión de usuarios
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  department?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  SST_SPECIALIST = 'sst_specialist',
  NURSE = 'nurse',
  EMPLOYEE = 'employee'
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  company: string;
  department?: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

// Tipos para AuthContext
export interface Profile {
  id: string;
  name?: string;
  role?: string;
  company?: string;
  department?: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any; // Supabase User type
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Tipos para formularios
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company: string;
  department?: string;
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: UserRole;
  company?: string;
  department?: string;
  phone?: string;
  is_active?: boolean;
}

// Tipos para filtros y búsqueda
export interface UserFilters {
  role?: UserRole;
  company?: string;
  department?: string;
  is_active?: boolean;
  search?: string;
}

// Tipos para estadísticas de usuarios
export interface UserStats {
  total: number;
  active: number;
  by_role: Record<UserRole, number>;
  by_company: Record<string, number>;
  recent_logins: number;
}

// Tipos para constants/translations
export interface HeaderTranslations {
  companyName: string;
  welcomeMessage: string;
  logout: string;
}