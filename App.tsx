
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { UrlDetailView } from './components/UrlDetailView';
import { SignInPage } from './components/SignInPage';
import type { Project, TrackedUrl, User } from './types';
import { StockState, TrackedUrlStatus } from './types';
import { UrlAnalysisDialog } from './components/UrlAnalysisDialog';
import type { ScanResult } from './types';

const API_BASE_URL = ''; // Now using relative paths for API calls

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [trackedUrls, setTrackedUrls] = useState<TrackedUrl[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<TrackedUrl | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isUrlsLoading, setIsUrlsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const [urlToAnalyze, setUrlToAnalyze] = useState<TrackedUrl | null>(null);

  const isAuthenticated = !!user;

  // Fetch projects on initial auth
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProjects = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/projects`);
          const data: Project[] = await response.json();
          setProjects(data);
          if (data.length > 0) {
            setActiveProject(data[0]);
          } else {
            // No projects, so initial load is complete.
            setIsAppLoading(false);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
          setIsAppLoading(false);
        }
      };
      fetchProjects();
    }
  }, [isAuthenticated]);


  // Fetch URLs when active project changes
  useEffect(() => {
    if (isAuthenticated && activeProject) {
      setIsUrlsLoading(true);
      const fetchUrls = async () => {
         try {
           const response = await fetch(`${API_BASE_URL}/api/projects/${activeProject.id}/urls`);
           const data: TrackedUrl[] = await response.json();
           setTrackedUrls(data);
         } catch (error) {
           console.error(`Failed to fetch URLs for project ${activeProject.id}:`, error);
         } finally {
           setIsUrlsLoading(false);
           // If the initial app load was in progress, it's now finished.
           if (isAppLoading) {
             setIsAppLoading(false);
           }
         }
      };
      fetchUrls();
    }
  }, [activeProject, isAuthenticated]);

  const handleSignIn = () => {
    // In a real app, this would involve a proper auth flow.
    // For now, we fetch data right after setting the user.
    setUser({ name: 'Alex', email: 'alex@example.com', initial: 'A' });
  };

  const handleSignOut = () => {
    setUser(null);
    setSelectedUrl(null);
    setLastScanTime(null);
    setProjects([]);
    setActiveProject(null);
    setTrackedUrls([]);
  };

  const handleProjectChange = (projectId: string) => {
    const newProject = projects.find(p => p.id === projectId);
    if (newProject && newProject.id !== activeProject?.id) {
      setActiveProject(newProject);
      setSelectedUrl(null); 
    }
  };

  const handleSelectUrl = (url: TrackedUrl) => {
    setSelectedUrl(url);
  };
  
  const handleBackToDashboard = () => {
    setSelectedUrl(null);
  };

  const handleImportUrls = async (urls: string[]) => {
    if (!activeProject) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, projectId: activeProject.id }),
      });
      const newTrackedUrls: TrackedUrl[] = await response.json();
      setTrackedUrls(prevUrls => [...newTrackedUrls, ...prevUrls]);
    } catch (error) {
      console.error("Failed to import URLs:", error);
    }
  };

  const handleScanNow = () => {
    const SCAN_COOLDOWN_MINUTES = 15;
    if (isScanning || (lastScanTime && (new Date().getTime() - lastScanTime.getTime()) < SCAN_COOLDOWN_MINUTES * 60 * 1000)) {
        return;
    }
    setIsScanning(true);
    setLastScanTime(new Date());
    setTimeout(() => {
        setTrackedUrls(prevUrls => 
            prevUrls.map(url => ({ ...url, lastSeenAt: new Date().toISOString() }))
        );
        setIsScanning(false);
    }, 3000);
  };

  const handleUrlAnalysis = async (urlToScan: TrackedUrl): Promise<ScanResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scan-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urlId: urlToScan.id, url: urlToScan.url }), // Pass full URL to backend
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `Request failed with status ${response.status}`);
      }
      
      const result: ScanResult = await response.json();

      if (result.success && result.data) {
          const { title, price, currency, stockState, imageUrl, confidence } = result.data;
          
          setTrackedUrls(currentUrls =>
              currentUrls.map(u => 
                  u.id === urlToScan.id 
                      ? {
                          ...u,
                          title,
                          lastPrice: price,
                          currency,
                          stockState,
                          thumbnailUrl: imageUrl,
                          parseConfidence: confidence,
                          status: TrackedUrlStatus.Ok,
                          lastSeenAt: new Date().toISOString(),
                        }
                      : u
              )
          );
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown network error occurred.";
      return { success: false, error: errorMessage };
    }
  };


  if (!isAuthenticated) {
    return <SignInPage onSignIn={handleSignIn} />;
  }
  
  if (isAppLoading) {
      return (
          <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
      );
  }

  if (!activeProject) {
      return (
          <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No Projects Found</h2>
              <p className="text-gray-500">Create your first project to start tracking.</p>
            </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header 
        user={user}
        activeProject={activeProject}
        projects={projects}
        onProjectChange={handleProjectChange}
        onSignOut={handleSignOut}
      />
      <div className="flex" style={{ height: 'calc(100vh - 4rem)'}}>
        <Sidebar 
          projects={projects} 
          activeProjectId={activeProject.id}
          onProjectChange={handleProjectChange}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {selectedUrl ? (
            <UrlDetailView url={selectedUrl} onBack={handleBackToDashboard} />
          ) : (
            <Dashboard 
              trackedUrls={trackedUrls} 
              onSelectUrl={handleSelectUrl} 
              isLoading={isUrlsLoading}
              onImportUrls={handleImportUrls}
              onScanNow={handleScanNow}
              isScanning={isScanning}
              lastScanTime={lastScanTime}
              onAnalyzeUrl={(url) => setUrlToAnalyze(url)}
            />
          )}
        </main>
      </div>

      {urlToAnalyze && (
          <UrlAnalysisDialog
              urlToAnalyze={urlToAnalyze}
              onClose={() => setUrlToAnalyze(null)}
              onAnalyze={handleUrlAnalysis}
          />
      )}
    </div>
  );
};

export default App;