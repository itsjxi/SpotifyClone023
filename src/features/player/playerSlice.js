import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current track info
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  
  // Playback state
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  isMuted: false,
  
  // Player modes
  shuffle: false,
  repeat: 'off', // 'off', 'one', 'all'
  
  // UI state
  isLoading: false,
  showQueue: false,
  showLyrics: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Track management
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = true;
    },
    
    setQueue: (state, action) => {
      const { tracks, startIndex = 0 } = action.payload;
      state.queue = tracks || action.payload;
      state.currentIndex = startIndex;
      if (state.queue[state.currentIndex]) {
        state.currentTrack = state.queue[state.currentIndex];
        state.currentTime = 0;
        state.duration = 0;
        state.isPlaying = false;
      }
    },
    
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    
    removeFromQueue: (state, action) => {
      state.queue.splice(action.payload, 1);
      if (action.payload <= state.currentIndex && state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    
    // Playback controls
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    
    nextTrack: (state) => {
      if (state.queue.length === 0) return;
      
      if (state.repeat === 'one') {
        // Repeat current track
        state.currentTime = 0;
        return;
      }
      
      if (state.shuffle) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * state.queue.length);
        } while (newIndex === state.currentIndex && state.queue.length > 1);
        state.currentIndex = newIndex;
      } else if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
      } else if (state.repeat === 'all') {
        state.currentIndex = 0;
      } else {
        state.isPlaying = false;
        return;
      }
      
      if (state.queue[state.currentIndex]) {
        state.currentTrack = state.queue[state.currentIndex];
        state.currentTime = 0;
        state.duration = 0;
        state.isPlaying = true;
      }
    },
    
    previousTrack: (state) => {
      if (state.queue.length === 0) return;
      
      if (state.currentTime > 3) {
        state.currentTime = 0;
      } else if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.currentTime = 0;
        state.duration = 0;
        state.isPlaying = state.isPlaying;
      } else if (state.repeat === 'all') {
        state.currentIndex = state.queue.length - 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.currentTime = 0;
        state.duration = 0;
        state.isPlaying = state.isPlaying;
      }
    },
    
    // Time and volume
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    
    setVolume: (state, action) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
      state.isMuted = state.volume === 0;
    },
    
    toggleMute: (state) => {
      if (state.isMuted) {
        state.volume = 0.7;
        state.isMuted = false;
      } else {
        state.volume = 0;
        state.isMuted = true;
      }
    },
    
    // Player modes
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    
    toggleRepeat: (state) => {
      const modes = ['off', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeat);
      state.repeat = modes[(currentIndex + 1) % modes.length];
    },
    
    // UI controls
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    toggleQueue: (state) => {
      state.showQueue = !state.showQueue;
    },
    
    toggleLyrics: (state) => {
      state.showLyrics = !state.showLyrics;
    },
    
    // Seek to position
    seekTo: (state, action) => {
      state.currentTime = action.payload;
    },
    
    // Play specific track from queue
    playTrackAtIndex: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.queue.length) {
        state.currentIndex = index;
        state.currentTrack = state.queue[index];
        state.currentTime = 0;
        state.duration = 0;
        state.isPlaying = true;
      }
    },
  },
});

export const {
  setCurrentTrack,
  setQueue,
  addToQueue,
  removeFromQueue,
  togglePlay,
  setPlaying,
  nextTrack,
  previousTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  toggleShuffle,
  toggleRepeat,
  setLoading,
  toggleQueue,
  toggleLyrics,
  seekTo,
  playTrackAtIndex,
} = playerSlice.actions;

export default playerSlice.reducer;