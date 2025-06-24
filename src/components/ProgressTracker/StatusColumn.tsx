import React from 'react';
import { motion } from 'framer-motion';
import { Idea } from '../../types';
import { ProgressIdeaCard } from './ProgressIdeaCard';

interface StatusColumnProps {
  status: Idea['status'];
  ideas: Idea[];
  index: number;
}

const statusConfig = {
  Exploring: { color: 'bg-blue-100 text-blue-800', icon: '🔍' },
  Reading: { color: 'bg-purple-100 text-purple-800', icon: '📚' },
  Drafting: { color: 'bg-orange-100 text-orange-800', icon: '📝' },
  Writing: { color: 'bg-indigo-100 text-indigo-800', icon: '✍️' },
  Completed: { color: 'bg-green-100 text-green-800', icon: '✅' },
};

export function StatusColumn({ status, ideas, index }: StatusColumnProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-1 min-w-72"
    >
      <div className="mb-4">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.color} w-fit`}>
          <span className="text-lg">{config.icon}</span>
          <span className="font-medium">{status}</span>
          <span className="text-sm bg-white bg-opacity-60 px-2 py-1 rounded-full">
            {ideas.length}
          </span>
        </div>
      </div>

      <div className="space-y-3 min-h-96">
        {ideas.map((idea) => (
          <ProgressIdeaCard key={idea.id} idea={idea} />
        ))}
        
        {ideas.length === 0 && (
          <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            No ideas in {status.toLowerCase()}
          </div>
        )}
      </div>
    </motion.div>
  );
}