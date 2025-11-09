import React, { useEffect, useCallback } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moduleName: string;
  isLoading?: boolean;
  translations: {
    deleteModuleTitle?: string;
    confirmDelete: string;
    confirmDeleteMessage?: string;
    delete: string;
    cancel: string;
  };
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  moduleName, 
  isLoading = false,
  translations 
}) => {
  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && !isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-in fade-in duration-200" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200" 
        onClick={e => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mr-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h3 id="modal-title" className="text-lg leading-6 font-semibold text-gray-900">
              {translations.deleteModuleTitle || 'Eliminar módulo'}
            </h3>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={`p-1 rounded-full transition-colors duration-200 ${
              isLoading 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div id="modal-description">
            <p className="text-sm text-gray-600 mb-3">
              {translations.confirmDelete}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold text-red-800">{moduleName}</p>
            </div>
            <p className="text-sm text-gray-500">
              {translations.confirmDeleteMessage || 'Esta acción no se puede deshacer.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors duration-200 ${
              isLoading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300'
            }`}
          >
            {translations.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-all duration-200 ${
              isLoading 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Eliminando...
              </div>
            ) : (
              translations.delete
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;