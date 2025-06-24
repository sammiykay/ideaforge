import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { Idea } from '../../types';
import html2pdf from 'html2pdf.js';

interface ExportManagerProps {
  ideas: Idea[];
}

export function ExportManager({ ideas }: ExportManagerProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'html'>('pdf');

  const exportToPDF = async () => {
    if (ideas.length === 0) {
      alert('No ideas to export');
      return;
    }

    setIsExporting(true);

    // Create a temporary element with the content to export
    const element = document.createElement('div');
    element.innerHTML = generateExportHTML();
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.lineHeight = '1.6';

    // Configure html2pdf options
    const opt = {
      margin: 1,
      filename: `ideaforge-ideas-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting to PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToHTML = () => {
    if (ideas.length === 0) {
      alert('No ideas to export');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>IdeaForge - Research Ideas</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 30px; }
          .idea { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .meta { color: #6b7280; font-size: 14px; margin-top: 10px; }
          .tags { margin-top: 10px; }
          .tag { background: #e5e7eb; padding: 4px 8px; border-radius: 4px; margin-right: 8px; font-size: 12px; }
          .status { font-weight: bold; }
          .completed { color: #059669; }
          .in-progress { color: #d97706; }
          .exploring { color: #2563eb; }
        </style>
      </head>
      <body>
        ${generateExportHTML()}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ideaforge-ideas-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExportHTML = () => {
    const groupedIdeas = ideas.reduce((acc, idea) => {
      if (!acc[idea.status]) {
        acc[idea.status] = [];
      }
      acc[idea.status].push(idea);
      return acc;
    }, {} as Record<string, Idea[]>);

    let html = `
      <h1>IdeaForge - Research Ideas Export</h1>
      <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Total Ideas:</strong> ${ideas.length}</p>
    `;

    Object.entries(groupedIdeas).forEach(([status, statusIdeas]) => {
      html += `
        <h2>${status} (${statusIdeas.length})</h2>
      `;

      statusIdeas.forEach(idea => {
        const stars = '★'.repeat(idea.interest) + '☆'.repeat(5 - idea.interest);
        html += `
          <div class="idea">
            <h3>${idea.title}</h3>
            <p>${idea.description}</p>
            <div class="meta">
              <p><strong>Field:</strong> ${idea.field}</p>
              <p><strong>Difficulty:</strong> ${idea.difficulty}</p>
              <p><strong>Interest:</strong> ${stars} (${idea.interest}/5)</p>
              <p><strong>Status:</strong> <span class="status ${idea.status.toLowerCase()}">${idea.status}</span></p>
              <p><strong>Created:</strong> ${idea.createdAt.toLocaleDateString()}</p>
              ${idea.notes ? `<p><strong>Notes:</strong> ${idea.notes}</p>` : ''}
            </div>
            ${idea.tags.length > 0 ? `
              <div class="tags">
                <strong>Tags:</strong> 
                ${idea.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `;
      });
    });

    return html;
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF();
    } else {
      exportToHTML();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Ideas</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={(e) => setExportFormat(e.target.value as 'pdf')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">PDF Document</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="html"
                checked={exportFormat === 'html'}
                onChange={(e) => setExportFormat(e.target.value as 'html')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">HTML Page</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">
                Export {ideas.length} idea{ideas.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600">
                Generate a {exportFormat.toUpperCase()} file with all your research ideas
              </p>
            </div>
          </div>
          <motion.button
            onClick={handleExport}
            disabled={isExporting || ideas.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </motion.button>
        </div>

        {ideas.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No ideas to export. Add some research ideas first.
          </p>
        )}
      </div>
    </div>
  );
}