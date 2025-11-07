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
  };
  activeTab: Category;
  onEdit: (module: Module) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
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
}) => {
  const { profile } = useAuth();
  const isAdminView = profile?.role === 'admin' && activeTab === CategoryEnum.Admin;

  if (modules.length === 0 && !isAdminView) {
    const message = activeTab === CategoryEnum.Favorites ? translations.noFavorites : translations.noModules;
    return (
      <div className="p-16 flex items-center justify-center text-center">
        <p className="text-gray-500">{message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {isAdminView && (
           <button
            onClick={onAdd}
            className="group flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 border-2 border-dashed border-gray-300 hover:border-blue-400"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <PlusCircleIcon className="h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors"/>
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 leading-tight">
              {translations.addModule}
            </p>
          </button>
        )}
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            language={language}
            isFavorite={favorites.includes(module.id)}
            toggleFavorite={toggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleGrid;
