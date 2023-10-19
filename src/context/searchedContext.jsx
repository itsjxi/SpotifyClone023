

import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchKey, setSearchKey] = useState('');
  const [searchType, setSearchType] = useState('album');

  return (
    <SearchContext.Provider value={{ searchKey, setSearchKey, searchType, setSearchType }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchResults() {
  return useContext(SearchContext);
}
