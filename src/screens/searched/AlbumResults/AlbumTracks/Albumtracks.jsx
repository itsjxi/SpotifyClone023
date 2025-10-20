import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../../../../ApiData/Api";
import ArtistResults from "../../ArtistResults/ArtistResults";
import TrackList from "../../../tracks/details and tracks/tracks/tracksdetails";
import AlbumTrackList from "./AlbumtrcakList";
import Loader from "../../../../shared/Loader/loader";

export default function Albumtracks(){
    const{AlbumID} = useParams()
    const[albumData,setAlbumData] =  useState(null)

  
 
    function albumTracksData(){
        fetchData(`albums/${AlbumID}/tracks`)
        .then((data)=>{
            console.log(data);
            setAlbumData(data);
        }).catch((error)=>{
            console.error('Error fetching playlist:', error);
            setAlbumData(null)
        })
    }
    useEffect(() => {
        albumTracksData();
    }, [AlbumID]);
    
    useEffect(() => {
        console.log(albumData, "albumdata");
    }, [albumData]);

   


return(
    <>
    <h2>Album result</h2>
    {albumData ? (
      <AlbumTrackList tracks={albumData.items} />
    ) : (
      <Loader />
    )}
  </>
)


}