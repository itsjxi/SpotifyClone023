import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../../../../ApiData/Api";
import ArtistResults from "../../ArtistResults/ArtistResults";

export default function ArtistTopTracks(){
    const{artistId} = useParams()
    const[ArtistData,setArtistData] =  useState([])

  
 
    function artistTracksData(){
        console.log("artistdata")
        console.log(artistId)
        fetchData(`artists/0TnOYISbd1XYRBk9myaseg/top-tracks`)
        .then((data)=>{
            console.log(data);
            setArtistData(data);
        }).catch((error)=>{
            console.error('Error fetching playlist:', error);
           
        })
    }
    useEffect(() => {
        artistTracksData();
    }, [artistId]);
     


return(
    <>
    <h2>Artists Track results</h2>
    
    </>
)


}