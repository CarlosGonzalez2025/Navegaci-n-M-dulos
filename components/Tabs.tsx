import React from 'react';
import type { Category } from '../types';
import { Category as CategoryEnum } from '../types';
import { useAuth } from '../contexts/AuthContext';


interface TabsProps {
  activeTab: Category;
  setActiveTab: (category: Category) => void;
  translations: {
    favorites: string;
    applications: string;
    navigationMap: string;
    processMap: string;
    admin: string;
  };
}

const Tab: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const baseClasses = 'px-4 py-3 text-sm font-semibold focus:outline-none transition-colors duration-200 whitespace-nowrap';
  const activeClasses = 'border-b-2 border-blue-600 text-blue-600';
  const inactiveClasses = 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent';
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};


const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, translations }) => {
  const { profile } = useAuth();
  const TABS: { id: Category; label: string; adminOnly: boolean }[] = [
    { id: CategoryEnum.Favorites, label: translations.favorites, adminOnly: false },
    { id: CategoryEnum.Applications, label: translations.applications, adminOnly: false },
    { id: CategoryEnum.Navigation, label: translations.navigationMap, adminOnly: false },
    { id: CategoryEnum.Processes, label: translations.processMap, adminOnly: false },
    { id: CategoryEnum.Admin, label: translations.admin, adminOnly: true },
  ];

  return (
    <nav className="border-b border-gray-200">
      <div className="flex space-x-4 px-4 overflow-x-auto">
        {TABS.map((tab) => {
          if (tab.adminOnly && profile?.role !== 'admin') {
            return null;
          }
          return (
            <Tab
              key={tab.id}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          )
        })}
      </div>
    </nav>
  );
};

export default Tabs;
