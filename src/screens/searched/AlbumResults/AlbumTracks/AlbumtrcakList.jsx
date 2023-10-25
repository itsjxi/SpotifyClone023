
import React from "react";
import { Link } from "react-router-dom";
import { useTrackId} from "../../../tracks/details and tracks/tracks/trackidContext";


function formatDate(dateString) {
    
  const date = new Date(dateString);
  return date.toLocaleString("default", { day: "2-digit", month: "short", year: "numeric" });
}


function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}


export default function AlbumTrackList({ tracks }) {
    const { setTrackId } = useTrackId();
    console.log(tracks,"commntracks ")
const handleTrackClick = (trackId) => {
   
    setTrackId(trackId);
    window.localStorage.setItem("TrackId", trackId)
    console.log(trackId)
  };
    console.log(tracks,"-------------")
  return (
    <div className="track-list">
      <h2>Tracks</h2>
      <table>
      <thead>
        <tr>
            <th>#</th>
          <th>Track Name</th>
          <th>Artist</th>
          <th>Duration (ms)</th>
          <th>Listen on Spotify</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track, index) => (
          <tr key={index} onClick={() => handleTrackClick(track.id)}>
            <td>{index+1}</td>
            <td>{track.name}</td>
            <td>
              {track.artists.map((artist, index) => (
                <a key={index} href={artist.external_urls.spotify} style={{ textDecoration: "none",color: "#b3b3b3" }} >
                  {artist.name}
                </a>
              ))}
            </td>
            <td>{formatDuration(track.duration_ms)}</td>
            <td>
              <a href={track.external_urls.spotify} style={{ textDecoration: "none",color: "#b3b3b3" }} >
                Play
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  );
}
