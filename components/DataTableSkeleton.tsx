import React from 'react';

export const DataTableSkeleton: React.FC = () => {
    return (
        <div className="overflow-x-auto">
            <div className="p-4 flex justify-between items-center">
                 <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                 <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="w-12 px-6 py-3"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Seen</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 animate-pulse">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                                    <div>
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                        <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto mb-2"></div>
                                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
             <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
            </div>
        </div>
    );
};
