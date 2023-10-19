import React, { useEffect, useState } from "react";
import { fetchData } from "../ApiData/Api";
import "./homebasic.css"
import { Link } from 'react-router-dom';

export default function HomeBasic(){
  
    const [categoriesData, setcategoriesData] = useState([])
   console.log("scuigsicgsicgisa")
    useEffect(()=>{
        categories();
    },[])
    

    function categories(){
        fetchData("browse/categories")
        .then((categoriesData) => {
             console.log(categoriesData)
             setcategoriesData(categoriesData.categories.items)
        }
        ).catch((error) => {
            console.error('Error fetching categories:', error);
            setcategoriesData([]);
        })
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    console.log(categoriesData,"000000")
    return(
        <>
        
        <div className="homeCategories">
        <h2>Browse All</h2>
       <div className="s-categories">
          
            {categoriesData.map((item)=>{
                const randomColor = getRandomColor();
           return (
            <Link to={`/playlist/${item.id}`}>
                 <div className="categoryBlock" style={{ backgroundColor: randomColor }} >
            <img src= {item.icons[0].url}/>
            <span className="category_Name">{item.name}</span>
           </div>
                
                 </Link>
           
           )
           
           })} 
      
        
       </div>
       </div>
       </>
    )
}