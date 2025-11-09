import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import IconSelector from './IconSelector';
import { isValidIcon, getSuggestedIconForModule } from '../lib/iconUtils';
import type { Module, Category } from '../types';
import * as HeroIcons from '@heroicons/react/24/outline';

interface AdminModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => void;
  module: Module | null;
  isLoading?: boolean;
  translations: {
    addModule: string;
    editModule: string;
    moduleName: string;
    moduleNameEn: string;
    moduleNameZh: string;
    moduleUrl: string;
    moduleCategory: string;
    moduleIcon: string;
    selectIcon: string;
    searchIcons: string;
    recommended: string;
    categories: string;
    noResults: string;
    save: string;
    cancel: string;
    required: string;
    invalidUrl: string;
    // Categorías
    applications: string;
    reports: string;
    admin: string;
  };
}

const AdminModuleModal: React.FC<AdminModuleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  module,
  isLoading = false,
  translations
}) => {
  const [formData, setFormData] = useState({
    name_es: '',
    name_en: '',
    name_zh: '',
    url: '',
    icon: '',
    category: 'applications' as Category
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showIconSelector, setShowIconSelector] = useState(false);

  useEffect(() => {
    if (module) {
      setFormData({
        name_es: module.name_es || '',
        name_en: module.name_en || '',
        name_zh: module.name_zh || '',
        url: module.url || '',
        icon: module.icon || '',
        category: module.category || 'applications'
      });
    } else {
      setFormData({
        name_es: '',
        name_en: '',
        name_zh: '',
        url: '',
        icon: '',
        category: 'applications'
      });
    }
    setErrors({});
    setShowIconSelector(false);
  }, [module, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_es.trim()) {
      newErrors.name_es = translations.required;
    }

    if (!formData.url.trim()) {
      newErrors.url = translations.required;
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = translations.invalidUrl;
      }
    }

    if (formData.icon && !isValidIcon(formData.icon)) {
      newErrors.icon = 'Icono no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;

    onSave({
      name_es: formData.name_es.trim(),
      name_en: formData.name_en.trim() || formData.name_es.trim(),
      name_zh: formData.name_zh.trim() || formData.name_es.trim(),
      url: formData.url.trim(),
      icon: formData.icon || null,
      category: formData.category
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-sugerir icono basado en el nombre
    if (field === 'name_es' && value && !formData.icon) {
      const suggestedIcon = getSuggestedIconForModule(value);
      setFormData(prev => ({ ...prev, icon: suggestedIcon }));
    }
  };

  const handleIconSelect = (iconName: string) => {
    handleInputChange('icon', iconName);
    setShowIconSelector(false);
  };

  const categoryOptions = [
    { value: 'applications', label: translations.applications },
    { value: 'reports', label: translations.reports },
    { value: 'admin', label: translations.admin }
  ];

  const IconPreview = ({ iconName }: { iconName: string | null }) => {
    if (!iconName) return null;
    
    const normalizedName = iconName.endsWith('Icon') ? iconName : `${iconName}Icon`;
    const Icon = HeroIcons[normalizedName as keyof typeof HeroIcons];
    
    if (!Icon) {
      return <HeroIcons.QuestionMarkCircleIcon className="h-8 w-8 text-gray-400" />;
    }
    
    return <Icon className="h-8 w-8 text-blue-600" />;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {module ? translations.editModule : translations.addModule}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`p-1 rounded-full transition-colors ${
              isLoading ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Nombre en Español */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.moduleName} *
              </label>
              <input
                type="text"
                value={formData.name_es}
                onChange={(e) => handleInputChange('name_es', e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                  errors.name_es ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre del módulo en español"
              />
              {errors.name_es && (
                <p className="mt-1 text-sm text-red-600">{errors.name_es}</p>
              )}
            </div>

            {/* Nombre en Inglés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.moduleNameEn}
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => handleInputChange('name_en', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Module name in English (optional)"
              />
            </div>

            {/* Nombre en Chino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.moduleNameZh}
              </label>
              <input
                type="text"
                value={formData.name_zh}
                onChange={(e) => handleInputChange('name_zh', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="模块名称 (optional)"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.moduleUrl} *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://ejemplo.com/modulo"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.moduleCategory}
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Icono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.moduleIcon}
              </label>
              
              {!showIconSelector ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {formData.icon && (
                      <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                        <IconPreview iconName={formData.icon} />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => handleInputChange('icon', e.target.value)}
                        disabled={isLoading}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                          errors.icon ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Nombre del icono (ej: UserIcon)"
                      />
                      {errors.icon && (
                        <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIconSelector(true)}
                    disabled={isLoading}
                    className={`text-sm transition-colors ${
                      isLoading 
                        ? 'text-gray-400' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {translations.selectIcon}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Seleccionar icono:</span>
                    <button
                      type="button"
                      onClick={() => setShowIconSelector(false)}
                      disabled={isLoading}
                      className={`text-sm transition-colors ${
                        isLoading 
                          ? 'text-gray-400' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Cerrar selector
                    </button>
                  </div>
                  <IconSelector
                    selectedIcon={formData.icon}
                    onIconSelect={handleIconSelect}
                    translations={{
                      selectIcon: translations.selectIcon,
                      searchIcons: translations.searchIcons,
                      recommended: translations.recommended,
                      categories: translations.categories,
                      noResults: translations.noResults
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                isLoading 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {translations.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-colors ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </div>
              ) : (
                translations.save
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModuleModal;