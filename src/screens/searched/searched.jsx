
import React, { useEffect, useState } from 'react';
import { useSearchResults } from '../../context/searchedContext';
import axios from 'axios';
import './searched.css';
import { PlayButton } from '../../shared/playButton';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import ArtistResults from './ArtistResults/ArtistResults';
import AlbumResults from './AlbumResults/AlbumResults';
import HomePlayLists from '../HomePlaylists';
import TrackResults from './TracksResults/TracksResults';
import PlaylistDetails from '../tracks/details and tracks/PlaylistRendeing/playlistdetails';

export default function SearchedField() {
  const { path } = useRouteMatch();
  console.log("00000000000000000")
  const { searchKey, searchType } = useSearchResults();
  const [searchData, setSearchedData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  console.log(searchKey,searchData)
  useEffect(() => {
    searchedData();
    console.log(searchData,"ye naya data hai")
  }, [searchKey, searchType]);

  const combinedSearchTypes = ['album', 'artist', 'playlist', 'track','episode','show','audiobook'].join(',');

  const searchedData = async ()=> {
    setSearchedData([])
    let token = window.localStorage.getItem('token');
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${searchKey}&type=${combinedSearchTypes}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSearchedData(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  }

  return (
    <div>
      <h2>Search Results:</h2>
      <div className="searched">

 
    

        
      {/* {searchData.albums && (
          <AlbumResults data={searchData.albums.items} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
        )}
     
    
    {searchData.artists && (
          <ArtistResults data={searchData.artists.items} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
        )}

{searchData.tracks && (
          <TrackResults data={searchData.tracks.items} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
        )} */}
     
      {searchData.playlists && (
        
        
        <HomePlayLists data={searchData.playlists.items}/>

      )}
       </div>
      </div>
  
  );
}
