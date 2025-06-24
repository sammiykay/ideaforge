import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'ai-suggestions', label: 'AI Suggestions', icon: <Brain className="w-5 h-5" /> },
  { id: 'my-ideas', label: 'My Ideas', icon: <FileText className="w-5 h-5" /> },
  { id: 'progress-tracker', label: 'Progress', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function TabNavigation() {
  const { state, dispatch } = useApp();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex space-x-1 max-w-6xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              state.activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            
            {state.activeTab === tab.id && (
              <motion.div
                className="absolute inset-0 bg-blue-100 rounded-lg -z-10"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}