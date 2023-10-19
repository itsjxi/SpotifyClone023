
import React from 'react';
import { Link } from 'react-router-dom';
import { PlayButton } from '../../../shared/playButton';
// import './TrackResults.css'; 

const TrackResults = ({ data, hoveredIndex, handleMouseEnter, handleMouseLeave }) => {
    console.log(data,"data of tracks")
  return (
    <>
      <h2>Track Results</h2>
      <div className="searched-type">
        {data.map((item, index) => (
          <Link to={`/track/${item.id}`} key={index} style={{ textDecoration: 'none' }}>
            <div
              className="searchedBlock"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={item.album.images[0]?.url} alt={item.name} />
              {hoveredIndex === index ? <PlayButton className="s-playPauseButton" /> : ''}
              <div className="aboutSearch">
                <div className="searched_Name" style={{ color: 'white' }}>{item.name}</div>
                <div className="searched_Type">Track</div>
                <div className="artists" style={{color: "white"}}>
                  Artists: {item.artists.slice(0,2).map((artist) => artist.name)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default TrackResults;
