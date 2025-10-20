import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiCompass, 
  FiHeart, 
  FiMusic, 
  FiPlus,
  FiUser
} from 'react-icons/fi';
import { useSpotifyData } from '../../hooks/useSpotifyData';
import './Sidebar.css';

const PlaylistList = () => {
  const navigate = useNavigate();
  const { data: playlists = [], loading } = useSpotifyData('userPlaylists', { limit: 10 });
  
  if (loading) {
    return (
      <ul className="nav-list playlist-list">
        {Array(3).fill(0).map((_, i) => (
          <li key={i}>
            <div className="nav-item playlist-item loading-item">
              <div className="playlist-cover loading-cover-small"></div>
              <div className="playlist-info">
                <div className="loading-line"></div>
                <div className="loading-line short"></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  
  return (
    <ul className="nav-list playlist-list">
      {(playlists || []).map((playlist) => (
        <li key={playlist.id}>
          <button 
            className="nav-item playlist-item"
            onClick={() => navigate(`/playlist/${playlist.id}`)}
          >
            <div className="playlist-cover">
              {playlist.images?.[0]?.url ? (
                <img src={playlist.images[0].url} alt={playlist.name} />
              ) : (
                <FiMusic />
              )}
            </div>
            <div className="playlist-info">
              <span className="playlist-name">{playlist.name}</span>
              <span className="playlist-count">{playlist.tracks?.total || 0} songs</span>
            </div>
          </button>
        </li>
      ))}
      {(!playlists || playlists.length === 0) && !loading && (
        <li>
          <div className="empty-playlists">
            <FiMusic />
            <span>No playlists yet</span>
          </div>
        </li>
      )}
    </ul>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    { icon: FiHome, label: 'Home', path: '/home' },
    { icon: FiCompass, label: 'Search', path: '/search' },
    { icon: FiHeart, label: 'Liked Songs', path: '/liked' },
    { icon: FiMusic, label: 'Your Library', path: '/library' },
  ];

  const bottomNavItems = [
    { icon: FiUser, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar glass">
      <nav className="sidebar-nav">
        {/* Main Navigation */}
        <div className="nav-section">
          <ul className="nav-list">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Playlists Section */}
        <div className="nav-section">
          <div className="section-header">
            <h3 className="section-title">Playlists</h3>
            <button className="btn btn-ghost icon-btn-sm" title="Create Playlist">
              <FiPlus />
            </button>
          </div>
          <PlaylistList />
        </div>

        {/* Bottom Navigation */}
        <div className="nav-section nav-bottom">
          <ul className="nav-list">
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;