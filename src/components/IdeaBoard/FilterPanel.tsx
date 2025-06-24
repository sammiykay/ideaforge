import React from 'react';
import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FIELDS = [
  'Computer Science', 'Engineering', 'Business', 'Education', 'Psychology',
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Economics',
  'Literature', 'History', 'Art & Design', 'Medicine', 'Environmental Science'
];

const DIFFICULTIES = ['Easy', 'Moderate', 'Complex'];
const STATUSES = ['Exploring', 'Reading', 'Drafting', 'Writing', 'Completed'];

export function FilterPanel() {
  const { state, dispatch } = useApp();

  const updateFilter = (field: string, value: any) => {
    dispatch({ type: 'SET_FILTERS', payload: { [field]: value } });
  };

  const clearFilters = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        field: '',
        difficulty: '',
        status: '',
        interest: 0,
        tags: [],
      },
    });
  };

  const hasActiveFilters = Object.values(state.filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field
          </label>
          <select
            value={state.filters.field}
            onChange={(e) => updateFilter('field', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All fields</option>
            {FIELDS.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={state.filters.difficulty}
            onChange={(e) => updateFilter('difficulty', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All difficulties</option>
            {DIFFICULTIES.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={state.filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Interest ({state.filters.interest || 'Any'})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="5"
              value={state.filters.interest}
              onChange={(e) => updateFilter('interest', parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= state.filters.interest ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}