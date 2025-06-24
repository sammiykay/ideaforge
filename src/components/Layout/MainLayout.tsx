import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { TabNavigation } from './TabNavigation';
import { Header } from './Header';
import { AITopicGenerator } from '../AITopicGenerator/AITopicGenerator';
import { IdeaBoard } from '../IdeaBoard/IdeaBoard';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { Settings } from '../Settings/Settings';

export function MainLayout() {
  const { state } = useApp();

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'ai-suggestions':
        return <AITopicGenerator />;
      case 'my-ideas':
        return <IdeaBoard />;
      case 'progress-tracker':
        return <ProgressTracker />;
      case 'settings':
        return <Settings />;
      default:
        return <AITopicGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation />
      
      <motion.main
        key={state.activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="pb-8"
      >
        {renderActiveTab()}
      </motion.main>
    </div>
  );
}