import React, { useEffect, useState } from "react";
import { fetchData } from "../../ApiData/Api";
import { useParams,Link } from 'react-router-dom';
import "./HomePlayLists.css"


export default function HomePlayLists({data}){
 const[playlistData, setplaylistData] = useState([])
 const { categoryId } = useParams();

 useEffect(()=>{
    playlist();
 },[categoryId])


    function playlist(){
      if(data){
        setplaylistData(data);
      } else{
        fetchData(`browse/categories/${categoryId}/playlists`)
        .then((playlistData) => {
             console.log(playlistData.playlists.items)
             setplaylistData(playlistData.playlists.items)
             console.log(playlistData,"======")
        }
        ).catch((error) => {
            console.error('Error fetching playlist:', error);
            setplaylistData([]);
        })
      }
    }
     
 

    console.log(playlistData,"6576979879087969")

    
    return(
        
     <>
         <div>
          <h2>Playlists</h2>
      <div className="playlist-container" >
        {playlistData.map((playlist, index) => (
            <Link to={`/playlistTracks/${playlist.id}`} className="playlist-item-link" key={index}>
            <div className="playlist-item">
              <img src={playlist.images[0].url} alt={playlist.name} />
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
     </>
    )
}