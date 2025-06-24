import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Tag, Calendar, Trash2, Edit, Brain } from 'lucide-react';
import { Idea } from '../../types';
import { useApp } from '../../context/AppContext';
import { EditIdeaModal } from './EditIdeaModal';

interface IdeaCardProps {
  idea: Idea;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  Complex: 'bg-red-100 text-red-800',
};

const statusColors = {
  Exploring: 'bg-blue-100 text-blue-800',
  Reading: 'bg-purple-100 text-purple-800',
  Drafting: 'bg-orange-100 text-orange-800',
  Writing: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-green-100 text-green-800',
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const { dispatch } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      dispatch({ type: 'DELETE_IDEA', payload: idea.id });
    }
  };

  const handleStatusChange = (newStatus: Idea['status']) => {
    const updatedIdea = {
      ...idea,
      status: newStatus,
      updatedAt: new Date(),
    };
    dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {idea.title}
              </h3>
              {idea.isAIGenerated && (
                <Brain className="w-4 h-4 text-purple-500" title="AI Generated" />
              )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {idea.description}
            </p>
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= idea.interest ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[idea.difficulty]}`}>
              {idea.difficulty}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[idea.status]}`}>
              {idea.status}
            </span>
          </div>

          {idea.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {idea.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{idea.createdAt.toLocaleDateString()}</span>
          </div>
          <select
            value={idea.status}
            onChange={(e) => handleStatusChange(e.target.value as Idea['status'])}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Exploring">Exploring</option>
            <option value="Reading">Reading</option>
            <option value="Drafting">Drafting</option>
            <option value="Writing">Writing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </motion.div>

      <EditIdeaModal
        idea={idea}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}