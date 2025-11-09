import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import type { Profile, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Intentar obtener el perfil
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Si no existe el perfil, crear uno básico
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: 'Usuario',
              role: 'employee',
              company: 'CHEC',
              is_active: true
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            // Crear perfil local temporal
            setProfile({
              id: userId,
              name: 'Usuario',
              role: 'employee',
              company: 'CHEC',
              is_active: true
            });
          } else {
            setProfile(newProfile as Profile);
          }
        } else {
          console.error('Error fetching profile:', error);
          // Crear perfil local temporal si hay problemas de permisos
          setProfile({
            id: userId,
            name: 'Usuario',
            role: 'employee',
            company: 'CHEC',
            is_active: true
          });
        }
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      // Perfil por defecto en caso de error
      setProfile({
        id: userId,
        name: 'Usuario',
        role: 'employee',
        company: 'CHEC',
        is_active: true
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};