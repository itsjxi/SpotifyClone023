import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaSpotify } from 'react-icons/fa';
import { loginWithSpotify, checkAuthStatus, handleSpotifyCallback } from '../features/auth/authSlice';
import { setCurrentTrack, setQueue } from '../features/player/playerSlice';
import toast from 'react-hot-toast';
import './Landing.css';

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if there's a token in the URL hash (from Spotify redirect)
    const hash = window.location.hash;
    console.log('Landing page - checking hash:', hash);
    
    if (hash && hash.includes('access_token')) {
      console.log('Token found in hash, processing callback...');
      dispatch(handleSpotifyCallback());
    } else {
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      navigate('/home');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  const handleSpotifyLogin = () => {
    dispatch(loginWithSpotify());
  };

  const sampleTracks = [
    {
      id: '1',
      name: 'Blinding Lights',
      artists: [{ name: 'The Weeknd' }],
      album: { images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c1b4d87c6f8d8b' }] },
      preview_url: 'https://p.scdn.co/mp3-preview/sample1.mp3'
    },
    {
      id: '2', 
      name: 'Shape of You',
      artists: [{ name: 'Ed Sheeran' }],
      album: { images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96' }] },
      preview_url: 'https://p.scdn.co/mp3-preview/sample2.mp3'
    },
    {
      id: '3',
      name: 'Bad Guy', 
      artists: [{ name: 'Billie Eilish' }],
      album: { images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273a8248b8c8aa0b06ac5ce15de' }] },
      preview_url: 'https://p.scdn.co/mp3-preview/sample3.mp3'
    }
  ];

  const handlePlaySong = (song) => {
    dispatch(setQueue(sampleTracks));
    dispatch(setCurrentTrack(song));
    toast.success(`Playing: ${song.name}`);
  };

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <motion.header 
        className="landing-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="landing-logo gradient-text">
          ♪ Vibes
        </h1>
        <motion.button
          onClick={handleSpotifyLogin}
          disabled={isLoading}
          className="btn btn-primary"
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          <FaSpotify size={20} />
          {isLoading ? 'Connecting...' : 'Connect with Spotify'}
        </motion.button>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="landing-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="hero-title gradient-text">
          Music for everyone
        </h2>
        <p className="hero-description">
          Connect your Spotify account to access millions of songs, playlists, and personalized recommendations.
        </p>
        <motion.button
          onClick={handleSpotifyLogin}
          disabled={isLoading}
          className="btn btn-primary hero-cta"
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          <FaSpotify size={24} />
          {isLoading ? 'Connecting to Spotify...' : 'Get Started with Spotify'}
        </motion.button>
      </motion.section>

      {/* Popular Tracks Preview */}
      <motion.section
        className="landing-tracks"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="tracks-title">
          Popular right now
        </h3>
        <div className="tracks-grid">
          {sampleTracks.map((song, index) => (
            <motion.div
              key={song.id}
              className="track-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ 
                y: -8,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div className="track-cover">
                <img
                  src={song.album.images[0].url}
                  alt={song.name}
                />
                <motion.button
                  onClick={() => handlePlaySong(song)}
                  className="play-overlay"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay size={20} style={{ marginLeft: '2px' }} />
                </motion.button>
              </div>
              <div className="track-info">
                <h4 className="track-title">{song.name}</h4>
                <p className="track-artist">{song.artists[0].name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>


    </div>
  );
};

export default Landing;