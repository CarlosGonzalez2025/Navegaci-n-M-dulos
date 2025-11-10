import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Module } from '../types';
import { Language, Category } from '../types';
import { translations } from '../constants';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import ModuleGrid from '../components/ModuleGrid';
import UserManagement from '../components/UserManagement';
import AdminModuleModal from '../components/AdminModuleModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import ChangePasswordModal from '../components/ChangePasswordModal'; // Import the new modal
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [activeTab, setActiveTab] = useState<Category>(Category.Applications);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingModule, setDeletingModule] = useState<Module | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  
  // State for the new change password modal
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const currentTranslations = translations[language];

  const fetchModulesAndFavorites = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch modules and favorites in parallel
      const [modulesResponse, favoritesResponse] = await Promise.all([
        supabase.from('modules').select('*').order('name_es'),
        supabase
          .from('user_favorites')
          .select('module_id')
          .eq('user_id', user.id)
      ]);

      if (modulesResponse.error) throw modulesResponse.error;
      if (favoritesResponse.error) throw favoritesResponse.error;

      setAllModules(modulesResponse.data || []);
      setFavorites(favoritesResponse.data?.map((fav) => fav.module_id) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchModulesAndFavorites();
  }, [fetchModulesAndFavorites]);

  useEffect(() => {
    if (profile?.role !== 'admin' && (activeTab === Category.Admin || activeTab === Category.Users)) {
      setActiveTab(Category.Applications);
    }
  }, [profile, activeTab]);

  const getModuleName = (mod: Module, lang: Language): string => {
    switch (lang) {
      case 'en':
        return mod.name_en || mod.name_es;
      case 'zh':
        return mod.name_zh || mod.name_es;
      case 'es':
      default:
        return mod.name_es;
    }
  };

  const toggleFavorite = async (moduleId: number) => {
    if (!user || isOperationLoading) return;
    
    const isFavorite = favorites.includes(moduleId);
    
    // Optimistic update
    setFavorites((prev) => 
      isFavorite 
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
    
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('module_id', moduleId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, module_id: moduleId });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      // Revert optimistic update
      setFavorites((prev) => 
        isFavorite 
          ? [...prev, moduleId]
          : prev.filter((id) => id !== moduleId)
      );
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
    if (isOperationLoading) return; // Prevent closing during operations
    setEditingModule(null);
    setIsModalOpen(false);
  };

  const handleSaveModule = async (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
    setIsOperationLoading(true);

    // Explicitly define the payload to ensure no extra fields are sent.
    const payload = {
      name_es: moduleData.name_es,
      name_en: moduleData.name_en,
      name_zh: moduleData.name_zh,
      url: moduleData.url,
      icon: moduleData.icon,
      category: moduleData.category,
    };
    
    try {
      if (editingModule) {
        // Update existing module
        const { error, data } = await supabase
          .from('modules')
          .update(payload)
          .eq('id', editingModule.id)
          .select()
          .single();
        
        if (error) throw error;
        setAllModules(prev => prev.map(m => m.id === data.id ? data : m));
      } else {
        // Create new module
        const { data, error } = await supabase
          .from('modules')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        setAllModules(prev => [...prev, data]);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save module", err);
      let message = err?.message || JSON.stringify(err);
      if (message === '{}' || message.includes('[object Object]')) {
          message = err.toString();
      }
      alert(`Error al guardar módulo: ${message}`);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleDeleteRequest = (module: Module) => {
    if (isOperationLoading) return;
    setDeletingModule(module);
  };

  const handleCancelDelete = () => {
    if (isOperationLoading) return;
    setDeletingModule(null);
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (isOperationLoading) return;
    
    setIsOperationLoading(true);
    
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) throw error;
      
      setAllModules(prev => prev.filter(m => m.id !== moduleId));
      // Also remove from favorites if present
      setFavorites(prev => prev.filter(id => id !== moduleId));
    } catch (error: any) {
      console.error("Failed to delete module", error);
      let message = error?.message || JSON.stringify(error);
      if (message === '{}' || message.includes('[object Object]')) {
          message = error.toString();
      }
      alert(`Error al eliminar módulo: ${message}`);
    } finally {
      setIsOperationLoading(false);
      setDeletingModule(null);
    }
  };

  // Handler for changing password
  const handleChangePassword = async (newPassword: string) => {
    setIsOperationLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert(currentTranslations.passwordUpdatedSuccess);
      setIsChangePasswordModalOpen(false);
    } catch (err: any) {
      console.error("Failed to update password", err);
      let message = err?.message || JSON.stringify(err);
      if (message === '{}' || message.includes('[object Object]')) {
          message = err.toString();
      }
      alert(`Error: ${message}`);
    } finally {
      setIsOperationLoading(false);
    }
  };


  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === Category.Users && profile?.role === 'admin') {
      return (
        <UserManagement 
          translations={currentTranslations}
        />
      );
    }

    // Default module grid for other tabs
    if (loading) {
      return (
        <div className="p-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Cargando módulos...</p>
          </div>
        </div>
      );
    }

    return (
      <ModuleGrid
        modules={filteredModules}
        language={language}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        translations={currentTranslations}
        activeTab={activeTab}
        onEdit={handleOpenModal}
        onDelete={handleDeleteRequest}
        onAdd={() => handleOpenModal(null)}
        isLoading={isOperationLoading}
      />
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchModulesAndFavorites}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl">
          <Header 
            language={language} 
            setLanguage={setLanguage}
            onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
            translations={currentTranslations} 
          />
          <main className="mt-6 bg-white shadow-sm border border-gray-200 rounded-lg">
            <Tabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              translations={currentTranslations} 
            />
            {renderContent()}
          </main>
          <footer className="text-center py-4 mt-4">
            <p className="text-xs text-gray-500">
              {`© 2025 China Harbour Engineering Company. ${currentTranslations.footerRights}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {currentTranslations.footerDevelopedBy} <a href="" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"></a>
            </p>
          </footer>
        </div>
      </div>
      
      {/* Modales para módulos */}
      {isModalOpen && activeTab !== Category.Users && (
        <AdminModuleModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveModule}
          module={editingModule}
          translations={currentTranslations}
          isLoading={isOperationLoading}
        />
      )}
      
      {deletingModule && (
        <ConfirmDeleteModal
          isOpen={!!deletingModule}
          onClose={handleCancelDelete}
          onConfirm={() => handleDeleteModule(deletingModule.id)}
          moduleName={getModuleName(deletingModule, language)}
          translations={currentTranslations}
          isLoading={isOperationLoading}
        />
      )}
      
      {/* Modal para cambio de contraseña */}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          onSave={handleChangePassword}
          isLoading={isOperationLoading}
          translations={currentTranslations}
        />
      )}
    </>
  );
}