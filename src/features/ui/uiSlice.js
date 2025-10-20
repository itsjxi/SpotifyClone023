import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const saved = localStorage.getItem('spotify_theme');
  return saved ? JSON.parse(saved) : { mode: 'dark', accent: 'green' };
};

const initialState = {
  theme: getInitialTheme(),
  sidebarCollapsed: false,
  showMobileMenu: false,
  notifications: [],
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme.mode = state.theme.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('spotify_theme', JSON.stringify(state.theme));
    },
    
    setAccentColor: (state, action) => {
      state.theme.accent = action.payload;
      localStorage.setItem('spotify_theme', JSON.stringify(state.theme));
    },
    
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    toggleMobileMenu: (state) => {
      state.showMobileMenu = !state.showMobileMenu;
    },
    
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setAccentColor,
  toggleSidebar,
  toggleMobileMenu,
  addNotification,
  removeNotification,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;