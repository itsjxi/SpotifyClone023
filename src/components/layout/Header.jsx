import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiSearch, FiSun, FiMoon, FiUser, FiLogOut, FiX, FiArrowLeft } from 'react-icons/fi';
import { loginWithSpotify, logoutUser } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/ui/uiSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef(null);
  const isSearchPage = location.pathname === '/search';

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSearchPage && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchPage]);

  const handleLogin = () => {
    dispatch(loginWithSpotify());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (isSearchPage) {
      navigate('/search');
    }
  };

  const handleMobileSearchClick = () => {
    setShowMobileSearch(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const closeMobileSearch = () => {
    setShowMobileSearch(false);
    setSearchQuery('');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <header className="header glass">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo" onClick={() => navigate('/home')}>
            <div className="logo-icon gradient-text">♪</div>
            <span className="logo-text gradient-text">Vibes</span>
          </div>

          {/* Search Bar - Desktop */}
          {isAuthenticated && (
            <form className="search-form desktop-search" onSubmit={handleSearch}>
              <div className={`search-container ${isSearchPage ? 'search-focused' : ''}`}>
                <FiSearch className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isSearchPage ? "What do you want to listen to?" : "Search songs, artists, albums..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={clearSearch}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Actions */}
          <div className="header-actions">
            {/* Mobile Search Button */}
            {isAuthenticated && (
              <button 
                className="btn btn-ghost icon-btn mobile-search-btn"
                onClick={handleMobileSearchClick}
                title="Search"
              >
                <FiSearch />
              </button>
            )}
            
            {/* Theme Toggle */}
            <button 
              className="btn btn-ghost icon-btn"
              onClick={handleThemeToggle}
              title={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme.mode === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <button className="btn btn-primary" onClick={handleLogin}>
                Connect Spotify
              </button>
            ) : (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user?.images?.[0]?.url ? (
                      <img src={user.images[0].url} alt="Profile" />
                    ) : (
                      <FiUser />
                    )}
                  </div>
                  <span className="user-name">{user?.displayName || 'User'}</span>
                </div>
                <button 
                  className="btn btn-ghost icon-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FiLogOut />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Search Bar */}
      {isAuthenticated && showMobileSearch && (
        <div className="mobile-search-bar">
          <div className="mobile-search-header">
            <button 
              className="mobile-search-back"
              onClick={closeMobileSearch}
            >
              <FiArrowLeft />
            </button>
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <div className={`search-container ${isSearchPage ? 'search-focused' : ''}`}>
                <FiSearch className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search songs, artists, albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={clearSearch}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;