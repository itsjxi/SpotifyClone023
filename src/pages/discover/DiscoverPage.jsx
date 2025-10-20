import React from 'react';
import { motion } from 'framer-motion';
import { FiCompass, FiTrendingUp, FiMusic } from 'react-icons/fi';

const DiscoverPage = () => {
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
            <FiCompass className="section-icon" />
            Discover New Music
          </h1>
          <p className="hero-subtitle">
            Explore trending songs, new releases, and personalized recommendations
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiTrendingUp className="section-icon" />
            Coming Soon
          </h2>
        </div>
        
        <div className="made-for-you-grid">
          <div className="made-for-you-card card gradient-bg">
            <div className="made-for-you-content">
              <FiMusic size={48} />
              <h3>Discover Features</h3>
              <p>New music discovery features are being developed</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default DiscoverPage;