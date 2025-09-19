
import React, { useState, useEffect, useRef } from 'react';
import type { Project, User } from '../types';

interface HeaderProps {
  user: User | null;
  activeProject: Project;
  projects: Project[];
  onProjectChange: (projectId: string) => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, activeProject, projects, onProjectChange, onSignOut }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0122 12c0 3.771-2.583 6.94-6.068 7.729A8.01 8.01 0 0117.657 18.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z" />
              </svg>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">PriceBeacon</h1>
            </div>
            <span className="text-gray-300 dark:text-gray-600">/</span>
             <select
              value={activeProject.id}
              onChange={(e) => onProjectChange(e.target.value)}
              className="font-semibold bg-transparent border-0 rounded-md focus:ring-2 focus:ring-indigo-500 py-1 text-gray-900 dark:text-gray-100"
              aria-label="Switch project"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id} className="font-normal bg-white dark:bg-gray-800">{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
             <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {user?.initial}
              </button>
              {isUserMenuOpen && (
                 <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-30">
                   <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Account Settings</a>
                      <button 
                        onClick={onSignOut} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Sign Out
                      </button>
                   </div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
