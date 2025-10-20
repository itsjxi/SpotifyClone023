import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleSpotifyCallback } from '../features/auth/authSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const SpotifyCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash.includes('error')) {
      toast.error('Spotify authentication was cancelled or failed');
      navigate('/');
      return;
    }

    if (hash.includes('access_token')) {
      dispatch(handleSpotifyCallback());
    } else {
      toast.error('No access token received from Spotify');
      navigate('/');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Successfully connected to Spotify!');
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/');
    }
  }, [error, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <LoadingSpinner size="large" />
      <h2 style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
        Connecting to Spotify...
      </h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
        Please wait while we complete your Spotify authentication.
      </p>
    </div>
  );
};

export default SpotifyCallback;