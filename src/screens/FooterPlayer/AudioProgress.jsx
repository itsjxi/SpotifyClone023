
import React, { useState, useEffect } from "react";

const AudioProgress = ({ audioRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    console.log(audio,"audio ye haiu")
    console.log(audio.currentTime,"current time of audion")
    console.log(audio.duration,"duration time of audion")

    if (audio) {
      audio.addEventListener("timeupdate", () => {
    
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      });
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", () => {});
      }
    };
  }, [audioRef]);

  const progressBarWidth = (currentTime / duration) * 100 + "%";

  return (
    <div className="audio-progress">
      <div className="current-time">{formatTime(currentTime)}</div>
      <div className="progress-bar">
        <div className="progress" style={{ width: progressBarWidth }}></div>
      </div>
      <div className="duration">{formatTime(duration)}</div>
    </div>
  );
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export default AudioProgress;
