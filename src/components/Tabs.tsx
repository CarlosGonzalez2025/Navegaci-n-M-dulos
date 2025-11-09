import React from 'react';
import { 
  RectangleStackIcon, 
  DocumentChartBarIcon, 
  StarIcon, 
  CogIcon,
  UsersIcon 
} from '@heroicons/react/24/outline';
import type { Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TabsProps {
  activeTab: Category;
  setActiveTab: (tab: Category) => void;
  translations: {
    applications: string;
    reports: string;
    favorites: string;
    admin: string;
    users: string;
  };
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, translations }) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const tabs = [
    {
      id: 'applications',
      name: translations.applications,
      icon: RectangleStackIcon,
      visible: true
    },
    {
      id: 'reports', 
      name: translations.reports,
      icon: DocumentChartBarIcon,
      visible: true
    },
    {
      id: 'favorites',
      name: translations.favorites,
      icon: StarIcon,
      visible: !isAdmin // Hide favorites for admin users
    },
    {
      id: 'admin',
      name: translations.admin,
      icon: CogIcon,
      visible: isAdmin
    },
    {
      id: 'users',
      name: translations.users,
      icon: UsersIcon,
      visible: isAdmin
    }
  ];

  const visibleTabs = tabs.filter(tab => tab.visible);

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Category)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`mr-2 h-5 w-5 transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;