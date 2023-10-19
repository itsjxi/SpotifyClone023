import React from 'react';
import { Link } from 'react-router-dom';
import { PlayButton } from '../../../shared/playButton';
import"./Albumresults.css"

const AlbumResults = ({ data, hoveredIndex, handleMouseEnter,handleMouseLeave }) => {
    console.log(data)
    return (
        <>
        <h2>Album results</h2>
        <div className="searched-type">
          {data.map((item, index) => (
            <Link to={`/album/${item.id}`} key={index} style={{ textDecoration: 'none' }}>
              <div
                className="searchedBlock"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={item.images[0].url} alt={item.name} />
                {hoveredIndex === index ? <PlayButton className="s-playPauseButton" /> : ''}
                <div className="aboutSearch">
                  <div className="searched_Name" style={{ color: 'white' }}>{item.name}</div>
                  <div className="searched_Type">Album</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </>
      );
}

export default AlbumResults;
