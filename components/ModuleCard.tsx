import React from 'react';
import type { Module, Language } from '../types';
import * as HeroIcons from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { Category } from '../types';


interface ModuleCardProps {
  module: Module;
  language: Language;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
  onEdit: (module: Module) => void;
  onDelete: (id: number) => void;
  translations: {
    confirmDelete: string;
    edit: string;
    delete: string;
  };
}

const DynamicHeroIcon = ({ icon }: { icon: string | null }) => {
  if (!icon) {
    return <HeroIcons.QuestionMarkCircleIcon className="h-10 w-10 text-gray-400" />;
  }
  const IconComponent = HeroIcons[icon as keyof typeof HeroIcons];
  if (!IconComponent) { 
    return <HeroIcons.QuestionMarkCircleIcon className="h-10 w-10 text-gray-400" />;
  }
  return <IconComponent className="h-10 w-10 text-gray-400 group-hover:text-blue-600 transition-colors" />;
};


const ModuleCard: React.FC<ModuleCardProps> = ({ module, language, isFavorite, toggleFavorite, onEdit, onDelete, translations }) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const getModuleName = (mod: Module, lang: Language): string => {
    switch (lang) {
      case 'en':
        return mod.name_en;
      case 'zh':
        return mod.name_zh;
      case 'es':
      default:
        return mod.name_es;
    }
  };
  
  const name = getModuleName(module, language);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm(translations.confirmDelete)) {
        onDelete(module.id);
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(module);
  }

  return (
    <a
      href={module.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
    >
      <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm group-hover:border-blue-300 group-hover:shadow-md transition-all">
        <DynamicHeroIcon icon={module.icon} />
      </div>
      <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 leading-tight">
        {name}
      </p>
      
      {!isAdmin && (
        <button 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(module.id)
            }} 
            className="absolute top-1 right-1 p-1 rounded-full text-gray-300 hover:bg-yellow-100 hover:text-yellow-500 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <HeroIcons.StarIcon className={`h-5 w-5 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        </button>
      )}

      {isAdmin && (
        <div className="absolute top-0 right-0 flex flex-col p-1 gap-1">
             <button 
                onClick={handleEdit}
                className="p-1 rounded-full bg-white text-gray-400 hover:bg-blue-100 hover:text-blue-500 transition-colors shadow"
                aria-label={translations.edit}
            >
                <HeroIcons.PencilIcon className="h-4 w-4" />
            </button>
            <button 
                onClick={handleDelete}
                className="p-1 rounded-full bg-white text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors shadow"
                aria-label={translations.delete}
            >
                <HeroIcons.TrashIcon className="h-4 w-4" />
            </button>
        </div>
      )}
    </a>
  );
};

export default ModuleCard;