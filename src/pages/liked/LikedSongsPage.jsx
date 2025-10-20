import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlay, FiHeart, FiClock } from 'react-icons/fi';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import { spotifyService } from '../../services/spotifyApi';
import toast from 'react-hot-toast';
import './LikedSongsPage.css';

const LikedSongsPage = () => {
  const dispatch = useDispatch();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      setLoading(true);
      const response = await spotifyService.getSavedTracks(50);
      setTracks(response.data.items?.map(item => item.track).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
      toast.error('Failed to load liked songs');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track, index) => {
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks, startIndex: index }));
    toast.success(`Playing: ${track.name}`);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      handlePlayTrack(tracks[0], 0);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="liked-songs-page">
        <div className="liked-loading">
          <div className="loading-header">
            <div className="loading-cover"></div>
            <div className="loading-info">
              <div className="loading-line large"></div>
              <div className="loading-line medium"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="liked-songs-page">
      {/* Header */}
      <motion.div 
        className="liked-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="liked-cover">
          <FiHeart className="heart-icon" />
        </div>
        <div className="liked-info">
          <span className="liked-type">Playlist</span>
          <h1 className="liked-title">Liked Songs</h1>
          <div className="liked-meta">
            <span className="liked-count">{tracks.length} songs</span>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="liked-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button className="btn btn-primary btn-lg play-all-btn" onClick={handlePlayAll}>
          <FiPlay />
          Play
        </button>
      </motion.div>

      {/* Track List */}
      <motion.div 
        className="liked-tracks"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="track-list">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              className="track-list-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handlePlayTrack(track, index)}
            >
              <div className="track-number">{index + 1}</div>
              <div className="track-image">
                <img src={track.album?.images?.[0]?.url || '/placeholder.png'} alt={track.name} />
                <button className="track-play-btn">
                  <FiPlay />
                </button>
              </div>
              <div className="track-details">
                <div className="track-name">{track.name}</div>
                <div className="track-artist">{track.artists?.map(a => a.name).join(', ')}</div>
              </div>
              <div className="track-album">{track.album?.name}</div>
              <div className="track-duration">
                {formatDuration(track.duration_ms)}
              </div>
            </motion.div>
          ))}
        </div>

        {tracks.length === 0 && (
          <div className="empty-liked">
            <FiHeart size={64} />
            <h3>No liked songs yet</h3>
            <p>Songs you like will appear here</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LikedSongsPage;