import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  redirectToSpotifyAuth, 
  parseTokenFromHash, 
  getSpotifyUserProfile,
  getValidAccessToken 
} from '../../services/spotifyAuth';

// Async thunks
export const loginWithSpotify = createAsyncThunk(
  'auth/loginWithSpotify',
  async (_, { rejectWithValue }) => {
    try {
      redirectToSpotifyAuth();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleSpotifyCallback = createAsyncThunk(
  'auth/handleSpotifyCallback',
  async (_, { rejectWithValue }) => {
    try {
      const tokenData = parseTokenFromHash();
      
      if (!tokenData) {
        throw new Error('No token found in callback');
      }
      
      const userProfile = await getSpotifyUserProfile(tokenData.access_token);
      
      const user = {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        images: userProfile.images,
        country: userProfile.country,
        followers: userProfile.followers?.total || 0,
        product: userProfile.product,
        accessToken: tokenData.access_token,
      };
      
      localStorage.setItem('spotify_user', JSON.stringify(user));
      // Also store token separately for API calls
      localStorage.setItem('spotify_access_token', tokenData.access_token);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem('spotify_user');
      if (!storedUser) return null;
      
      const token = getValidAccessToken();
      if (!token) {
        localStorage.removeItem('spotify_user');
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expires');
        return null;
      }
      
      return JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem('spotify_user');
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_token_expires');
      return null;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    localStorage.removeItem('spotify_user');
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expires');
    localStorage.removeItem('spotify_auth_state');
  }
);

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('spotify_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  isLoading: false,
  error: null,
  isAuthenticated: !!getInitialUser(),
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithSpotify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithSpotify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Spotify login failed';
      })
      .addCase(handleSpotifyCallback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleSpotifyCallback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(handleSpotifyCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Authentication failed';
        state.isAuthenticated = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isInitialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;