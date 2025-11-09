import React, { useState, useEffect } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { User, UserRole } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  user: User | null;
  isLoading?: boolean;
  canUpdatePassword?: boolean;
  translations: {
    addUser: string;
    editUser: string;
    userName: string;
    userEmail: string;
    userPassword: string;
    userRole: string;
    userCompany: string;
    userDepartment: string;
    userPhone: string;
    userActive: string;
    save: string;
    cancel: string;
    required: string;
    invalidEmail: string;
    passwordMinLength: string;
    // Roles
    admin: string;
    coordinator: string;
    sst_specialist: string;
    nurse: string;
    employee: string;
  };
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading = false,
  canUpdatePassword = false,
  translations
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as UserRole,
    company: '',
    department: '',
    phone: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'employee',
        company: user.company || '',
        department: user.department || '',
        phone: user.phone || '',
        is_active: user.is_active !== false
      });
      setChangePassword(false);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        company: '',
        department: '',
        phone: '',
        is_active: true
      });
      setChangePassword(true); // Always require password for new users
    }
    setErrors({});
    setShowPassword(false);
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = translations.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = translations.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translations.invalidEmail;
    }

    // Password validation
    if (!user && !formData.password) {
      newErrors.password = translations.required;
    } else if (changePassword && formData.password && formData.password.length < 6) {
      newErrors.password = translations.passwordMinLength || 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.company.trim()) {
      newErrors.company = translations.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      company: formData.company.trim(),
      department: formData.department.trim(),
      phone: formData.phone.trim(),
      is_active: formData.is_active
    };

    // Include password if it's a new user or if changing password
    if (!user || (changePassword && formData.password)) {
      (userData as any).password = formData.password;
    }

    onSave(userData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const roleOptions = [
    { value: 'admin', label: translations.admin },
    { value: 'coordinator', label: translations.coordinator },
    { value: 'sst_specialist', label: translations.sst_specialist },
    { value: 'nurse', label: translations.nurse },
    { value: 'employee', label: translations.employee }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? translations.editUser : translations.addUser}
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
          <div className="p-6 space-y-4">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.userName} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre completo del usuario"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.userEmail} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading || !!user} // Disable email editing for existing users
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="correo@empresa.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password section */}
            {(!user || (user && canUpdatePassword)) && (
              <div>
                {user && (
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="changePassword"
                      checked={changePassword}
                      onChange={(e) => {
                        setChangePassword(e.target.checked);
                        if (!e.target.checked) {
                          handleInputChange('password', '');
                        }
                      }}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="changePassword" className="ml-2 text-sm text-gray-700">
                      Cambiar contraseña
                    </label>
                  </div>
                )}
                
                {(!user || changePassword) && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.userPassword} {!user && '*'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading || (user && !changePassword)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={user ? "Nueva contraseña (mínimo 6 caracteres)" : "Mínimo 6 caracteres"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading || (user && !changePassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.userRole} *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.userCompany} *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                  errors.company ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre de la empresa"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            {/* Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.userDepartment}
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Departamento (opcional)"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.userPhone}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="+57 300 123 4567"
              />
            </div>

            {/* Estado activo (solo para editar) */}
            {user && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  {translations.userActive}
                </label>
              </div>
            )}
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

export default UserModal;