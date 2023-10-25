
import React from 'react';
import { Link } from 'react-router-dom';
import { PlayButton } from '../../../shared/playButton';
import TrackList from '../../tracks/details and tracks/tracks/tracksdetails';
import AlbumTrackList from '../AlbumResults/AlbumTracks/AlbumtrcakList';
// import './TrackResults.css'; 

const TrackResults = ({ data, hoveredIndex, handleMouseEnter, handleMouseLeave }) => {
    console.log(data,"data of tracks")
  return (
    <>

        <AlbumTrackList tracks = {data}/>
    </>
  );
}

export default TrackResults;
