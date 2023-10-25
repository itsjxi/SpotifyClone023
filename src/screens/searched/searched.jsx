
import React, { useEffect, useState } from 'react';
import { useSearchResults } from '../../context/searchedContext';
import axios from 'axios';
import './searched.css';
import { PlayButton } from '../../shared/playButton';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import ArtistResults from './ArtistResults/ArtistResults';
import AlbumResults from './AlbumResults/AlbumResults';
import HomePlayLists from '../playlists/HomePlaylists';
import TrackResults from './TracksResults/TracksResults';
import PlaylistDetails from '../tracks/details and tracks/PlaylistRendeing/playlistdetails';
import SearchType from './searchedType/seachType';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

export default function SearchedField() {
  const { path } = useRouteMatch();
  const { searchKey, searchType } = useSearchResults();
  const [searchData, setSearchedData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
 

  console.log(searchKey,searchData)
  useEffect(() => {
    searchedData();
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

  const renderResults = () => {
    if (selectedType === 'all') {
  
      return (
        <div>
          {searchData.albums && (
            <AlbumResults data={searchData.albums.items.slice(0,4)} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
          )}

          {searchData.artists && (
            <ArtistResults data={searchData.artists.items.slice(0,4)} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
          )}

          {searchData.tracks && (
            <TrackResults data={searchData.tracks.items.slice(0,4)} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
          )}

          {searchData.playlists && (
            <HomePlayLists data={searchData.playlists.items.slice(0,4)} />
          )}
        </div>
      );
    } else {
      if (selectedType === 'album' && searchData.albums) {
        return (
          <AlbumResults data={searchData.albums.items} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
        );
      } else if (selectedType === 'artist' && searchData.artists) {
        return (
          <ArtistResults data={searchData.artists.items} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
        );
      } else if (selectedType === 'track' && searchData.tracks) {
        return (
          <TrackResults data={searchData.tracks.items} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
        );
      } else if (selectedType === 'playlist' && searchData.playlists) {
        return (
          <HomePlayLists data={searchData.playlists.items} />
        );
      }
      
    }
  }

  return (
    <div>
          <h2>Search Results: {searchKey}</h2>
      <SearchType
        types={["all" , ...combinedSearchTypes.split(",")]}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />
      <div className="searched">
        {renderResults()}
      </div>
      </div>
  
  );
}
