import "./FooterPlayer.css";
import React, { useEffect, useState, useRef } from "react";
import { useSearchResults } from "../../context/searchedContext";
import { useTrackId } from "../tracks/details and tracks/tracks/trackidContext";
import AudioPlayer from "./AudioPlayer";
import TrackInfo from "./TrackInfo";
import Controls from "./Controls";
import UpcomingTracks from "./UpcomingTracks";
import Loader from "../../shared/Loader/loader";


const FooterPlayer = () => {
  const { tracks } = useSearchResults();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const { trackId } = useTrackId();

  const currentTrack = tracks[currentTrackIndex] && tracks[currentTrackIndex].track;

  useEffect(() => {
    const newIndex = tracks.findIndex((track) => track.track.id === trackId);
    if (newIndex !== -1) {
      setCurrentTrackIndex(newIndex);
    }
  }, [trackId, tracks]);

  if (!tracks || tracks.length === 0) {
    return <Loader />;
  }

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
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="custom-audio-player">
      {currentTrack && (
        <div className="custom-audio-player">
          <TrackInfo currentTrack={currentTrack} />
          <div className="controls-and-audio">
          <Controls
            isPlaying={isPlaying}
            playPreviousTrack={playPreviousTrack}
            playNextTrack={playNextTrack}
            togglePlayPause={togglePlayPause}
          />
          <AudioPlayer currentTrack={currentTrack} isPlaying={isPlaying} audioRef={audioRef} />
          </div>
          <UpcomingTracks tracks={tracks} currentTrackIndex={currentTrackIndex} />
        </div>
      )}
    </div>
  );
};

export default FooterPlayer;
