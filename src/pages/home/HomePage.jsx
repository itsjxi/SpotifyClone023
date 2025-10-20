import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiHeart, FiClock, FiTrendingUp } from 'react-icons/fi';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import { useSpotifyData } from '../../hooks/useSpotifyData';
import TrackPreviewNotice from '../../components/ui/TrackPreviewNotice';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);
  
  const { data: recentlyPlayed, loading: recentLoading } = useSpotifyData('recentlyPlayed', { limit: 10 });
  const { data: topPlaylists, loading: playlistsLoading } = useSpotifyData('userPlaylists', { limit: 6 });
  const { data: topTracks, loading: tracksLoading } = useSpotifyData('topTracks', { timeRange: 'short_term', limit: 6 });
  
  const loading = recentLoading || playlistsLoading || tracksLoading;

  const handlePlayTrack = (track, queue = []) => {
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ 
      tracks: queue.length > 0 ? queue : [track], 
      startIndex: queue.findIndex(t => t.id === track.id) || 0 
    }));
    toast.success(`Playing: ${track.name}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <h1 className="hero-title gradient-text">
            {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Music Lover'}
          </h1>
          <p className="hero-subtitle">
            Ready to discover your next favorite song?
          </p>
        </div>
        
        <div className="quick-picks">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="quick-pick-card glass loading-card">
                <div className="loading-cover"></div>
                <div className="loading-line"></div>
              </div>
            ))
          ) : ((topTracks || []).length > 0 ? (topTracks || []) : (recentlyPlayed || [])).slice(0, 6).map((track, index) => (
            <motion.div
              key={track.id}
              className="quick-pick-card glass"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handlePlayTrack(track, (topTracks || []).length > 0 ? (topTracks || []) : (recentlyPlayed || []))}
            >
              <div className="quick-pick-cover">
                <img src={track.album?.images?.[0]?.url || '/placeholder.png'} alt={track.name} />
              </div>
              <span className="quick-pick-name">{track.name}</span>
              <button className="quick-pick-play">
                <FiPlay />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <FiClock className="section-icon" />
            Recently Played
          </h2>
          <button className="btn btn-ghost">Show all</button>
        </div>
        
        <div className="track-grid">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="track-card card loading-card">
                <div className="loading-cover"></div>
                <div className="loading-info">
                  <div className="loading-line"></div>
                  <div className="loading-line short"></div>
                </div>
              </div>
            ))
          ) : (recentlyPlayed || []).map((track, index) => (
            <motion.div
              key={track.id}
              className="track-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handlePlayTrack(track, recentlyPlayed || [])}
            >
              <div className="track-cover">
                <img src={track.album?.images?.[0]?.url || '/placeholder.png'} alt={track.name} />
                <button className="play-overlay">
                  <FiPlay />
                </button>
              </div>
              <div className="track-info">
                <h3 className="track-title">{track.name}</h3>
                <p className="track-artist">
                  {track.artists?.map(artist => artist.name).join(', ')}
                </p>
                <p className="track-album">{track.album?.name}</p>
              </div>
            </motion.div>
          ))}
          {!loading && (!recentlyPlayed || recentlyPlayed.length === 0) && (
            <div className="empty-state">
              <FiClock size={48} />
              <p>No recently played tracks</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Top Playlists */}
      <motion.section 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <FiTrendingUp className="section-icon" />
            Popular Playlists
          </h2>
          <button className="btn btn-ghost">Show all</button>
        </div>
        
        <div className="playlist-grid">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="main-playlist-card loading-card">
                <div className="loading-cover"></div>
                <div className="loading-info">
                  <div className="loading-line"></div>
                  <div className="loading-line short"></div>
                </div>
              </div>
            ))
          ) : (topPlaylists || []).map((playlist, index) => (
            <motion.div
              key={playlist.id}
              className="main-playlist-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              <div className="main-playlist-cover">
                <img src={playlist.images?.[0]?.url || '/placeholder.png'} alt={playlist.name} />
                <button className="play-overlay">
                  <FiPlay />
                </button>
              </div>
              <div className="main-playlist-info">
                <h3 className="main-playlist-title">{playlist.name}</h3>
                <p className="main-playlist-description">{playlist.description}</p>
                <span className="main-playlist-count">{playlist.tracks?.total || 0} songs</span>
              </div>
            </motion.div>
          ))}
          {!loading && (!topPlaylists || topPlaylists.length === 0) && (
            <div className="empty-state">
              <FiTrendingUp size={48} />
              <p>No playlists available</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Made For You */}
      <motion.section 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <FiHeart className="section-icon" />
            Made For You
          </h2>
        </div>
        
        <div className="made-for-you-grid">
          <div className="made-for-you-card card gradient-bg">
            <div className="made-for-you-content">
              <h3>Liked Songs</h3>
              <p>Your favorite tracks all in one place</p>
              <button className="btn btn-primary">
                <FiHeart />
                Open
              </button>
            </div>
          </div>
          
          <div className="made-for-you-card card gradient-bg-secondary">
            <div className="made-for-you-content">
              <h3>Discover Weekly</h3>
              <p>Fresh music picked just for you</p>
              <button className="btn btn-primary">
                <FiPlay />
                Play
              </button>
            </div>
          </div>
        </div>
      </motion.section>
      
      <TrackPreviewNotice 
        show={showPreviewNotice} 
        onClose={() => setShowPreviewNotice(false)} 
      />
    </div>
  );
};

export default HomePage;