import React from "react";
import "./seachType.css"
export default function SearchType({ types, selectedType, onSelectType }) {
  return (
    <>
    <div className="search-type-container">
      {types.map((type) => (
        <div
          key={type}
          className={`search-type ${type === selectedType ? "selected" : ""}`}
          onClick={() => onSelectType(type)}
        >
          {type}
        </div>
      ))}
    </div>
    </>
  );
  
}
