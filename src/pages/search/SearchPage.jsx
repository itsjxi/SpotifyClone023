import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPlay, FiUser, FiDisc, FiMusic } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import { spotifyService } from '../../services/spotifyApi';
import TrackPreviewNotice from '../../components/ui/TrackPreviewNotice';
import toast from 'react-hot-toast';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      if (searchQuery !== query) {
        performSearch(searchQuery);
      }
    } else {
      setQuery('');
      setResults({});
    }
  }, [searchParams]);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && !Object.keys(results).length) {
      performSearch(searchQuery);
    }
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await spotifyService.search(searchQuery, 'track,artist,album,playlist', 50);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handlePlayTrack = (track) => {
    const trackList = results.tracks?.items || [track];
    const startIndex = trackList.findIndex(t => t.id === track.id) || 0;
    
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks: trackList, startIndex }));
    toast.success(`Playing: ${track.name}`);
  };

  const tabs = [
    { id: 'all', label: 'All', icon: FiSearch },
    { id: 'tracks', label: 'Songs', icon: FiMusic },
    { id: 'artists', label: 'Artists', icon: FiUser },
    { id: 'albums', label: 'Albums', icon: FiDisc },
    { id: 'playlists', label: 'Playlists', icon: FiMusic }
  ];

  const renderTopResult = () => {
    const topTrack = results.tracks?.items?.[0];
    const topArtist = results.artists?.items?.[0];
    
    if (!topTrack && !topArtist) return null;

    return (
      <div className="top-result-section">
        <h3 className="section-title">Top result</h3>
        <div className="top-result-card" onClick={() => topTrack && handlePlayTrack(topTrack)}>
          <div className="top-result-image">
            <img 
              src={topTrack?.album?.images?.[0]?.url || topArtist?.images?.[0]?.url || '/placeholder.png'} 
              alt={topTrack?.name || topArtist?.name} 
            />
            {topTrack && (
              <button className="top-result-play">
                <FiPlay />
              </button>
            )}
          </div>
          <div className="top-result-info">
            <h4 className="top-result-title">{topTrack?.name || topArtist?.name}</h4>
            <div className="top-result-meta">
              {topTrack ? (
                <>
                  <span className="result-type">Song</span>
                  <span className="result-artist">{topTrack.artists?.map(a => a.name).join(', ')}</span>
                </>
              ) : (
                <>
                  <span className="result-type">Artist</span>
                  <span className="result-followers">{topArtist?.followers?.total?.toLocaleString()} followers</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrackList = (tracks, showAll = false) => {
    const tracksToShow = showAll ? tracks : tracks?.slice(0, 4);
    
    return (
      <div className="track-list">
        {tracksToShow?.map((track, index) => (
          <motion.div
            key={track.id}
            className="track-list-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handlePlayTrack(track)}
          >
            <div className="track-number">{index + 1}</div>
            <div className="track-image">
              <img src={track.album?.images?.[0]?.url || '/placeholder.png'} alt={track.name} />
              <button className="track-play-btn">
                <FiPlay />
              </button>
            </div>
            <div className="track-details">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">{track.artists?.map(a => a.name).join(', ')}</div>
            </div>
            <div className="track-album">{track.album?.name}</div>
            <div className="track-duration">
              {track.duration_ms ? Math.floor(track.duration_ms / 60000) + ':' + 
                String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0') : '--:--'}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const getImageUrl = (item) => {
    try {
      return item?.images?.[0]?.url || 
             (item?.album && item.album?.images?.[0]?.url) || 
             '/placeholder.png';
    } catch (error) {
      return '/placeholder.png';
    }
  };

  const renderGridResults = (items, type) => (
    <div className="search-grid">
      {items?.map((item, index) => {
        if (!item) return null;
        
        return (
          <motion.div
            key={item.id}
            className={`search-grid-item ${type}-item`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => {
              if (type === 'track') {
                handlePlayTrack(item);
              } else if (type === 'playlist') {
                navigate(`/playlist/${item.id}`);
              }
            }}
          >
            <div className="grid-item-image">
              <img 
                src={getImageUrl(item)} 
                alt={item?.name || 'Music item'} 
              />
              {type === 'track' && (
                <button className="grid-play-btn">
                  <FiPlay />
                </button>
              )}
            </div>
            <div className="grid-item-info">
              <h4 className="grid-item-title">{item?.name || 'Unknown'}</h4>
              <p className="grid-item-subtitle">
                {type === 'artist' && `${item.followers?.total?.toLocaleString()} followers`}
                {type === 'album' && item.artists?.map(a => a.name).join(', ')}
                {type === 'playlist' && `By ${item.owner?.display_name}`}
                {type === 'track' && item.artists?.map(a => a.name).join(', ')}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="search-loading">
          <div className="loading-grid">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="loading-item">
                <div className="loading-image"></div>
                <div className="loading-text">
                  <div className="loading-line"></div>
                  <div className="loading-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!query.trim()) {
      return (
        <div className="search-empty">
          <FiSearch size={64} />
          <h3>Search for music</h3>
          <p>Use the search bar above to find your favorite songs, artists, albums, and playlists</p>
        </div>
      );
    }

    if (!results.tracks && !results.artists && !results.albums && !results.playlists) {
      return (
        <div className="search-empty">
          <FiSearch size={64} />
          <h3>No results found</h3>
          <p>Try searching with different keywords</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'tracks':
        return (
          <div className="search-results">
            <h3 className="section-title">Songs</h3>
            {renderTrackList(results.tracks?.items, true)}
          </div>
        );
      case 'artists':
        return (
          <div className="search-results">
            <h3 className="section-title">Artists</h3>
            {renderGridResults(results.artists?.items, 'artist')}
          </div>
        );
      case 'albums':
        return (
          <div className="search-results">
            <h3 className="section-title">Albums</h3>
            {renderGridResults(results.albums?.items, 'album')}
          </div>
        );
      case 'playlists':
        return (
          <div className="search-results">
            <h3 className="section-title">Playlists</h3>
            {renderGridResults(results.playlists?.items, 'playlist')}
          </div>
        );
      default:
        return (
          <div className="search-results-all">
            <div className="results-top">
              {renderTopResult()}
              {results.tracks?.items?.length > 0 && (
                <div className="songs-section">
                  <h3 className="section-title">Songs</h3>
                  {renderTrackList(results.tracks.items)}
                </div>
              )}
            </div>
            {results.artists?.items?.length > 0 && (
              <div className="results-section">
                <h3 className="section-title">Artists</h3>
                {renderGridResults(results.artists.items.slice(0, 6), 'artist')}
              </div>
            )}
            {results.albums?.items?.length > 0 && (
              <div className="results-section">
                <h3 className="section-title">Albums</h3>
                {renderGridResults(results.albums.items.slice(0, 6), 'album')}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="search-page">
      {query && (
        <div className="search-header">
          <div className="search-query-display">
            <h2>Search results for "{query}"</h2>
            <span className="result-count">
              {loading ? 'Searching...' : 
                `${(results.tracks?.items?.length || 0) + (results.artists?.items?.length || 0) + (results.albums?.items?.length || 0) + (results.playlists?.items?.length || 0)} results`}
            </span>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="search-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`search-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="search-content">
        {renderContent()}
      </div>
      
      <TrackPreviewNotice 
        show={showPreviewNotice} 
        onClose={() => setShowPreviewNotice(false)} 
      />
    </div>
  );
};

export default SearchPage;