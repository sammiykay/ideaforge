import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export function APIKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
      geminiService.initialize(storedKey);
      setIsConfigured(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim());
      geminiService.initialize(apiKey.trim());
      setIsConfigured(true);
      testConnection();
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setIsConfigured(false);
    setTestResult(null);
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      await geminiService.generateResearchTopics('Computer Science', 'test connection');
      setTestResult('success');
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Key className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gemini AI Configuration</h2>
          <p className="text-sm text-gray-600">Configure your Google Gemini API key for AI-powered topic generation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Gemini API Key
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        {isConfigured && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">API Key Configured</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={testConnection}
                disabled={isTesting}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={handleRemoveKey}
                className="px-3 py-1 text-sm text-green-600 bg-white border border-green-300 rounded hover:bg-green-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {testResult === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Connection successful! AI topic generation is ready.</span>
          </motion.div>
        )}

        {testResult === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200"
          >
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">Connection failed. Please check your API key.</span>
          </motion.div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Google AI Studio</a></p>
          <p>• Your API key is stored locally in your browser and never shared</p>
          <p>• Using model: gemini-2.0-flash-exp for optimal research topic generation</p>
        </div>
      </div>
    </div>
  );
}