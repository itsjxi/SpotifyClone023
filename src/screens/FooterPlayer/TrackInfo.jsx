import React from "react";

const TrackInfo = ({ currentTrack }) => {
  return (
    <div className="current-track">
      <img src={currentTrack.album.images[2].url} alt="Track Image" />
      <div className="track-details">
        <h3>{currentTrack.name}</h3>
        <p>{currentTrack.artists[0].name}</p>
      </div>
    </div>
  );
};

export default TrackInfo;
