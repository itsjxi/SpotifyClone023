import React, { useEffect, useState } from "react";
import { fetchData } from "../../../ApiData/Api";
import { useParams } from "react-router-dom";
import "../details and tracks/PlaylistRendeing/playlisttracks.css"
import PlaylistDetails from "./PlaylistRendeing/playlistdetails";
import TrackList from "./tracks/tracksdetails";
import Loader from "../../../shared/Loader/loader";
import FooterPlayer from "../../FooterPlayer/FooterPlayer";


export default function PlaylistTracks() {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const { playlistId } = useParams();

  

  useEffect(() => {
   
    fetchData(`playlists/${playlistId}`)
      .then((data) => {
        setPlaylist(data); 
        console.log(data,"==111=222")
        setTracks(data.tracks.items); 
      })
      .catch((error) => {
        console.error("Error fetching playlist:", error);
      });
  }, [playlistId]);

  if (!playlist) {
    return <Loader/>;
  }


  return (
    <>
    <PlaylistDetails playlist={playlist}/>
    <TrackList tracks={tracks}/>
    <FooterPlayer tracks={tracks}/>
    </>
   
  );
}
