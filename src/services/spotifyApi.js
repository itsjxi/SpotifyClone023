import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('spotify_access_token');
};

// Create axios instance with auth
const spotifyApi = axios.create({
  baseURL: BASE_URL,
});

// Add auth interceptor
spotifyApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Redirect to login if no token
    window.location.href = '/';
    return Promise.reject(new Error('No access token'));
  }
  return config;
});

// Add response interceptor for token expiry
spotifyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_token_expires');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const spotifyService = {
  // User Profile
  getCurrentUser: () => spotifyApi.get('/me'),
  
  // Playlists
  getUserPlaylists: (limit = 20) => spotifyApi.get('/me/playlists', { params: { limit } }),
  getPlaylist: (playlistId) => spotifyApi.get(`/playlists/${playlistId}`),
  getPlaylistTracks: (playlistId) => spotifyApi.get(`/playlists/${playlistId}/tracks`),
  
  // Browse
  getFeaturedPlaylists: (limit = 20) => spotifyApi.get('/browse/featured-playlists', { params: { limit, country: 'US' } }),
  getNewReleases: (limit = 20) => spotifyApi.get('/browse/new-releases', { params: { limit } }),
  getCategories: (limit = 20) => spotifyApi.get('/browse/categories', { params: { limit } }),
  
  // Search
  search: (query, type = 'track,artist,album,playlist', limit = 20) => 
    spotifyApi.get('/search', { params: { q: query, type, limit } }),
  
  // Tracks
  getTrack: (trackId) => spotifyApi.get(`/tracks/${trackId}`),
  getTracks: (trackIds) => spotifyApi.get(`/tracks?ids=${trackIds.join(',')}`),
  
  // Albums
  getAlbum: (albumId) => spotifyApi.get(`/albums/${albumId}`),
  getAlbumTracks: (albumId) => spotifyApi.get(`/albums/${albumId}/tracks`),
  
  // Artists
  getArtist: (artistId) => spotifyApi.get(`/artists/${artistId}`),
  getArtistTopTracks: (artistId, country = 'US') => 
    spotifyApi.get(`/artists/${artistId}/top-tracks?market=${country}`),
  getArtistAlbums: (artistId) => spotifyApi.get(`/artists/${artistId}/albums`),
  
  // User Library
  getSavedTracks: (limit = 20) => spotifyApi.get('/me/tracks', { params: { limit } }),
  getRecentlyPlayed: (limit = 20) => spotifyApi.get('/me/player/recently-played', { params: { limit } }),
  getTopTracks: (timeRange = 'medium_term', limit = 20) => 
    spotifyApi.get('/me/top/tracks', { params: { time_range: timeRange, limit } }),
  getTopArtists: (timeRange = 'medium_term', limit = 20) => 
    spotifyApi.get('/me/top/artists', { params: { time_range: timeRange, limit } }),
};

export default spotifyService;