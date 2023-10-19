
import React from "react";
import { PlayButton } from "../../../../shared/playButton";
import{PiHeartStraight} from "react-icons/pi"
import SpotifyLogo from "../../../../images/SpotifyLogo.png"


function calculateTotalDuration(tracks) {
    const totalMilliseconds = tracks.reduce(
      (total, track) => total + track.track.duration_ms,
      0
    );
    const totalHrs = Math.floor(totalMilliseconds / 3600000); 
    const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  
    return `${totalHrs} hrs ${totalMinutes < 10 ? "0" : ""}${totalMinutes} min`;
  }

export default function PlaylistDetails({ playlist }) {
  return (
    <div className="playlist-details">
        <div className="playlis-image-details">
      <div className="playlist-image">
        <img src={playlist.images[0].url} alt={playlist.name} />
      </div>
      <div className="playlist-info">
        <h1>{playlist.name}</h1>
        <p style={{color: "#b3b3b3"}}>{playlist.description}</p>
        <div className="moreAboutPlaylist">
        <img src={SpotifyLogo}  style={{ width: "10%", padding: "2px"}}/>
        <span>{playlist.followers.total} likes. </span>
        <span>{playlist.tracks.items.length} songs, </span>
        <span style={{color: "#b3b3b3"}}>about {calculateTotalDuration(playlist.tracks.items)}</span>
        </div>
        </div>
        
      </div>
      <div className="playlist-buttons">
      <PlayButton/>
      <PiHeartStraight style={{fontSize: "25px"}}/>
      
      </div>
    </div>
  );
}
