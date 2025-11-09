import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { Language as LanguageEnum } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeftStartOnRectangleIcon, 
  KeyIcon,
  UserCircleIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';


interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenChangePasswordModal: () => void;
  translations: {
    companyName: string;
    welcomeMessage: string;
    logout: string;
    changePassword: string;
    userMenu: string;
  };
}

const LanguageButton: React.FC<{
  lang: Language;
  currentLang: Language;
  onClick: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ lang, currentLang, onClick, children }) => (
  <button
    onClick={() => onClick(lang)}
    className={`px-2 py-1 text-xs font-semibold rounded ${
      currentLang === lang
        ? 'text-blue-700 bg-blue-100'
        : 'text-gray-500 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ language, setLanguage, onOpenChangePasswordModal, translations }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
         <div className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
           <img src="https://i.postimg.cc/dVZ1KGxx/Chec-actualizacion-app.png" alt="Company Logo" className="h-16 w-32 object-contain"/>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{translations.companyName}</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">{translations.welcomeMessage}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
            <LanguageButton lang={LanguageEnum.ES} currentLang={language} onClick={setLanguage}>ES</LanguageButton>
            <LanguageButton lang={LanguageEnum.EN} currentLang={language} onClick={setLanguage}>EN</LanguageButton>
            <LanguageButton lang={LanguageEnum.ZH} currentLang={language} onClick={setLanguage}>ZH</LanguageButton>
        </div>
        
        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-label={translations.userMenu}
          >
            <UserCircleIcon className="h-6 w-6 text-gray-500" />
            <span className="hidden md:inline">{user?.email}</span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10 origin-top-right animate-in fade-in duration-100">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate" title={user?.email}>{user?.email}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    onOpenChangePasswordModal();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <KeyIcon className="h-5 w-5 mr-3 text-gray-500" />
                  {translations.changePassword}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-3" />
                  {translations.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;