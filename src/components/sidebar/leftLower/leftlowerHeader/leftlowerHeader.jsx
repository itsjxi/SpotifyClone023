import React from "react";
import { LuLibrary } from "react-icons/lu";
import "./leftlowerHeader.css"
import { AiOutlinePlus } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";

export default function LeftLowerHeader(){
    return(
        <>
        <div className="left_lo_Header">
            <div className="libraryheaderUpper">
                <button className="LibraryButton">
                    <span><LuLibrary style={{fontSize: "30px"}}/></span>
                    <span>Your Library</span>
                </button>
                <div><AiOutlinePlus style={{fontSize: "25px"}}/></div>
              <div><FiArrowRight style={{fontSize: "25px"}}/></div>
            </div>
            <div className="libraryheaderLower">
             <div>PlayLists</div>
             <div>Artists</div>
            </div>   
            
        </div>
        
        </>
    )
}