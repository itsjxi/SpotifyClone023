import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Welcome back, {user?.displayName || 'Music Lover'}!
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Ready to discover your next favorite song?
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Recently Played</h3>
          <p style={{ margin: '0', color: 'var(--text-secondary)' }}>Continue where you left off</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Discover Weekly</h3>
          <p style={{ margin: '0', color: 'var(--text-secondary)' }}>Fresh music picked for you</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Your Top Songs</h3>
          <p style={{ margin: '0', color: 'var(--text-secondary)' }}>Songs you can't stop playing</p>
        </div>
      </div>
    </div>
  );
};

export default Home;