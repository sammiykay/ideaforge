import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Lightbulb, Tag, CheckCircle } from 'lucide-react';
import { AITopicSuggestion } from '../../types';

interface SuggestionCardProps {
  suggestion: AITopicSuggestion;
  onAddToIdeas: (suggestion: AITopicSuggestion) => void;
}

export function SuggestionCard({ suggestion, onAddToIdeas }: SuggestionCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToIdeas = () => {
    onAddToIdeas(suggestion);
    setIsAdded(true);
    
    // Reset the success state after 3 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
            {suggestion.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {suggestion.description}
          </p>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {suggestion.field}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isAdded ? (
          <motion.button
            key="add-button"
            onClick={handleAddToIdeas}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Add to My Ideas
          </motion.button>
        ) : (
          <motion.div
            key="success-message"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4" />
            Added to Ideas!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}