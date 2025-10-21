// Spotify OAuth Configuration (Client-side flow - no client secret needed)
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '7bdfde888d4c4769a8ea1098483fd0f7';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://musicappspotify023.netlify.app/';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-top-read',
  'user-read-recently-played'
].join(' ');

// Generate random string for state parameter
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Redirect to Spotify authorization (Implicit Grant Flow)
export const redirectToSpotifyAuth = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state,
    show_dialog: 'true'
  });
  
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Parse access token from URL hash (implicit flow)
export const parseTokenFromHash = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  const accessToken = params.get('access_token');
  const tokenType = params.get('token_type');
  const expiresIn = params.get('expires_in');
  const state = params.get('state');
  const error = params.get('error');
  
  if (error) {
    throw new Error(error);
  }
  
  const storedState = localStorage.getItem('spotify_auth_state');
  if (state !== storedState) {
    throw new Error('State mismatch error');
  }
  
  if (accessToken) {
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_token_expires', Date.now() + (parseInt(expiresIn) * 1000));
    localStorage.removeItem('spotify_auth_state');
    
    // Clear the hash from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return {
      access_token: accessToken,
      token_type: tokenType,
      expires_in: parseInt(expiresIn)
    };
  }
  
  return null;
};

// Get user profile from Spotify
export const getSpotifyUserProfile = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }
  
  return response.json();
};

// Check if token is valid
export const isTokenValid = () => {
  const token = localStorage.getItem('spotify_access_token');
  const expires = localStorage.getItem('spotify_token_expires');
  
  if (!token || !expires) return false;
  
  return Date.now() < parseInt(expires);
};

// Get valid access token
export const getValidAccessToken = () => {
  if (isTokenValid()) {
    return localStorage.getItem('spotify_access_token');
  }
  
  // For implicit flow, we need to re-authenticate when token expires
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expires');
  return null;
};