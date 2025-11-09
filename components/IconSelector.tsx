import React, { useState, useMemo } from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import { getCategorizedIcons, getSuggestedIcons, getSSTRecommendedIcons, isValidIcon } from '../utils/iconUtils';

interface IconSelectorProps {
  selectedIcon: string | null;
  onIconSelect: (iconName: string) => void;
  translations: {
    selectIcon: string;
    searchIcons: string;
    recommended: string;
    categories: string;
    noResults: string;
  };
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  selectedIcon, 
  onIconSelect, 
  translations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('recommended');

  const categorizedIcons = useMemo(() => getCategorizedIcons(), []);
  const sstRecommended = useMemo(() => getSSTRecommendedIcons(), []);

  // Filtrar iconos basado en búsqueda
  const filteredIcons = useMemo(() => {
    if (activeCategory === 'recommended') {
      return Object.values(sstRecommended).flat();
    }
    
    if (activeCategory === 'search' && searchTerm) {
      return getSuggestedIcons(searchTerm);
    }
    
    return categorizedIcons[activeCategory as keyof typeof categorizedIcons] || [];
  }, [searchTerm, activeCategory, categorizedIcons, sstRecommended]);

  const categories = [
    { key: 'recommended', label: translations.recommended, icon: 'StarIcon' },
    { key: 'security', label: 'Seguridad', icon: 'ShieldCheckIcon' },
    { key: 'apps', label: 'Aplicaciones', icon: 'ComputerDesktopIcon' },
    { key: 'documents', label: 'Documentos', icon: 'DocumentTextIcon' },
    { key: 'communication', label: 'Comunicación', icon: 'ChatBubbleLeftIcon' },
    { key: 'business', label: 'Negocio', icon: 'BuildingOfficeIcon' },
    { key: 'tools', label: 'Herramientas', icon: 'WrenchScrewdriverIcon' },
    { key: 'media', label: 'Multimedia', icon: 'PhotoIcon' },
    { key: 'interface', label: 'Interfaz', icon: 'Squares2X2Icon' }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setActiveCategory('search');
    }
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const normalizedName = iconName.endsWith('Icon') ? iconName : `${iconName}Icon`;
    const Icon = HeroIcons[normalizedName as keyof typeof HeroIcons];
    
    if (!Icon) {
      return <HeroIcons.QuestionMarkCircleIcon className="h-6 w-6" />;
    }
    
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="relative">
        <HeroIcons.MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={translations.searchIcons}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const CategoryIcon = HeroIcons[category.icon as keyof typeof HeroIcons] || HeroIcons.TagIcon;
          return (
            <button
              key={category.key}
              onClick={() => {
                setActiveCategory(category.key);
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                activeCategory === category.key
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <CategoryIcon className="h-4 w-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Grid de iconos */}
      <div className="border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
        {filteredIcons.length === 0 ? (
          <div className="text-center py-8">
            <HeroIcons.MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">{translations.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-2">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                onClick={() => onIconSelect(iconName)}
                className={`p-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex items-center justify-center ${
                  selectedIcon === iconName
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                title={iconName.replace('Icon', '')}
              >
                <IconComponent iconName={iconName} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vista previa del icono seleccionado */}
      {selectedIcon && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
              <IconComponent iconName={selectedIcon} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedIcon}</p>
              <p className="text-sm text-gray-500">Icono seleccionado</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;