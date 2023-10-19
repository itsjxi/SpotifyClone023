import React, { useState } from "react";
import{BsFillPlayCircleFill,BsPauseCircleFill} from "react-icons/bs"
export function PlayButton(){

const[playState, setPlayState] = useState(true)
    function togglePlayPause(e){
        e.preventDefault();
    (playState? setPlayState(false):setPlayState(true))
        
    }


    let style =  {width: "48px",
    height:"48px",
    padding: "0px",
    color:"green", 
    borderRadius:"50%",
    backgroundColor:"#181818",
    fontSize:"12px"}

    return(
     <>
     {playState? (<BsFillPlayCircleFill onClick={(e)=>togglePlayPause(e)}
                  style={style }/>) :
        (<BsPauseCircleFill onClick={togglePlayPause}
                  style={style}/>)

        }
     </>
    

    )
}