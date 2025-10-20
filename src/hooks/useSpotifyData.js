import { useState, useEffect, useCallback, useMemo } from 'react';
import { spotifyService } from '../services/spotifyApi';
import toast from 'react-hot-toast';

// Cache for API responses
const cache = new Map();

export const useSpotifyData = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create stable cache key
  const cacheKey = useMemo(() => 
    `${endpoint}-${JSON.stringify(params)}`, 
    [endpoint, params.limit, params.timeRange]
  );

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let response;
      let result;
      switch (endpoint) {
        case 'recentlyPlayed':
          response = await spotifyService.getRecentlyPlayed(params.limit);
          result = response.data.items?.map(item => item.track) || [];
          break;

        case 'topTracks':
          response = await spotifyService.getTopTracks(params.timeRange, params.limit);
          result = response.data.items || [];
          break;
        case 'userPlaylists':
          response = await spotifyService.getUserPlaylists(params.limit);
          result = response.data.items || [];
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }
      
      setData(result);
      cache.set(cacheKey, result);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err);
      setData([]);
      if (err.response?.status === 401) {
        console.warn('Token expired, redirecting to login');
      } else {
        console.warn(`Failed to load ${endpoint}:`, err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, cacheKey, params.limit, params.timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const refetch = useCallback(() => {
    cache.delete(cacheKey);
    fetchData();
  }, [cacheKey, fetchData]);

  return { data, loading, error, refetch };
};

export default useSpotifyData;