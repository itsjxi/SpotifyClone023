import React from 'react';
import { Link } from 'react-router-dom';
import { PlayButton } from '../../../shared/playButton';

const ArtistResults = ({ data, hoveredIndex, handleMouseEnter, handleMouseLeave }) => {
    console.log(data, "data of artists")
  return (
    <>
    <h2>Artists</h2>
    <div className='seached-type'>
        
      {data.map((item, index) => (
        <Link to={`/artist/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
          <div
            className="searchedBlock"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <img src={item.images[0]?.url} alt={item.name} />
            {hoveredIndex === index ? <PlayButton className="s-playPauseButton" /> : ''}
            <div className="aboutSearch">
              <div className="searched_Name" style={{ color: 'white' }}>{item.name}</div>
              <div className="searched_Type">Artist</div>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </>
  );
}

export default ArtistResults;
