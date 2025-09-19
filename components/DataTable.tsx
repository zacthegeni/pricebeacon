import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { TrackedUrl } from '../types';
import { StockState, TrackedUrlStatus } from '../types';

interface DataTableProps {
  data: TrackedUrl[];
  onRowClick: (url: TrackedUrl) => void;
  onAnalyzeUrl: (url: TrackedUrl) => void;
}

type SortKey = keyof TrackedUrl;
type SortOrder = 'asc' | 'desc';

const StockBadge: React.FC<{ state: StockState }> = ({ state }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
  switch (state) {
    case StockState.InStock:
      return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 focus:ring-green-500`}>In Stock</span>;
    case StockState.OutOfStock:
      return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 focus:ring-red-500`}>Out of Stock</span>;
    default:
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 focus:ring-yellow-500`}>Unknown</span>;
  }
};

const formatCurrency = (amount: number | undefined, currency: string) => {
    if (amount === undefined || amount === 0) return '-';
    return `${currency}${amount.toFixed(2)}`;
};

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return {
            display: date.toLocaleString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
            }).replace(',', ''),
            iso: date.toISOString(),
        };
    } catch(e) {
        return { display: "Invalid Date", iso: "" }
    }
};

export const DataTable: React.FC<DataTableProps> = ({ data, onRowClick, onAnalyzeUrl }) => {
  const [filter, setFilter] = useState('');
  const [filters, setFilters] = useState({ stock: 'all', priceChange: 'all' });
  const [sortKey, setSortKey] = useState<SortKey>('lastSeenAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [isFilterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target as Node)) {
        setFilterPopoverOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedAndFilteredData = useMemo(() => {
    let filtered = data.filter(item => 
      (item.title.toLowerCase().includes(filter.toLowerCase()) || item.url.toLowerCase().includes(filter.toLowerCase()))
      && (filters.stock === 'all' || item.stockState === filters.stock)
      && (filters.priceChange === 'all' 
          || (filters.priceChange === 'down' && item.priceChange && item.priceChange < 0)
          || (filters.priceChange === 'up' && item.priceChange && item.priceChange > 0)
      )
    );

    filtered.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === undefined || valB === undefined) return 0;
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, filter, filters, sortKey, sortOrder]);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedAndFilteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedAndFilteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / rowsPerPage);

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    setSortOrder(sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };
  
  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  };

  const SortableHeader: React.FC<{ columnKey: SortKey, children: React.ReactNode, className?: string }> = ({ columnKey, children, className }) => (
    <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer ${className}`} onClick={() => handleSort(columnKey)}>
      <div className="flex items-center">
        {children}
        {sortKey === columnKey && <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
      </div>
    </th>
  );

  return (
    <div>
      <div className="p-4 flex justify-between items-center flex-wrap gap-4">
        {selectedRows.size > 0 ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Export</button>
            <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Pause</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <input
                type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by product or URL..."
                className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <div className="relative" ref={filterPopoverRef}>
              <button onClick={() => setFilterPopoverOpen(!isFilterPopoverOpen)} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                Filters
              </button>
              {isFilterPopoverOpen && (
                <div className="absolute z-10 mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Status</label>
                      <select value={filters.stock} onChange={e => setFilters(f => ({...f, stock: e.target.value}))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900">
                        <option value="all">All</option>
                        <option value={StockState.InStock}>In Stock</option>
                        <option value={StockState.OutOfStock}>Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Change</label>
                       <select value={filters.priceChange} onChange={e => setFilters(f => ({...f, priceChange: e.target.value}))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900">
                        <option value="all">Any</option>
                        <option value="down">Price Drop</option>
                        <option value="up">Price Increase</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/80 backdrop-blur-sm sticky top-0 z-10">
                  <tr>
                      <th scope="col" className="px-6 py-3"><input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.size === paginatedData.length && paginatedData.length > 0} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-gray-900" /></th>
                      <SortableHeader columnKey="title">Product</SortableHeader>
                      <SortableHeader columnKey="lastPrice" className="text-right">Price</SortableHeader>
                      <SortableHeader columnKey="stockState">Stock Status</SortableHeader>
                      <SortableHeader columnKey="lastSeenAt">Last Seen</SortableHeader>
                      <th scope="col" className="px-6 py-3"></th>
                  </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.length === 0 && (
                     <tr><td colSpan={6} className="text-center py-12 text-gray-500">No products found matching your criteria.</td></tr>
                  )}
                  {paginatedData.map((item) => (
                      <tr key={item.id} className={`${item.status === TrackedUrlStatus.Error ? 'bg-red-50 dark:bg-red-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                          <td className="px-6 py-4"><input type="checkbox" onChange={() => toggleRowSelection(item.id)} checked={selectedRows.has(item.id)} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-gray-900" /></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <img src={item.thumbnailUrl} alt={item.title} className="w-10 h-10 rounded-md object-cover bg-gray-200 dark:bg-gray-700"/>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                  <span onClick={() => onRowClick(item)} className="truncate max-w-sm cursor-pointer">{item.title}</span>
                                  {item.parseConfidence && item.parseConfidence < 0.8 && (
                                    <span title={`Low confidence score: ${item.parseConfidence.toFixed(2)}`} className="ml-2 text-yellow-500">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l4.502 8.596c.613 1.17-.289 2.583-1.503 2.583H5.252c-1.214 0-2.116-1.413-1.503-2.583l4.508-8.596zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" /></svg>
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-sm">{item.url}</div>
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.tags.map(tag => (
                                      <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                              {item.status === TrackedUrlStatus.Pending ? (
                                <button onClick={() => onAnalyzeUrl(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-semibold">
                                  Analyze
                                </button>
                              ) : (
                                <>
                                  <div className="font-bold">{formatCurrency(item.lastPrice, item.currency)}</div>
                                  <div className="flex items-baseline justify-end">
                                      {item.wasPrice && <span className="text-gray-500 line-through text-xs">{formatCurrency(item.wasPrice, item.currency)}</span>}
                                      {item.priceChange !== undefined && item.priceChange !== 0 && (
                                        <span className={`ml-2 text-xs font-semibold flex items-center ${item.priceChange > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                                          {item.priceChange > 0 ? '▲' : '▼'} {Math.abs(item.priceChange).toFixed(2)}%
                                        </span>
                                      )}
                                  </div>
                                </>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.status === TrackedUrlStatus.Pending ? (
                              <span className="text-gray-500 text-xs">-</span>
                            ) : (
                              <StockBadge state={item.stockState} />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" title={formatDate(item.lastSeenAt).iso}>{formatDate(item.lastSeenAt).display}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                            <div ref={activeActionMenu === item.id ? actionMenuRef : null}>
                            {item.status === TrackedUrlStatus.Error ? (
                                <span title="Failed to fetch data" className="text-red-500 font-semibold text-xs">ERROR</span>
                            ) : item.status === TrackedUrlStatus.Pending ? (
                               <span className="text-gray-400 font-semibold text-xs italic">PENDING</span>
                            ) : (
                              <>
                                <button onClick={() => setActiveActionMenu(activeActionMenu === item.id ? null : item.id)} className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                </button>
                                {activeActionMenu === item.id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Open Page</a>
                                    <button onClick={() => { onRowClick(item); setActiveActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">View History</button>
                                    <button onClick={() => { onAnalyzeUrl(item); setActiveActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Re-scan Now</button>
                                    <button onClick={() => { alert('Editing selectors...'); setActiveActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Selectors</button>
                                    <button onClick={() => { alert('Adding tag...'); setActiveActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add Tag</button>
                                    <button onClick={() => { alert('Pausing URL...'); setActiveActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Pause URL</button>
                                  </div>
                                )}
                              </>
                            )}
                            </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
           <span className="text-sm text-gray-700 dark:text-gray-400">
              Showing {sortedAndFilteredData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, sortedAndFilteredData.length)} of {sortedAndFilteredData.length} results
          </span>
          <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              <span className="text-sm text-gray-700 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
      </div>
    </div>
  );
};
