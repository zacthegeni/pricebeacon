import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { ImportUrlsDialog } from './ImportUrlsDialog';
import { DashboardSummary } from './DashboardSummary';
import type { TrackedUrl } from '../types';
import { DataTableSkeleton } from './DataTableSkeleton';

interface DashboardProps {
  trackedUrls: TrackedUrl[];
  onSelectUrl: (url: TrackedUrl) => void;
  isLoading: boolean;
  onImportUrls: (urls: string[]) => void;
  onScanNow: () => void;
  isScanning: boolean;
  lastScanTime: Date | null;
  onAnalyzeUrl: (url: TrackedUrl) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  trackedUrls, 
  onSelectUrl, 
  isLoading, 
  onImportUrls,
  onScanNow,
  isScanning,
  lastScanTime,
  onAnalyzeUrl,
}) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <DashboardSummary 
        trackedUrls={trackedUrls} 
        onScanNow={onScanNow}
        isScanning={isScanning}
        lastScanTime={lastScanTime}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold">Tracked Products</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">All monitored competitor products for this project.</p>
            </div>
            <div className="flex items-center space-x-2">
               <button 
                onClick={() => setIsImportDialogOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import URLs
               </button>
            </div>
        </div>

        {isLoading ? (
          <DataTableSkeleton />
        ) : (
          <DataTable data={trackedUrls} onRowClick={onSelectUrl} onAnalyzeUrl={onAnalyzeUrl} />
        )}
      </div>
      
      <ImportUrlsDialog isOpen={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)} onImport={onImportUrls} />
    </div>
  );
};
