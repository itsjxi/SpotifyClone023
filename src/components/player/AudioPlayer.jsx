import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiShuffle, 
  FiRepeat,
  FiVolume2,
  FiVolumeX,
  FiHeart
} from 'react-icons/fi';
import { 
  togglePlay, 
  setPlaying, 
  nextTrack, 
  previousTrack, 
  toggleShuffle, 
  toggleRepeat,
  setVolume,
  setCurrentTime,
  setDuration
} from '../../features/player/playerSlice';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    shuffle, 
    repeat, 
    currentTime, 
    duration 
  } = useSelector((state) => state.player);
  
  const audioRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isDragging && audio.duration) {
        dispatch(setCurrentTime(audio.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      dispatch(setCurrentTime(0));
      if (audio.duration && !isNaN(audio.duration)) {
        dispatch(setDuration(audio.duration));
      }
    };

    const handleCanPlay = () => {
      if (isPlaying && currentTrack?.preview_url) {
        audio.play().catch(error => {
          console.warn('Audio play failed:', error.message);
          dispatch(setPlaying(false));
        });
      }
    };

    const handleError = (e) => {
      console.warn('Audio error:', e.target.error?.message || 'Unknown error');
      dispatch(setPlaying(false));
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => dispatch(setPlaying(false)));
      } else {
        dispatch(nextTrack());
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch, isDragging, isPlaying, currentTrack?.preview_url, repeat]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentTrack?.preview_url) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio play failed:', error.message);
          dispatch(setPlaying(false));
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, dispatch]);

  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  const handlePlayPause = () => {
    dispatch(togglePlay());
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * audio.duration;
    
    audio.currentTime = newTime;
    dispatch(setCurrentTime(newTime));
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    dispatch(setVolume(newVolume));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  const hasPreview = currentTrack.preview_url;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={currentTrack.preview_url || ''}
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      <div className="player-content">
        {/* Track Info */}
        <div className="track-info">
          <div className="track-cover">
            <img 
              src={currentTrack.album?.images?.[0]?.url || '/placeholder-album.png'} 
              alt={currentTrack.name}
            />
          </div>
          <div className="track-details">
            <h4 className="track-name">{currentTrack.name}</h4>
            <p className="track-artist">
              {currentTrack.artists?.map(artist => artist.name).join(', ')}
            </p>
          </div>
          <button className="btn btn-ghost icon-btn-sm like-btn">
            <FiHeart />
          </button>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`btn btn-ghost icon-btn-sm ${shuffle ? 'active' : ''}`}
              onClick={() => dispatch(toggleShuffle())}
              title="Shuffle"
            >
              <FiShuffle />
            </button>
            
            <button 
              className="btn btn-ghost icon-btn"
              onClick={() => dispatch(previousTrack())}
              title="Previous"
            >
              <FiSkipBack />
            </button>
            
            <button 
              className="btn btn-primary play-btn"
              onClick={handlePlayPause}
              title={hasPreview ? (isPlaying ? 'Pause' : 'Play') : 'No preview available'}
            >
              {isPlaying && hasPreview ? <FiPause /> : <FiPlay />}
            </button>
            
            <button 
              className="btn btn-ghost icon-btn"
              onClick={() => dispatch(nextTrack())}
              title="Next"
            >
              <FiSkipForward />
            </button>
            
            <button 
              className={`btn btn-ghost icon-btn-sm ${repeat !== 'off' ? 'active' : ''}`}
              onClick={() => dispatch(toggleRepeat())}
              title="Repeat"
            >
              <FiRepeat />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <span className="time-display">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar"
              onClick={handleProgressChange}
            >
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${duration ? (currentTime / duration) * 100 : 0}%` 
                  }}
                />
                <div 
                  className="progress-thumb"
                  style={{ 
                    left: `${duration ? (currentTime / duration) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
            <span className="time-display">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="extra-controls">
          <div 
            className="volume-control"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button 
              className="btn btn-ghost icon-btn-sm"
              onClick={() => dispatch(setVolume(volume === 0 ? 0.5 : 0))}
            >
              {volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            {showVolumeSlider && (
              <div className="volume-slider" onClick={handleVolumeChange}>
                <div className="volume-track">
                  <div 
                    className="volume-fill"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;