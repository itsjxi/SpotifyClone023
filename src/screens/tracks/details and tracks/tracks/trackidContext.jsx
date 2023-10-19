
import React, { createContext, useState, useContext } from "react";

const TrackIdContext = createContext();

export function TrackIdProvider({ children }) {
  const [trackId, setTrackId] = useState(null);

  return (
    <TrackIdContext.Provider value={{ trackId, setTrackId }}>
      {children}
    </TrackIdContext.Provider>
  );
}

export function useTrackId() {
  return useContext(TrackIdContext);
}
