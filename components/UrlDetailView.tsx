
import React from 'react';
import type { TrackedUrl } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UrlDetailViewProps {
  url: TrackedUrl;
  onBack: () => void;
}

const formatChartData = (history: TrackedUrl['priceHistory']) => {
  return history.map(obs => ({
    date: new Date(obs.observedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    price: obs.price,
  }));
};

export const UrlDetailView: React.FC<UrlDetailViewProps> = ({ url, onBack }) => {
  const chartData = formatChartData(url.priceHistory);

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold tracking-tight">{url.title}</h2>
        <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{url.url}</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Price</h3>
          <p className="mt-1 text-3xl font-semibold">{url.currency}{url.lastPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Status</h3>
          <p className="mt-1 text-3xl font-semibold capitalize">{url.stockState}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Seen</h3>
          <p className="mt-1 text-xl font-semibold">{new Date(url.lastSeenAt).toLocaleString('en-GB')}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium mb-4">Price History (Last 30 Days)</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${url.currency}${value}`} domain={['dataMin - 10', 'dataMax + 10']} tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)', // gray-800 with opacity
                            borderColor: 'rgba(55, 65, 81, 1)', // gray-700
                            color: '#fff',
                            borderRadius: '0.5rem'
                        }}
                        formatter={(value: number) => [`${url.currency}${value.toFixed(2)}`, 'Price']}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
