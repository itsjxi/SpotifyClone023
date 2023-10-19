import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import HomeBasic from "./Homebasic";
import Feed from "./feed";
import Trendings from "./trendings";
import HomePlayLists from "./HomePlaylists";
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



export default function Home() {
    console.log("hyyy");
    return (
        <Router>
            <TrackIdProvider>
        <div className="main_Body">
            <Sidebar/>
            <div className="right_SideBar">
                <SearchProvider>
                <Header/>
                
            
            <Switch>              
                <Route path="/" exact component={HomeBasic} />
                <Route path="/searched" component={SearchedField} />
                <Route path="/trending" component={Trendings} />
                <Route path="/playlist/:categoryId" component={HomePlayLists} />
                <Route path="/playlistTracks/:playlistId" component={PlaylistTracks} />
                <Route path="/artistssongs/:artistID" component={ArtistSongs} />
                <Route path="/track/:TrackID" component={MainPlayer} />
            </Switch>
            </SearchProvider>
            </div>
          
        </div>
        {/* <Switch>
        <Route path="/player/:trackId" component={FooterPlayer} />
      </Switch> */}
      {/* //useportal in this  */}
      {/* <FooterPlayer/>  */}
      </TrackIdProvider>
        </Router>
        
    );
}
