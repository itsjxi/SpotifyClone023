import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMusic, FiHeart, FiClock, FiGrid, FiList } from 'react-icons/fi';
import { useSpotifyData } from '../../hooks/useSpotifyData';
import './LibraryPage.css';

const LibraryPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  const { data: playlists, loading: playlistsLoading } = useSpotifyData('userPlaylists', { limit: 50 });
  const { data: likedSongs, loading: likedLoading } = useSpotifyData('savedTracks', { limit: 1 });
  const { data: recentlyPlayed, loading: recentLoading } = useSpotifyData('recentlyPlayed', { limit: 20 });

  const loading = playlistsLoading || likedLoading || recentLoading;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' }
  ];

  const libraryItems = [
    {
      id: 'liked-songs',
      type: 'liked',
      name: 'Liked Songs',
      description: `${likedSongs?.total || 0} songs`,
      image: null,
      onClick: () => navigate('/liked')
    },
    ...(playlists || []).map(playlist => ({
      id: playlist.id,
      type: 'playlist',
      name: playlist.name,
      description: `${playlist.tracks?.total || 0} songs`,
      image: playlist.images?.[0]?.url,
      onClick: () => navigate(`/playlist/${playlist.id}`)
    }))
  ];

  const filteredItems = libraryItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'playlists') return item.type === 'playlist' || item.type === 'liked';
    return item.type === filter;
  });

  if (loading) {
    return (
      <div className="library-page">
        <div className="library-loading">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="loading-item">
              <div className="loading-image"></div>
              <div className="loading-text">
                <div className="loading-line"></div>
                <div className="loading-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      {/* Header */}
      <motion.div 
        className="library-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="library-title">Your Library</h1>
        
        <div className="library-controls">
          <div className="library-filters">
            {filters.map(filterItem => (
              <button
                key={filterItem.id}
                className={`filter-btn ${filter === filterItem.id ? 'active' : ''}`}
                onClick={() => setFilter(filterItem.id)}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
          
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className={`library-content ${viewMode}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="library-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={item.onClick}
          >
            <div className="item-image">
              {item.type === 'liked' ? (
                <div className="liked-cover">
                  <FiHeart />
                </div>
              ) : item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="placeholder-cover">
                  <FiMusic />
                </div>
              )}
            </div>
            
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
            </div>
          </motion.div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="empty-library">
            <FiMusic size={64} />
            <h3>No items found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </motion.div>

      {/* Recently Played */}
      {recentlyPlayed && recentlyPlayed.length > 0 && (
        <motion.section 
          className="recent-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="section-title">
            <FiClock />
            Recently Played
          </h2>
          
          <div className="recent-grid">
            {recentlyPlayed.slice(0, 6).map((track, index) => (
              <motion.div
                key={`${track.id}-${index}`}
                className="recent-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <img src={track.album?.images?.[0]?.url || '/placeholder.png'} alt={track.name} />
                <div className="recent-info">
                  <span className="recent-name">{track.name}</span>
                  <span className="recent-artist">{track.artists?.map(a => a.name).join(', ')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default LibraryPage;