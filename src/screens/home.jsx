import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import HomeBasic from "./home/Homebasic";
import Feed from "./feed";
import Trendings from "./trendings";
import HomePlayLists from "./playlists/HomePlaylists";
import ArtistSongs from "./ArtistsSongs";
import "./home.css"
import Sidebar from "../components/sidebar/sidebar";
import Header from "./header/header";

import { SearchProvider } from "../context/searchedContext";
import PlaylistTracks from "./tracks/details and tracks/playlistTracks";
import FooterPlayer from "./FooterPlayer/FooterPlayer";
import { TrackIdProvider } from "./tracks/details and tracks/tracks/trackidContext";
import MainPlayer from "./mainPlayer/mainPlayer";
import SearchedField from "./searched/searched";

import Albumtracks from "./searched/AlbumResults/AlbumTracks/Albumtracks";
import ArtistTopTracks from "./searched/ArtistResults/ArtistTracks/ArtistsTopTracks";


export default function Home() {
    const location = useLocation();
    
    const renderContent = () => {
        const path = location.pathname;
        
        if (path.includes('/searched')) return <SearchedField />;
        if (path.includes('/trending')) return <Trendings />;
        if (path.includes('/playlist/')) return <HomePlayLists />;
        if (path.includes('/playlistTracks/')) return <PlaylistTracks />;
        if (path.includes('/artistssongs/')) return <ArtistSongs />;
        if (path.includes('/track/')) return <MainPlayer />;
        if (path.includes('/album/')) return <Albumtracks />;
        if (path.includes('/artist/')) return <ArtistTopTracks />;
        
        return <HomeBasic />;
    };
    
    return (
        <SearchProvider>
            <TrackIdProvider>
                <div className="main_Body">
                    <Sidebar/>
                    <div className="right_SideBar">
                        <Header/>
                        {renderContent()}
                    </div>
                </div>
                <FooterPlayer />
            </TrackIdProvider>
        </SearchProvider>
    );
}
