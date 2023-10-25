import React from "react";
import { AiOutlineStepBackward, AiFillPlayCircle, AiFillPauseCircle, AiOutlineStepForward } from "react-icons/ai";

const Controls = ({ isPlaying, playPreviousTrack, playNextTrack, togglePlayPause }) => {
  return (
    <div className="controls">
      <button onClick={playPreviousTrack} className="control-button">
        <AiOutlineStepBackward />
      </button>
      <button onClick={togglePlayPause} className="play-pause-button">
        {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
      </button>
      <button onClick={playNextTrack} className="control-button">
        <AiOutlineStepForward />
      </button>
    </div>
  );
};

export default Controls;
