import React, { Suspense, lazy, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import { checkAuthStatus } from './features/auth/authSlice';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DraggablePlayer from './components/player/DraggablePlayer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/globals.css';
import './App.css';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const SpotifyCallback = lazy(() => import('./pages/SpotifyCallback'));
const HomePage = lazy(() => import('./pages/home/HomePage'));
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const PlaylistPage = lazy(() => import('./pages/playlist/PlaylistPage'));
const LikedSongsPage = lazy(() => import('./pages/liked/LikedSongsPage'));
const DiscoverPage = lazy(() => import('./pages/discover/DiscoverPage'));
const LibraryPage = lazy(() => import('./pages/library/LibraryPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.ui);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.mode);
    document.documentElement.setAttribute('data-accent', theme.accent);
  }, [theme]);
  
  return children;
}

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  if (!isInitialized) {
    return (
      <div className="app">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Header />}
        
        <div className="app-layout">
          {isAuthenticated && <Sidebar />}
          
          <main className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/callback" element={<SpotifyCallback />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } />
                <Route path="/discover" element={
                  <ProtectedRoute>
                    <DiscoverPage />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
                <Route path="/playlist/:id" element={
                  <ProtectedRoute>
                    <PlaylistPage />
                  </ProtectedRoute>
                } />
                <Route path="/liked" element={
                  <ProtectedRoute>
                    <LikedSongsPage />
                  </ProtectedRoute>
                } />
                <Route path="/library" element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
        
        {isAuthenticated && <DraggablePlayer />}
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
            },
            success: {
              iconTheme: {
                primary: '#667eea',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;