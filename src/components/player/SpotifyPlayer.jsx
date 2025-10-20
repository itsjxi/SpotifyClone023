import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
  FaHeart,
  FaRegHeart,
  FaExpand,
} from 'react-icons/fa';
import {
  togglePlay,
  nextTrack,
  previousTrack,
  setCurrentTime,
  setDuration,
  toggleShuffle,
  toggleRepeat,
  setVolume,
  toggleMute,
  seekTo,
} from '../../features/player/playerSlice';
import './SpotifyPlayer.css';

const SpotifyPlayer = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
  } = useSelector((state) => state.player);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.preview_url) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        dispatch(setCurrentTime(audio.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration || 30));
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch(nextTrack());
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch, currentTrack, repeat, isDragging]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.preview_url) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Seek control
  useEffect(() => {
    if (audioRef.current && !isDragging) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime, isDragging]);

  const handlePlayPause = () => {
    dispatch(togglePlay());
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    dispatch(seekTo(newTime));
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    dispatch(setVolume(percent));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    if (repeat === 'one') return <><FaRedo /><span className="repeat-one">1</span></>;
    return <FaRedo />;
  };

  if (!currentTrack) return null;

  return (
    <motion.div 
      className="spotify-player"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <audio
        ref={audioRef}
        src={currentTrack.preview_url}
        preload="metadata"
      />

      {/* Left Section - Track Info */}
      <div className="player-left">
        <div className="track-info">
          <img
            src={currentTrack.album?.images?.[0]?.url || '/placeholder-album.png'}
            alt={currentTrack.name}
            className="track-image"
          />
          <div className="track-details">
            <div className="track-name">{currentTrack.name}</div>
            <div className="track-artist">
              {currentTrack.artists?.map(artist => artist.name).join(', ')}
            </div>
          </div>
        </div>
        
        <motion.button
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => setIsLiked(!isLiked)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </motion.button>
      </div>

      {/* Center Section - Player Controls */}
      <div className="player-center">
        <div className="player-controls">
          <motion.button
            className={`control-btn ${shuffle ? 'active' : ''}`}
            onClick={() => dispatch(toggleShuffle())}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaRandom />
          </motion.button>

          <motion.button
            className="control-btn"
            onClick={() => dispatch(previousTrack())}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaStepBackward />
          </motion.button>

          <motion.button
            className="play-btn"
            onClick={handlePlayPause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </motion.button>

          <motion.button
            className="control-btn"
            onClick={() => dispatch(nextTrack())}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaStepForward />
          </motion.button>

          <motion.button
            className={`control-btn ${repeat !== 'off' ? 'active' : ''}`}
            onClick={() => dispatch(toggleRepeat())}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {getRepeatIcon()}
          </motion.button>
        </div>

        <div className="progress-section">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              <div 
                className="progress-handle"
                style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section - Volume & Options */}
      <div className="player-right">
        <motion.button
          className="control-btn"
          onClick={() => dispatch(toggleMute())}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </motion.button>

        <div className="volume-container" onClick={handleVolumeClick}>
          <div className="volume-bar">
            <div 
              className="volume-fill"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        <motion.button
          className="control-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaExpand />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SpotifyPlayer;