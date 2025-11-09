import React from 'react';
import type { Module, Language } from '../types';
import * as HeroIcons from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface ModuleCardProps {
  module: Module;
  language: Language;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
  isLoading?: boolean;
  translations: {
    confirmDelete: string;
    edit: string;
    delete: string;
    addToFavorites?: string;
    removeFromFavorites?: string;
  };
}

const DynamicHeroIcon = ({ icon }: { icon: string | null }) => {
  if (!icon) {
    return <HeroIcons.Squares2X2Icon className="h-10 w-10 text-gray-400" />;
  }
  
  // Handle common icon name variations
  const normalizedIcon = icon.endsWith('Icon') ? icon : `${icon}Icon`;
  const IconComponent = HeroIcons[normalizedIcon as keyof typeof HeroIcons];
  
  if (!IconComponent) { 
    console.warn(`Icon not found: ${icon}. Using fallback icon.`);
    return <HeroIcons.Squares2X2Icon className="h-10 w-10 text-gray-400" />;
  }
  
  return <IconComponent className="h-10 w-10 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  language, 
  isFavorite, 
  toggleFavorite, 
  onEdit, 
  onDelete, 
  isLoading = false,
  translations 
}) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

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
  
  const name = getModuleName(module, language);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      onDelete(module);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      onEdit(module);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      toggleFavorite(module.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
  };

  return (
    <a
      href={module.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleCardClick}
      className={`group flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 relative ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      aria-label={`Abrir ${name} en nueva pestaña`}
    >
      <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm group-hover:border-blue-300 group-hover:shadow-md transition-all duration-200">
        <DynamicHeroIcon icon={module.icon} />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 leading-tight line-clamp-2">
        {name}
      </p>
      
      {!isAdmin && (
        <button 
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`absolute top-1 right-1 p-1 rounded-full transition-all duration-200 ${
            isLoading 
              ? 'cursor-not-allowed opacity-50' 
              : 'text-gray-300 hover:bg-yellow-100 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50'
          }`}
          aria-label={isFavorite ? 
            (translations.removeFromFavorites || 'Quitar de favoritos') : 
            (translations.addToFavorites || 'Añadir a favoritos')
          }
        >
          <HeroIcons.StarIcon 
            className={`h-5 w-5 transition-colors duration-200 ${
              isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`} 
          />
        </button>
      )}

      {isAdmin && (
        <div className="absolute top-0 right-0 flex flex-col p-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={handleEdit}
            disabled={isLoading}
            className={`p-1 rounded-full bg-white text-gray-400 transition-all duration-200 shadow-sm ${
              isLoading 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-blue-100 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
            }`}
            aria-label={`${translations.edit} ${name}`}
          >
            <HeroIcons.PencilIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete}
            disabled={isLoading}
            className={`p-1 rounded-full bg-white text-gray-400 transition-all duration-200 shadow-sm ${
              isLoading 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-red-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50'
            }`}
            aria-label={`${translations.delete} ${name}`}
          >
            <HeroIcons.TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg pointer-events-none"></div>
      )}
    </a>
  );
};

export default ModuleCard;