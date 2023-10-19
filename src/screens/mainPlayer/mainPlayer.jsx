import { useState } from "react";


export default function MainPlayer(){
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);


    // const [playlist, setPlaylist] = useState(null);
    // const [tracks, setTracks] = useState([]);
    // const { playlistId } = useParams();
  
    
  
    // useEffect(() => {
    //   fetchData(`playlists/${playlistId}`)
    //     .then((data) => {
    //       setPlaylist(data); 
    //       console.log(data,"==111=222")
    //       setTracks(data.tracks.items); 
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching playlist:", error);
    //     });
    // }, [playlistId]);
  
    // if (!playlist) {
    //   return <Loader/>;
    

    return(
        <>
        <div>Main Player</div>
   

        </>
    )
}