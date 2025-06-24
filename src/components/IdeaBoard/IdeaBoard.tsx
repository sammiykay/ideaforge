import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IdeaCard } from './IdeaCard';
import { AddIdeaModal } from './AddIdeaModal';
import { FilterPanel } from './FilterPanel';

export function IdeaBoard() {
  const { state } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIdeas = state.ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesField = !state.filters.field || idea.field === state.filters.field;
    const matchesDifficulty = !state.filters.difficulty || idea.difficulty === state.filters.difficulty;
    const matchesStatus = !state.filters.status || idea.status === state.filters.status;
    const matchesInterest = !state.filters.interest || idea.interest >= state.filters.interest;
    const matchesTags = state.filters.tags.length === 0 || 
                       state.filters.tags.some(tag => idea.tags.includes(tag));

    return matchesSearch && matchesField && matchesDifficulty && matchesStatus && matchesInterest && matchesTags;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Research Ideas</h1>
            <p className="text-gray-600">Organize and track your research topics</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Add Idea
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-gray-100 border-gray-400' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <FilterPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </AnimatePresence>
      </div>

      {filteredIdeas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-4">
            {state.ideas.length === 0 
              ? "Start by adding your first research idea or generate some with AI"
              : "Try adjusting your search or filters"
            }
          </p>
          {state.ideas.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Idea
            </button>
          )}
        </motion.div>
      )}

      <AddIdeaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}