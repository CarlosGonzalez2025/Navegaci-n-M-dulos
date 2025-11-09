import React from 'react';
import type { Language } from '../types';
import { Language as LanguageEnum } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';


interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: {
    companyName: string;
    welcomeMessage: string;
    logout: string;
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


const Header: React.FC<HeaderProps> = ({ language, setLanguage, translations }) => {
  const { user, logout } = useAuth();

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
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:block">{user?.email}</span>
            <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                aria-label={translations.logout}
            >
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">{translations.logout}</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
