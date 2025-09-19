import React, { useState, useEffect } from 'react';
import type { TrackedUrl } from '../types';
import { StockState, TrackedUrlStatus } from '../types';

interface DashboardSummaryProps {
  trackedUrls: TrackedUrl[];
  onScanNow: () => void;
  isScanning: boolean;
  lastScanTime: Date | null;
}

const SCAN_COOLDOWN_MINUTES = 15;

const StatItem: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="flex items-baseline space-x-2 pr-6 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </div>
);

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ trackedUrls, onScanNow, isScanning, lastScanTime }) => {
  const [cooldownRemaining, setCooldownRemaining] = useState('');

  useEffect(() => {
    const updateCooldown = () => {
      if (!lastScanTime) {
        setCooldownRemaining('');
        return;
      }

      const now = new Date().getTime();
      const cooldownEnd = lastScanTime.getTime() + SCAN_COOLDOWN_MINUTES * 60 * 1000;
      const diff = cooldownEnd - now;

      if (diff > 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCooldownRemaining(`${minutes}m ${seconds}s`);
      } else {
        setCooldownRemaining('');
      }
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [lastScanTime, isScanning]);

  const totalUrls = trackedUrls.length;
  const priceDrops = trackedUrls.filter(u => u.priceChange && u.priceChange < 0).length;
  const stockIns = trackedUrls.filter(u => u.stockState === StockState.InStock).length;
  const errors = trackedUrls.filter(u => u.status === TrackedUrlStatus.Error).length;
  
  const isButtonDisabled = isScanning || !!cooldownRemaining;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-y-2">
        <StatItem label="URLs Tracked" value={totalUrls} />
        <StatItem label="Price Drops" value={priceDrops} />
        <StatItem label="In Stock" value={stockIns} />
        <StatItem label="Errors" value={errors} />
        <div className="text-sm text-gray-500 dark:text-gray-400 pl-6">
          Next scan in: <span className="font-semibold text-gray-700 dark:text-gray-200">{cooldownRemaining || 'Ready'}</span>
        </div>
      </div>
      <button 
        onClick={onScanNow}
        disabled={isButtonDisabled}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="A project-wide scan can be manually triggered every 15 minutes."
      >
        {isScanning ? (
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" />
          </svg>
        )}
        {isScanning ? 'Scanning...' : 'Scan Now'}
      </button>
    </div>
  );
};