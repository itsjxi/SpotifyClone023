import React from 'react';

const Library = () => {
  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Your Library
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Your music collection coming soon...
      </p>
    </div>
  );
};

export default Library;