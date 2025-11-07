import React, { useState, useEffect } from 'react';
import type { Module } from '../types';
import { Category } from '../types';

interface AdminModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => void;
  module: Module | null;
  translations: any;
}

const AdminModuleModal: React.FC<AdminModuleModalProps> = ({ isOpen, onClose, onSave, module, translations }) => {
  const [formData, setFormData] = useState({
    name_es: '',
    name_en: '',
    name_zh: '',
    category: Category.Applications,
    url: '',
    icon: '',
    description: '',
  });

  useEffect(() => {
    if (module) {
      setFormData({
        name_es: module.name_es,
        name_en: module.name_en,
        name_zh: module.name_zh,
        category: module.category,
        url: module.url,
        icon: module.icon || '',
        description: module.description || '',
      });
    } else {
      setFormData({
        name_es: '',
        name_en: '',
        name_zh: '',
        category: Category.Applications,
        url: '',
        icon: '',
        description: '',
      });
    }
  }, [module]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: The type of `formData.category` is inferred as the general `Category` enum,
    // which is wider than what the `onSave` prop expects. Since the form only
    // allows valid categories to be selected, we can safely cast it to the
    // more specific type required by the Module interface.
    const { description, icon, category, ...rest } = formData;
    const modulePayload = {
      ...rest,
      category: category as Exclude<Category, Category.Favorites | Category.Admin>,
      description: description || null,
      icon: icon || null,
    };
    onSave(modulePayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">{module ? translations.editModule : translations.addModule}</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{translations.name_es}</label>
                <input type="text" name="name_es" value={formData.name_es} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{translations.name_en}</label>
                <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{translations.name_zh}</label>
                <input type="text" name="name_zh" value={formData.name_zh} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{translations.category}</label>
                <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value={Category.Applications}>Applications</option>
                  <option value={Category.Navigation}>Navigation Map</option>
                  <option value={Category.Processes}>Process Map</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">{translations.url}</label>
                <input type="url" name="url" value={formData.url} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required placeholder="https://example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">{translations.icon}</label>
                <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., AcademicCapIcon" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">{translations.description}</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              {translations.cancel}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
              {translations.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModuleModal;
