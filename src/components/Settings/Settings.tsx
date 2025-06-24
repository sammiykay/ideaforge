import React from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExportManager } from './ExportManager';
import { APIKeyManager } from './APIKeyManager';

export function Settings() {
  const { state, dispatch } = useApp();

  const handleExportData = () => {
    const dataStr = JSON.stringify(state.ideas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ideaforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          const ideas = importedData.map(idea => ({
            ...idea,
            createdAt: new Date(idea.createdAt),
            updatedAt: new Date(idea.updatedAt),
          }));
          dispatch({ type: 'LOAD_DATA', payload: ideas });
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your ideas? This action cannot be undone.')) {
      dispatch({ type: 'LOAD_DATA', payload: [] });
      localStorage.removeItem('ideaforge-ideas');
      alert('All data cleared successfully.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your AI configuration, data, and export options</p>
      </motion.div>

      <div className="space-y-6">
        {/* API Key Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <APIKeyManager />
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 p-4 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Export Data</span>
            </button>

            <label className="flex items-center justify-center gap-2 p-4 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearData}
              className="flex items-center justify-center gap-2 p-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Clear All Data</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Your data is automatically saved to your browser's local storage. Use export/import to backup or transfer your ideas.
          </p>
        </motion.div>

        {/* Export Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExportManager ideas={state.ideas} />
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{state.ideas.length}</div>
              <div className="text-sm text-gray-600">Total Ideas</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {state.ideas.filter(idea => idea.isAIGenerated).length}
              </div>
              <div className="text-sm text-gray-600">AI Generated</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {state.ideas.filter(idea => idea.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}