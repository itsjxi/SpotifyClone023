


import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import SpotifyLogo from '../../images/SpotifyLogo.png';
import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSearchResults } from '../../context/searchedContext';
import { loginWithSpotify, logoutUser } from '../../features/auth/authSlice';
import "./header.css"

function Header() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { setSearchKey, setSearchType } = useSearchResults();
  
  const inputRef = useRef('');

  const handleLogin = () => {
    dispatch(loginWithSpotify());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleSearch = (e) => {
    const searchValue = inputRef.current.value;
    setSearchKey(searchValue);
    setSearchType('track'); // Default search type
    inputRef.current.value = '';
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
          {!isAuthenticated ? (
            <button onClick={handleLogin}>Log In</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>

        <div className="h-user">
          <FaUserAlt />
          <span>{user?.displayName || 'User'}</span>
        </div>
      </div>
  
    </>
  );
}

export default Header;

