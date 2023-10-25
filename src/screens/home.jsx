import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
    
    console.log("hyyy");
    return (
        <TrackIdProvider>
        <Router>
             
           
        
        <div className="main_Body">
            <Sidebar/>
            <div className="right_SideBar">
               
                <Header/>
                
               
                <Switch>
                          
                <Route path="/" exact component={HomeBasic} />
                <Route path="/searched" component={SearchedField} />
                <Route path="/trending" component={Trendings} />
                <Route path="/playlist/:categoryId" component={HomePlayLists} />
                <Route path="/playlistTracks/:playlistId" component={PlaylistTracks} />
                <Route path="/artistssongs/:artistID" component={ArtistSongs} />
                <Route path="/track/:TrackID" component={MainPlayer} />
                <Route path="/album/:AlbumID" component={Albumtracks}/>
                <Route path="/artist/:artistId" component={ArtistTopTracks}/>
                </Switch>
          
            </div>
          
        </div>
     
      
      <FooterPlayer />
     
      
        </Router>
        </TrackIdProvider>
        
    );
}
