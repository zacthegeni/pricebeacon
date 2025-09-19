
import React from 'react';
import type { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ projects, activeProjectId, onProjectChange }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Projects</h2>
        <nav className="space-y-1">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onProjectChange(project.id)}
              className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                project.id === activeProjectId
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {project.name}
            </button>
          ))}
        </nav>
      </div>
      <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Project
      </button>
    </aside>
  );
};
