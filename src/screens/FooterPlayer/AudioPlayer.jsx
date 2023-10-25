import React, { useEffect } from "react";
import AudioProgress from "./AudioProgress";
import Controls from "./Controls";

const AudioPlayer = ({ currentTrack, isPlaying, audioRef }) => {
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.preview_url;
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Play Error: ", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  return (
    <>
      <audio ref={audioRef} controls style={{ display: "none" }}>
        <source src={currentTrack.preview_url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    <AudioProgress audioRef={audioRef}/>
      {/* Place your audio progress component here */}
    </>
  );
};

export default AudioPlayer;
