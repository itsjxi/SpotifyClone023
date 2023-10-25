import React from "react";

const UpcomingTracks = ({ tracks, currentTrackIndex }) => {
  return (
    <div className="upcoming-tracks">
      <h4>Upcoming Tracks</h4>
      <ul>
        {tracks.slice(currentTrackIndex + 1, currentTrackIndex + 4).map((track, index) => (
          <li key={index}>
            <span>
              <img src={track.track.album.images[2].url} alt="Track Image" style={{ width: "40px" }} />
            </span>
            <p>{track.track.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingTracks;
