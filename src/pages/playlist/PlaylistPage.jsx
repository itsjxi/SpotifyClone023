import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiHeart, FiClock, FiMoreHorizontal } from 'react-icons/fi';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import { spotifyService } from '../../services/spotifyApi';
import toast from 'react-hot-toast';
import './PlaylistPage.css';

const PlaylistPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylistData();
  }, [id]);

  const fetchPlaylistData = async () => {
    try {
      setLoading(true);
      const [playlistResponse, tracksResponse] = await Promise.all([
        spotifyService.getPlaylist(id),
        spotifyService.getPlaylistTracks(id)
      ]);
      
      setPlaylist(playlistResponse.data);
      setTracks(tracksResponse.data.items?.map(item => item.track).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to load playlist');
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
      <div className="playlist-page">
        <div className="playlist-loading">
          <div className="loading-header">
            <div className="loading-cover"></div>
            <div className="loading-info">
              <div className="loading-line large"></div>
              <div className="loading-line medium"></div>
              <div className="loading-line small"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-page">
        <div className="playlist-error">
          <h2>Playlist not found</h2>
          <p>The playlist you're looking for doesn't exist or is not accessible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-page">
      {/* Playlist Header */}
      <motion.div 
        className="playlist-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="playlist-cover">
          <img 
            src={playlist.images?.[0]?.url || '/placeholder.png'} 
            alt={playlist.name}
          />
        </div>
        <div className="playlist-info">
          <span className="playlist-type">Playlist</span>
          <h1 className="playlist-title">{playlist.name}</h1>
          {playlist.description && (
            <p className="playlist-description">{playlist.description}</p>
          )}
          <div className="playlist-meta">
            <span className="playlist-owner">{playlist.owner?.display_name}</span>
            <span className="playlist-separator">•</span>
            <span className="playlist-count">{tracks.length} songs</span>
          </div>
        </div>
      </motion.div>

      {/* Playlist Controls */}
      <motion.div 
        className="playlist-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button className="btn btn-primary btn-lg play-all-btn" onClick={handlePlayAll}>
          <FiPlay />
          Play
        </button>
        <button className="btn btn-ghost icon-btn">
          <FiHeart />
        </button>
        <button className="btn btn-ghost icon-btn">
          <FiMoreHorizontal />
        </button>
      </motion.div>

      {/* Track List */}
      <motion.div 
        className="playlist-tracks"
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
          <div className="empty-playlist">
            <h3>This playlist is empty</h3>
            <p>Add some songs to get started</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PlaylistPage;