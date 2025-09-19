import React, { useState, useCallback, useEffect } from 'react';

interface ImportUrlsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (urls: string[]) => void;
}

export const ImportUrlsDialog: React.FC<ImportUrlsDialogProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [parsedUrls, setParsedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Parse URLs from pasted text
    if (pastedText) {
      const urls = pastedText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0 && (line.startsWith('http://') || line.startsWith('https://')));
      
      setParsedUrls(urls);
      if (urls.length > 0) {
        setError(null);
        // If user is pasting, clear any selected file
        if(file) setFile(null); 
      }
    } else if (!file) {
      // Clear parsed URLs if both inputs are empty
      setParsedUrls([]);
    }
  }, [pastedText, file]);


  const resetState = () => {
    setFile(null);
    setPastedText('');
    setParsedUrls([]);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const processFile = useCallback((selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Invalid file type. Please upload a .csv file.');
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    setPastedText(''); // Clear pasted text if user uploads file
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const urls = text
        .split(/\r?\n/)
        .map(line => line.split(',')[0].trim()) // Take first column, trim whitespace
        .filter(line => line.length > 0 && (line.startsWith('http://') || line.startsWith('https://')));
      
      if (urls.length === 0) {
        setError('No valid URLs found in the file. Ensure each URL is on a new line and starts with http:// or https://.');
        setParsedUrls([]);
      } else {
        setParsedUrls(urls);
      }
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
    };
    reader.readAsText(selectedFile);
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, action: 'enter' | 'leave' | 'over') => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'enter' || action === 'over') {
      setIsDragging(true);
    } else if (action === 'leave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (parsedUrls.length > 0) {
      onImport(parsedUrls);
      handleClose();
    } else {
        setError("There are no valid URLs to import.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Import URLs</h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="url-paste-area" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Paste URLs (one per line)
              </label>
              <textarea
                  id="url-paste-area"
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="https://example.com/product-a&#10;https://example.com/product-b"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or
                    </span>
                </div>
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
              onDragEnter={(e) => handleDragEvents(e, 'enter')}
              onDragLeave={(e) => handleDragEvents(e, 'leave')}
              onDragOver={(e) => handleDragEvents(e, 'over')}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                 <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Upload a CSV file</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV up to 10MB</p>
            </div>
            
            {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
            
            {(parsedUrls.length > 0 || file) && (
              <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {file ? `Found ${parsedUrls.length} URLs in ${file.name}:` : `Found ${parsedUrls.length} URLs to import:`}
                  </h4>
                  <div className="mt-2 h-32 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900/50 text-xs">
                      {parsedUrls.map((url, i) => <div key={i} className="truncate">{url}</div>)}
                  </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={parsedUrls.length === 0}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {parsedUrls.length > 0 ? parsedUrls.length : ''} URLs
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};