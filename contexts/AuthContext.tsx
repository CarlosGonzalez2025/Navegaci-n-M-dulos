import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import type { Profile, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // This single useEffect, which relies on onAuthStateChange, is the correct
  // pattern. The issue was that awaiting fetchProfile could hang the entire
  // app if the database connection is unstable.
  useEffect(() => {
    setLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        // As soon as we get an auth event, we set the user.
        setUser(session?.user ?? null);
        
        // If there's a user, we fetch their profile. This happens in the
        // background and won't block the UI from rendering.
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          // If there's no session, ensure the profile is cleared.
          setProfile(null);
        }
        
        // Now that we have the authentication state, we can hide the
        // main app loader.
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // I've modified fetchProfile to handle its own errors. This makes the
  // calling code cleaner and ensures that a failed profile fetch won't
  // crash the app.
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        throw error;
      }
      setProfile(data as Profile | null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // On error, we clear the profile to prevent showing stale data.
      setProfile(null);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will clear the state, but we also do it
    // here for a more responsive UI.
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
