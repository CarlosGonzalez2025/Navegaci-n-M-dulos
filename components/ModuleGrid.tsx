import React from 'react';
import type { Module, Language, Category } from '../types';
import { Category as CategoryEnum } from '../types';
import ModuleCard from './ModuleCard';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface ModuleGridProps {
  modules: Module[];
  language: Language;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  translations: {
    noFavorites: string;
    noModules: string;
    addModule: string;
    confirmDelete: string;
    edit: string;
    delete: string;
    addToFavorites?: string;
    removeFromFavorites?: string;
  };
  activeTab: Category;
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

const ModuleGrid: React.FC<ModuleGridProps> = ({
  modules,
  language,
  favorites,
  toggleFavorite,
  translations,
  activeTab,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}) => {
  const { profile } = useAuth();
  const isAdminView = profile?.role === 'admin' && activeTab === CategoryEnum.Admin;

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="p-16 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <div className="text-4xl text-gray-400">📦</div>
      </div>
      <p className="text-gray-500 text-lg">{message}</p>
      {activeTab === CategoryEnum.Favorites && (
        <p className="text-gray-400 text-sm mt-2">
          Haz clic en ⭐ para añadir módulos a favoritos
        </p>
      )}
    </div>
  );

  // Show empty state only when not in admin view or when there are no modules
  if (modules.length === 0) {
    if (isAdminView) {
      // In admin view, still show the add button even if there are no modules
      return (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            <button
              onClick={onAdd}
              disabled={isLoading}
              className={`group flex flex-col items-center text-center p-3 rounded-lg border-2 border-dashed transition-all duration-200 ${
                isLoading
                  ? 'border-gray-200 cursor-not-allowed opacity-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              aria-label={translations.addModule}
            >
              <div className="w-20 h-20 flex items-center justify-center">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PlusCircleIcon className="h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                )}
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 leading-tight">
                {translations.addModule}
              </p>
            </button>
          </div>
          <EmptyState message="No hay módulos configurados" />
        </div>
      );
    }
    
    // Regular empty state for non-admin views
    const message = activeTab === CategoryEnum.Favorites ? translations.noFavorites : translations.noModules;
    return <EmptyState message={message} />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {/* Add module button for admin view */}
        {isAdminView && (
          <button
            onClick={onAdd}
            disabled={isLoading}
            className={`group flex flex-col items-center text-center p-3 rounded-lg border-2 border-dashed transition-all duration-200 ${
              isLoading
                ? 'border-gray-200 cursor-not-allowed opacity-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
            }`}
            aria-label={translations.addModule}
          >
            <div className="w-20 h-20 flex items-center justify-center">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <PlusCircleIcon className="h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              )}
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 leading-tight">
              {translations.addModule}
            </p>
          </button>
        )}
        
        {/* Module cards */}
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            language={language}
            isFavorite={favorites.includes(module.id)}
            toggleFavorite={toggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
            isLoading={isLoading}
            translations={translations}
          />
        ))}
      </div>
      
      {/* Show helpful text for different views */}
      {modules.length > 0 && (
        <div className="mt-8 text-center">
          {activeTab === CategoryEnum.Favorites && (
            <p className="text-gray-400 text-sm">
              {modules.length} módulo{modules.length !== 1 ? 's' : ''} en favoritos
            </p>
          )}
          {isAdminView && (
            <p className="text-gray-400 text-sm">
              Total: {modules.length} módulo{modules.length !== 1 ? 's' : ''} configurado{modules.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleGrid;