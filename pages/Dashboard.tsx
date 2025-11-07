import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Module } from '../types';
import { Language, Category } from '../types';
import { translations } from '../constants';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import ModuleGrid from '../components/ModuleGrid';
import AdminModuleModal from '../components/AdminModuleModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';


export default function Dashboard() {
  const { user, profile } = useAuth();
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [activeTab, setActiveTab] = useState<Category>(Category.Applications);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const fetchModulesAndFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: modulesData, error: modulesError } = await supabase.from('modules').select('*');
      if (modulesError) throw modulesError;
      setAllModules(modulesData || []);

      const { data: favoritesData, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('module_id')
        .eq('user_id', user.id);
      if (favoritesError) throw favoritesError;
      setFavorites(favoritesData.map((fav) => fav.module_id));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchModulesAndFavorites();
  }, [fetchModulesAndFavorites]);

  useEffect(() => {
    if(profile?.role !== 'admin' && activeTab === Category.Admin) {
        setActiveTab(Category.Applications);
    }
  }, [profile, activeTab]);


  const currentTranslations = translations[language];

  const toggleFavorite = async (moduleId: number) => {
    if (!user) return;
    const isFavorite = favorites.includes(moduleId);
    
    try {
        if (isFavorite) {
            const { error } = await supabase
              .from('user_favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('module_id', moduleId);
            if (error) throw error;
            setFavorites((prev) => prev.filter((id) => id !== moduleId));
        } else {
             const { error } = await supabase
               .from('user_favorites')
               .insert({ user_id: user.id, module_id: moduleId });
             if (error) throw error;
             setFavorites((prev) => [...prev, moduleId]);
        }
    } catch (error) {
        console.error("Failed to toggle favorite", error);
    }
  };

  const filteredModules = useMemo((): Module[] => {
    if (profile?.role === 'admin' && activeTab === Category.Admin) {
        return allModules;
    }
    if (activeTab === Category.Favorites) {
      return allModules.filter((module) => favorites.includes(module.id));
    }
    return allModules.filter((module) => module.category === activeTab);
  }, [activeTab, favorites, allModules, profile]);

  const handleOpenModal = (module: Module | null) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingModule(null);
    setIsModalOpen(false);
  };

  const handleSaveModule = async (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
    try {
        if (editingModule) { // Update
            const updatePayload = {
                ...module,
                updated_at: new Date().toISOString(),
            };
            const { error, data } = await supabase
                .from('modules')
                .update(updatePayload)
                .eq('id', editingModule.id)
                .select()
                .single();
            if (error) throw error;
            setAllModules(allModules.map(m => m.id === data.id ? data : m));
        } else { // Create
            const { data, error } = await supabase
                .from('modules')
                .insert(module)
                .select()
                .single();
            if (error) throw error;
            setAllModules([...allModules, data]);
        }
        handleCloseModal();
    } catch (err: any) {
        console.error("Failed to save module", err);
        const errorMessage = err.message || 'An unknown error occurred. Please check the console for details.';
        alert(`Failed to save module: ${errorMessage}`);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    try {
        const { error } = await supabase.from('modules').delete().eq('id', moduleId);
        if (error) throw error;
        setAllModules(allModules.filter(m => m.id !== moduleId));
    } catch (error: any) {
        console.error("Failed to delete module", error);
        const errorMessage = error.message || 'An unknown error occurred.';
        alert(`Failed to delete module: ${errorMessage}`);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl">
          <Header 
            language={language} 
            setLanguage={setLanguage} 
            translations={currentTranslations} 
          />
          <main className="mt-6 bg-white shadow-sm border border-gray-200 rounded-lg">
            <Tabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              translations={currentTranslations} 
            />
            {loading ? (
                <div className="p-16 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <ModuleGrid
                    modules={filteredModules}
                    language={language}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    translations={currentTranslations}
                    activeTab={activeTab}
                    onEdit={(module) => handleOpenModal(module)}
                    onDelete={handleDeleteModule}
                    onAdd={() => handleOpenModal(null)}
                />
            )}
          </main>
        </div>
      </div>
      {isModalOpen && (
        <AdminModuleModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveModule}
            module={editingModule}
            translations={currentTranslations}
        />
      )}
    </>
  );
}