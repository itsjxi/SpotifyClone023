import React from 'react';
import { FiInfo } from 'react-icons/fi';
import './TrackPreviewNotice.css';

const TrackPreviewNotice = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="track-preview-notice">
      <div className="notice-content">
        <FiInfo className="notice-icon" />
        <div className="notice-text">
          <h4>Preview Not Available</h4>
          <p>This track doesn't have a preview. Only 30-second previews are available through Spotify's API.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default TrackPreviewNotice;