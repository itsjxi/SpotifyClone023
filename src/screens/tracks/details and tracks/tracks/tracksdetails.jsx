
import React from "react";
import { Link } from "react-router-dom";
import { useTrackId } from "./trackidContext";


function formatDate(dateString) {
    
  const date = new Date(dateString);
  return date.toLocaleString("default", { day: "2-digit", month: "short", year: "numeric" });
}


function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}


export default function TrackList({ tracks }) {
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
            <th>Title</th>
            <th>Album</th>
            <th>Date Added</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
          
            <tr key={index} onClick={() => handleTrackClick(track.track.id)}>
                  
              <td>{index + 1}</td>
              {/* <Link to={`/track/${track.track.id}`} style = {{ textDecoration: 'none' }}> */}
              <td className="track-info">
                <img src={track.track.album.images[0].url} alt={track.track.name}/>
                <div>
                  <p className="track-name" style={{color: "white"}}>{track.track.name}</p>
                  <p className="artist-name" style={{color: "#b3b3b3"}}>{track.track.artists.slice(0,2).map((artist) => artist.name).join(", ")}</p>
                </div>
              </td>
              {/* </Link> */}
              <td style={{color: "#b3b3b3" ,textOverflow: "ellipsis"}}>{track.track.album.name}</td>
              <td style={{color: "#b3b3b3"}}>{formatDate(track.added_at)}</td>
              <td style={{color: "#b3b3b3"}}>{formatDuration(track.track.duration_ms)}</td>
             
              
            </tr>
           
           
          ))}
        </tbody>
      </table>
    </div>
  );
}
