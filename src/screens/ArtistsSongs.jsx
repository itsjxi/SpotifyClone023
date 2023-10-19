

import React, { useEffect, useState } from "react";
import { fetchData } from "../ApiData/Api";
import { useParams } from 'react-router-dom';

export default function ArtistSongs(){
 const[playlistData, setplaylistData] = useState(null)
 const { artistID } = useParams();

 useEffect(()=>{
    playlist();
 },[])


    function playlist(){
        fetchData(`me/player`)
        .then((playlistData) => {
             console.log(playlistData)
             setplaylistData(playlistData)
        }
        ).catch((error) => {
            console.error('Error fetching playlist:', error);
            setplaylistData([]);
        })
    }
    console.log(artistID,"-----")
    console.log(playlistData,"6576979879087969")

    
    return(
        
       <div>
        Artists and songs
       </div>
    )
}