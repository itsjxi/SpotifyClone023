import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import playerReducer from '../features/player/playerSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;