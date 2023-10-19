import React from "react";
import { Link } from 'react-router-dom';
import "./sidebar.css"
import PlayLists from "./leftLower/playlists";
import LeftLowerHeader from "./leftLower/leftlowerHeader/leftlowerHeader";
import { GoHome } from "react-icons/go";
import { BiSearch } from "react-icons/bi";

export default function Sidebar(){

    return(
        <>
        <div className="left_Sidebar">
           <div className="left_Upper">
   
    <nav>
                <ul>
                    <li>
                        <Link to="/"><GoHome style={{ width: "24px", height: "24px"}}/> <span>Home</span></Link>
                    </li>
                    <li>
                        <Link to="/"><BiSearch style={{ width: "24px", height: "24px"}}/><span>Search</span></Link>
                    </li>

                </ul>
            </nav>
           </div>
           <div className="left_Lower">
            <LeftLowerHeader/>
            <div className="left_lower_nav">
           <PlayLists/>
           <nav>
                <ul>
                    {/* <li>
                        <Link to="/trending">Trendings</Link>
                    </li>
                    <li>
                        <Link to="/favourite">Favourites</Link>
                    </li> */}
                </ul>
               
            </nav>
           </div>
           </div>
        </div>
        </>
    )
}