import React from "react";
import { useTrackId } from "../tracks/details and tracks/tracks/trackidContext";
import { fetchData } from "../../ApiData/Api";
import { useState, useEffect ,useRef} from "react";
import "./Footerplayer.css"
import Loader from "../../shared/Loader/loader";

// function formatDuration(durationMs) {
//   const minutes = Math.floor(durationMs / 60000);
//   const seconds = Math.floor((durationMs % 60000) / 1000);
//   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// }

// export default function FooterPlayer() {
//   const { trackId } = useTrackId();
//   const [track, setTrack] = useState(null); 
//   console.log(track,trackId,"000000000000000000000")
//   useEffect(() => {
//     if (trackId) {
//       fetchData(`tracks/${trackId}`)
//         .then((data) => {
//           setTrack(data);
//           console.log(data,"fooetrplayer data")
//         })
//         .catch((error) => {
//           console.error("Error fetching track:", error);
//         });
//     } else{
//       setTrack(null);
//     }
//   }, [trackId]);

//   return (
//     <div className="footer-player" style={{color:"white"}}>
//       {track && (
//         <div className="track-info">
//           <img src={track.album.images[2].url} alt={track.name} />
//           <div>
//             <h3>{track.name}</h3>
//             <p>Artist: {track.artists.map((artist) => artist.name).join(", ")}</p>
//           </div>
//         </div>
//       )}
//       <div className="audio-player">
//         {track ? (
//           <>
//             <p>Album: {track.album.name}</p>
//             <p>Duration: {formatDuration(track.duration_ms)}</p>
//             <audio controls>
//               <source src={track.preview_url} type="audio/mpeg" />
//               Your browser does not support the audio element.
//             </audio>
//           </>
//         ) : (
//           <Loader/>
//         )}
//       </div>
//     </div>
//   );
// }

// FooterPlayer.js
// CustomAudioPlayer.js

// CustomAudioPlayer.js

import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";
import AudioProgress from "./AudioProgress";

const FooterPlayer = ({ tracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const audio = audioRef.current;
      audio.play();
    } else {
      const audio = audioRef.current;
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex].track.preview_url;
    audio.load();

    if (isPlaying) {
      audio.play();
    }
  }, [currentTrackIndex, tracks]);

  const playPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const playNextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentTrack = tracks[currentTrackIndex].track;

  return (
    <div className="custom-audio-player">
       <div className="current-track">
        <img src={currentTrack.album.images[2].url} alt="Track Image" />
        <div className="track-details">
          <h3>{currentTrack.name}</h3>
          <p>{currentTrack.artists[0].name}</p>
        </div>
      </div>
      <div className="controls-and-audio">
      <div className="controls">
        <button onClick={playPreviousTrack} className="control-button">
          <FaStepBackward />
        </button>
        <button onClick={togglePlayPause} className="play-pause-button">
          {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
        </button>
        <button onClick={playNextTrack} className="control-button">
          <FaStepForward />
        </button>
      </div>
      <audio ref={audioRef} controls style={{ display: "none" }}>
        <source src={currentTrack.preview_url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <AudioProgress audioRef={audioRef} />
      </div>
     

      <div className="upcoming-tracks">
        <h4>Upcoming Tracks</h4>
        <ul>
          {tracks.slice(currentTrackIndex + 1, currentTrackIndex + 4).map((track, index) => (
            <li key={index}>{track.track.name}</li>
          ))}
        </ul>
      </div>
    
    </div>
  );
 };

export default FooterPlayer;

