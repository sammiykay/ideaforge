import React from 'react';
import { motion } from 'framer-motion';
import { Star, Tag, Calendar, ArrowRight, ArrowLeft, Brain } from 'lucide-react';
import { Idea } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProgressIdeaCardProps {
  idea: Idea;
}

const STATUS_ORDER: Idea['status'][] = ['Exploring', 'Reading', 'Drafting', 'Writing', 'Completed'];

export function ProgressIdeaCard({ idea }: ProgressIdeaCardProps) {
  const { dispatch } = useApp();

  const currentIndex = STATUS_ORDER.indexOf(idea.status);
  const canMoveForward = currentIndex < STATUS_ORDER.length - 1;
  const canMoveBackward = currentIndex > 0;

  const moveStatus = (direction: 'forward' | 'backward') => {
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    const newStatus = STATUS_ORDER[newIndex];
    
    const updatedIdea = {
      ...idea,
      status: newStatus,
      updatedAt: new Date(),
    };
    
    dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900 text-sm leading-tight">
              {idea.title}
            </h3>
            {idea.isAIGenerated && (
              <Brain className="w-3 h-3 text-purple-500" title="AI Generated" />
            )}
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {idea.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= idea.interest ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {idea.difficulty}
        </span>
      </div>

      {idea.tags.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <Tag className="w-3 h-3 text-gray-400" />
          {idea.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {idea.tags.length > 2 && (
            <span className="text-xs text-gray-400">
              +{idea.tags.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{idea.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-1">
        {canMoveBackward && (
          <button
            onClick={() => moveStatus('backward')}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        )}
        {canMoveForward && (
          <button
            onClick={() => moveStatus('forward')}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            Next
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}