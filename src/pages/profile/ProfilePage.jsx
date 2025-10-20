import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiEdit } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title gradient-text">
            <FiUser className="section-icon" />
            Your Profile
          </h1>
          <p className="hero-subtitle">
            Manage your account settings and preferences
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            Account Information
          </h2>
        </div>
        
        <div className="card" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: 'var(--radius-full)', 
              overflow: 'hidden',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {user?.images?.[0]?.url ? (
                <img 
                  src={user.images[0].url} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <FiUser size={32} />
              )}
            </div>
            <div>
              <h3 style={{ margin: '0 0 var(--space-xs) 0', fontSize: 'var(--text-xl)' }}>
                {user?.displayName || 'User'}
              </h3>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
                {user?.email || 'No email available'}
              </p>
              <p style={{ margin: 'var(--space-xs) 0 0 0', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {user?.followers?.total || 0} followers • {user?.country || 'Unknown'} • {user?.product || 'Free'}
              </p>
            </div>
          </div>
          
          <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
            <FiEdit />
            Edit Profile
          </button>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiSettings className="section-icon" />
            Settings
          </h2>
        </div>
        
        <div className="made-for-you-grid">
          <div className="made-for-you-card card gradient-bg">
            <div className="made-for-you-content">
              <FiSettings size={48} />
              <h3>Profile Settings</h3>
              <p>Advanced profile and account settings are being developed</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProfilePage;