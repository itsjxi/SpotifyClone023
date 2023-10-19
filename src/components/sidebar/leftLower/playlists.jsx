import React, { useEffect, useState } from "react";
import { fetchData } from "../../../ApiData/Api";
import { Link } from 'react-router-dom';

export default function PlayLists(){
  
    const [playlistData, setPlayListData] = useState([])

    useEffect(()=>{
        playlist();
    },[])
    

    function playlist(){
        fetchData("me/playlists")
        .then((playlistData) => {
             console.log(playlistData)
             setPlayListData(playlistData.items)
        }
        ).catch((error) => {
            console.error('Error fetching categories:', error);
            setPlayListData([]);
        })
    }
    console.log(playlistData,"------------------")
    return(
        
       <div className="s-PlayList">
       
            {playlistData.map((item)=>{
           return (
            <Link to={`/playlistTracks/${item.id}`} style={{ textDecoration: 'none' }}>
            <div className="s-PlaylistBlock">
            <img src= {item.images[0].url}/>
            <div className="about_Playlist">
           <div className="Playlist_Name">{item.name}</div>
           <div style={{color:"rgb(179, 179, 179)"}}>Playlist . {item.owner.display_name}</div>
           </div>
           </div>
           </Link>)
            
           
           })} 
      
        
       </div>
    )
}