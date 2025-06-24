import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AITopicSuggestion, Idea } from '../../types';
import { TopicGeneratorForm } from './TopicGeneratorForm';
import { SuggestionCard } from './SuggestionCard';
import { geminiService } from '../../services/geminiService';

const SAMPLE_SUGGESTIONS: AITopicSuggestion[] = [
  {
    title: "Blockchain-based Academic Credential Verification System",
    description: "Develop a decentralized system for verifying academic credentials using blockchain technology.",
    field: "Computer Science"
  },
  {
    title: "AI-Powered Personalized Learning Pathways",
    description: "Create an adaptive learning system that customizes educational content based on individual learning patterns.",
    field: "Education Technology"
  },
  {
    title: "Sustainable Urban Transportation Network Optimization",
    description: "Design algorithms to optimize public transportation routes for reduced carbon footprint.",
    field: "Urban Planning"
  },
  {
    title: "Mental Health Chatbot for College Students",
    description: "Build an AI-powered mental health support system specifically designed for university environments.",
    field: "Psychology"
  }
];

export function AITopicGenerator() {
  const { state, dispatch } = useApp();
  const [suggestions, setSuggestions] = useState<AITopicSuggestion[]>(SAMPLE_SUGGESTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTopics = async (field: string, interestArea?: string) => {
    if (!geminiService.isInitialized()) {
      setError('Please configure your Gemini API key in Settings first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const newSuggestions = await geminiService.generateResearchTopics(field, interestArea);
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Error generating topics:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate topics. Please try again.');
      // Keep existing suggestions on error
    } finally {
      setIsGenerating(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleAddToIdeas = (suggestion: AITopicSuggestion) => {
    const newIdea: Idea = {
      id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: suggestion.title,
      description: suggestion.description,
      tags: [suggestion.field],
      difficulty: 'Moderate',
      interest: 4,
      field: suggestion.field,
      status: 'Exploring',
      createdAt: new Date(),
      updatedAt: new Date(),
      isAIGenerated: true,
    };

    dispatch({ type: 'ADD_IDEA', payload: newIdea });
  };

  const navigateToSettings = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'settings' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Research Ideas</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Research Topics</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized research suggestions powered by Google Gemini AI based on your field of study and interests.
          </p>
        </motion.div>

        {!geminiService.isInitialized() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-800">
                  Configure your Gemini API key to enable AI-powered topic generation.
                </p>
              </div>
              <button
                onClick={navigateToSettings}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </motion.div>
        )}

        <TopicGeneratorForm onGenerate={handleGenerateTopics} isLoading={isGenerating} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {geminiService.isInitialized() ? 'AI-Generated Topics' : 'Sample Topics'}
          </h2>
          {geminiService.isInitialized() && (
            <button
              onClick={() => handleGenerateTopics('General', 'diverse topics')}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Refine Suggestions
            </button>
          )}
        </div>

        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2"
        >
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={`${suggestion.title}-${index}`}
              suggestion={suggestion}
              onAddToIdeas={handleAddToIdeas}
            />
          ))}
        </motion.div>

        {!geminiService.isInitialized() && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              These are sample topics. Configure your Gemini API key to generate personalized research ideas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}