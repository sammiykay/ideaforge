import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface TopicGeneratorFormProps {
  onGenerate: (field: string, interestArea?: string) => void;
  isLoading: boolean;
}

const FIELDS = [
  'Computer Science',
  'Engineering',
  'Business',
  'Education',
  'Psychology',
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Economics',
  'Literature',
  'History',
  'Art & Design',
  'Medicine',
  'Environmental Science',
];

export function TopicGeneratorForm({ onGenerate, isLoading }: TopicGeneratorFormProps) {
  const [field, setField] = useState('');
  const [interestArea, setInterestArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (field) {
      onGenerate(field, interestArea || undefined);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="field" className="block text-sm font-medium text-gray-700">
            Field of Study <span className="text-red-500">*</span>
          </label>
          <select
            id="field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select your field...</option>
            {FIELDS.map((fieldOption) => (
              <option key={fieldOption} value={fieldOption}>
                {fieldOption}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700">
            Interest Area <span className="text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="interest"
              type="text"
              value={interestArea}
              onChange={(e) => setInterestArea(e.target.value)}
              placeholder="e.g., machine learning, climate change..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <motion.button
          type="submit"
          disabled={!field || isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? 'Generating Ideas...' : 'Generate Research Topics'}
        </motion.button>
      </div>
    </motion.form>
  );
}