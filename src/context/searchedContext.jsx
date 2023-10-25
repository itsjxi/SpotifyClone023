

import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchKey, setSearchKey] = useState('');
  const [searchType, setSearchType] = useState('album');
  const [tracks, setTracks] = useState([]);

  const setTracksData = (newTracks) => {
    setTracks(newTracks);
  };
  

  return (
    <SearchContext.Provider 
    value={{ searchKey, setSearchKey, 
             searchType, setSearchType , 
             tracks, setTracksData
          }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchResults() {
  return useContext(SearchContext);
}


