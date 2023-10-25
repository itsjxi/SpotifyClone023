// import { useState ,useEffect, useRef} from 'react'
// import axios from 'axios'
// import "./header.css"
// import { FiSearch } from "react-icons/fi";
// import SpotifyLogo from "../../images/SpotifyLogo.png"
// import { fetchData } from '../../ApiData/Api';
// import { FaUserAlt } from 'react-icons/fa';
// import SearchedField from '../searched/searched';
// import { Link } from 'react-router-dom';
// import { useSearchResults } from '../../context/searchedContext';
// import SearchType from './typeofSeach/searchtype';


import React, { useReducer, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import SpotifyLogo from '../../images/SpotifyLogo.png';
import { fetchData } from '../../ApiData/Api';
import { FaUserAlt } from 'react-icons/fa';
import SearchedField from '../searched/searched';
import { Link } from 'react-router-dom';
import { useSearchResults } from '../../context/searchedContext';
import "./header.css"

function Header() {
  const CLIENT_ID = '7bdfde888d4c4769a8ea1098483fd0f7';
  const REDIRECT_URI = 'https://musicappspotify023.netlify.app/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_TOKEN':
        return action.payload;
      case 'REMOVE_TOKEN':
        return '';
      default:
        return state;
    }
  }, '');

  const searchTypeRef = useRef('');
  const inputRef = useRef('');

  const [userName, setUserName] = useState('User');
  const { setSearchKey, setSearchType } = useSearchResults();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }
    setToken({ type: 'SET_TOKEN', payload: token });
    userData();
  }, []);

  function userData() {
    fetchData('me')
      .then((userData) => {
        setUserName(userData.display_name);
        console.log(userData, 'userdata');
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  const logout = () => {
    setToken({ type: 'REMOVE_TOKEN' });
    window.localStorage.removeItem('token');
  };

  const handleSearch = (e) => {
    console.log('handleSearch is called');
  
    const searchValue = inputRef.current.value;
    console.log(searchValue,searchTypeRef.current.value,"87238698790770--------------------")

    setSearchKey(searchValue);
    setSearchType(searchTypeRef.current.value);
    inputRef.current.value = ''
  };

  return (
    <>
      <div className="Header">
        <div className="h-Logo">
          <img src={SpotifyLogo} style={{ width: '60%' }} />
        </div>

        <div className="h-search">
          <form >
          <Link to="/searched">
              <button onClick={(e) => handleSearch(e)} type="submit">
                <FiSearch style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
            <input ref={inputRef} type="text" name="search" placeholder="What do you want to listen to?" />
          </form>
        </div>

      

        <div className="h-SignIn">
          {!token ? (
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
            >
              <button>Log In</button>
            </a>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>

        <div className="h-user">
          <FaUserAlt />
          <span>{userName}</span>
        </div>
      </div>
  
    </>
  );
}

export default Header;

