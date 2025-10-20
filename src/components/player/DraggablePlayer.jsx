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
  FiList,
  FiX,
  FiMove,
  FiInfo,
  FiChevronDown,
  FiChevronUp
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
  setDuration,
  playTrackAtIndex
} from '../../features/player/playerSlice';
import './DraggablePlayer.css';

const DraggablePlayer = () => {
  const dispatch = useDispatch();
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    shuffle, 
    repeat, 
    currentTime, 
    duration,
    queue,
    currentIndex
  } = useSelector((state) => state.player);
  
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 360, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const hasPreviewUrl = currentTrack?.preview_url;

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !hasPreviewUrl) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
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
      if (isPlaying && currentTrack && hasPreviewUrl) {
        audio.play().catch(() => dispatch(setPlaying(false)));
      }
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
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch, isPlaying, currentTrack, repeat]);

  // Track change handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !hasPreviewUrl) return;

    audio.load(); // Reload the audio element
    dispatch(setCurrentTime(0));
    dispatch(setDuration(0));
  }, [currentTrack, hasPreviewUrl, dispatch]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !hasPreviewUrl) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Audio play failed:', error.message);
          dispatch(setPlaying(false));
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, hasPreviewUrl, dispatch]);

  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack && hasPreviewUrl) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume, currentTrack, hasPreviewUrl]);

  // Drag functionality
  const handleMouseDown = (e) => {
    // Only allow dragging from header or drag handle
    if (!e.target.closest('.player-header') && !e.target.closest('.drag-handle') && !e.target.closest('.player-collapsed')) return;
    if (e.target.closest('button') && !e.target.closest('.drag-handle')) return;
    
    setIsDragging(true);
    const rect = playerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const playerWidth = 320;
    const playerHeight = isCollapsed ? 60 : 200;
    
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - playerWidth, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - playerHeight, e.clientY - dragOffset.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Remove visual feedback
    if (playerRef.current) {
      playerRef.current.style.transform = '';
      playerRef.current.style.boxShadow = '';
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div 
      ref={playerRef}
      className={`draggable-player ${isCollapsed ? 'collapsed' : ''}`}
      style={{ 
        left: position.x, 
        top: position.y
      }}
      onMouseDown={handleMouseDown}
    >
      {hasPreviewUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.preview_url}
          preload="none"
          crossOrigin="anonymous"
        />
      )}

      {isCollapsed ? (
        <div className="player-collapsed">
          <div className="collapsed-track-info">
            <img 
              src={currentTrack.album?.images?.[2]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'} 
              alt={currentTrack.name}
              className="collapsed-track-image"
            />
            <div className="collapsed-track-details">
              <span className="collapsed-track-name">{currentTrack.name}</span>
            </div>
          </div>
          
          <div className="collapsed-controls">
            <button 
              className="btn btn-ghost btn-xs"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(previousTrack());
              }}
            >
              <FiSkipBack size={14} />
            </button>
            
            <button 
              className={`btn btn-primary btn-xs ${!hasPreviewUrl ? 'disabled' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hasPreviewUrl) dispatch(togglePlay());
              }}
              disabled={!hasPreviewUrl}
            >
              {isPlaying && hasPreviewUrl ? <FiPause size={14} /> : <FiPlay size={14} />}
            </button>
            
            <button 
              className="btn btn-ghost btn-xs"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(nextTrack());
              }}
            >
              <FiSkipForward size={14} />
            </button>
          </div>
          
          <button 
            className="btn btn-ghost btn-xs expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(false);
            }}
          >
            <FiChevronUp size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="player-header">
            <div className="drag-area">
              <FiMove className="drag-handle" size={14} />
              <span className="now-playing">Now Playing</span>
            </div>
            <div className="header-right">
              {!hasPreviewUrl && (
                <div className="preview-info-badge">
                  <FiInfo size={10} />
                  <span>No Preview</span>
                </div>
              )}
              <button 
                className="btn btn-ghost btn-sm header-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(true);
                }}
              >
                <FiChevronDown size={14} />
              </button>
              <button 
                className="btn btn-ghost btn-sm header-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQueue(!showQueue);
                }}
              >
                <FiList size={14} />
              </button>
            </div>
          </div>

          <div className="player-main">
        <div className="track-info">
          <img 
            src={currentTrack.album?.images?.[0]?.url || 'https://via.placeholder.com/48x48/333/fff?text=♪'} 
            alt={currentTrack.name}
            className="track-image"
          />
          <div className="track-details">
            <h4>{currentTrack.name}</h4>
            <p>{currentTrack.artists?.map(a => a.name).join(', ')}</p>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`btn btn-ghost btn-sm ${shuffle ? 'active' : ''}`}
              onClick={() => dispatch(toggleShuffle())}
            >
              <FiShuffle />
            </button>
            
            <button 
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(previousTrack());
              }}
            >
              <FiSkipBack />
            </button>
            
            <button 
              className={`btn btn-primary ${!hasPreviewUrl ? 'disabled' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hasPreviewUrl) dispatch(togglePlay());
              }}
              disabled={!hasPreviewUrl}
            >
              {isPlaying && hasPreviewUrl ? <FiPause /> : <FiPlay />}
            </button>
            
            <button 
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(nextTrack());
              }}
            >
              <FiSkipForward />
            </button>
            
            <button 
              className={`btn btn-ghost btn-sm ${repeat !== 'off' ? 'active' : ''}`}
              onClick={() => dispatch(toggleRepeat())}
            >
              <FiRepeat />
            </button>
          </div>

          <div className="progress-bar">
            <span className="time">{hasPreviewUrl ? formatTime(currentTime) : '--:--'}</span>
            <div 
              className={`progress-track ${!hasPreviewUrl ? 'disabled' : ''}`}
              onClick={(e) => {
                if (!hasPreviewUrl) return;
                const audio = audioRef.current;
                if (!audio || !audio.duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const newTime = percent * audio.duration;
                audio.currentTime = newTime;
                dispatch(setCurrentTime(newTime));
              }}
            >
              <div 
                className="progress-fill"
                style={{ width: `${hasPreviewUrl && duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="time">{hasPreviewUrl ? formatTime(duration) : '--:--'}</span>
          </div>

          <div className="volume-control">
            <button 
              className={`btn btn-ghost btn-sm ${!hasPreviewUrl ? 'disabled' : ''}`}
              onClick={() => hasPreviewUrl && dispatch(setVolume(volume === 0 ? 0.5 : 0))}
              disabled={!hasPreviewUrl}
            >
              {!hasPreviewUrl ? <FiVolumeX /> : (volume === 0 ? <FiVolumeX /> : <FiVolume2 />)}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={hasPreviewUrl ? volume : 0}
              onChange={(e) => hasPreviewUrl && dispatch(setVolume(parseFloat(e.target.value)))}
              className={`volume-slider ${!hasPreviewUrl ? 'disabled' : ''}`}
              disabled={!hasPreviewUrl}
            />
          </div>
        </div>
          </div>
        </>
      )}

      {showQueue && !isCollapsed && (
        <div className="queue-panel">
          <div className="queue-header">
            <h4>Up Next</h4>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowQueue(false)}
            >
              <FiX />
            </button>
          </div>
          <div className="queue-list">
            {queue.map((track, index) => (
              <div 
                key={track.id}
                className={`queue-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => dispatch(playTrackAtIndex(index))}
              >
                <img 
                  src={track.album?.images?.[2]?.url || 'https://via.placeholder.com/32x32/333/fff?text=♪'} 
                  alt={track.name}
                />
                <div className="queue-track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-artist">{track.artists?.map(a => a.name).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggablePlayer;