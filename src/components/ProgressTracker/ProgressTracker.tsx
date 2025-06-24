import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { StatusColumn } from './StatusColumn';
import { ProgressStats } from './ProgressStats';

const STATUSES = ['Exploring', 'Reading', 'Drafting', 'Writing', 'Completed'] as const;

export function ProgressTracker() {
  const { state } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Progress Tracker</h1>
        <p className="text-gray-600">Track your ideas through the research pipeline</p>
      </motion.div>

      <ProgressStats ideas={state.ideas} />

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {STATUSES.map((status, index) => (
            <StatusColumn
              key={status}
              status={status}
              ideas={state.ideas.filter(idea => idea.status === status)}
              index={index}
            />
          ))}
        </div>
      </div>

      {state.ideas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas to track</h3>
          <p className="text-gray-600">
            Add some research ideas to see your progress here
          </p>
        </motion.div>
      )}
    </div>
  );
}