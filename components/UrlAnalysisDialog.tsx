import React, { useState, useEffect } from 'react';
import type { TrackedUrl, ScanResult } from '../types';

interface UrlAnalysisDialogProps {
  urlToAnalyze: TrackedUrl;
  onClose: () => void;
  onAnalyze: (url: TrackedUrl) => Promise<ScanResult>;
}

export const UrlAnalysisDialog: React.FC<UrlAnalysisDialogProps> = ({ urlToAnalyze, onClose, onAnalyze }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      const analysisResult = await onAnalyze(urlToAnalyze);
      setResult(analysisResult);
      setIsLoading(false);
    };

    performAnalysis();
  }, [urlToAnalyze, onAnalyze]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Analyzing URL</h3>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 space-y-4">
             <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
               Fetching and parsing: <a href={urlToAnalyze.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{urlToAnalyze.url}</a>
            </p>

            {isLoading && (
              <div className="flex items-center justify-center space-x-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                 <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">Server is analyzing the page...</span>
              </div>
            )}
            
            {result && !result.success && (
                <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md text-sm">
                    <strong>Error:</strong> {result.error}
                </div>
            )}
            
            {result && result.success && result.data && (
               <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/50 rounded-md border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Analysis Complete!</h4>
                  <div className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                    <p><strong>Title:</strong> {result.data.title}</p>
                    <p><strong>Price:</strong> {result.data.currency}{result.data.price}</p>
                    <p><strong>Stock:</strong> {result.data.stockState}</p>
                    <p><strong>Source:</strong> {result.data.source} (Confidence: {result.data.confidence.toFixed(2)})</p>
                  </div>
              </div>
            )}

          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
          >
            {isLoading ? 'Close' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};