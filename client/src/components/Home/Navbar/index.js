import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import UserInfo from '../Home Components/User Info';
import Alert from '../../Alert Box';
import Settings from '../Home Components/Settings';
import { Context } from '../../context/chatContext';

const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

const Navbar = ({ showRightTab }) => {
  const {
    state,
    searchUser,
    addUserToChatList,
    logoutUser,
    destroyEverything
  } = useContext(Context);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  let cancelToken;

  useEffect(() => {
    return () => {
      setError(null);
      setLoading(null);
    };
  }, []);

  const finalCallback = response => {
    if (response.status !== 1) {
      setError(response.payload);
    }
    setLoading(false);
  };

  const onKeyPress = e => {
    setLoading(true);
    if (e.which === 13) searchUser(searchValue, cancelToken, finalCallback);
  };

  const search = debounce(function () {
    // if cancel token exists it means that request has been made before
    if (typeof cancelToken != typeof undefined)
      // so cancel the previous request
      cancelToken.cancel('operation cancelled bcs of new request');

    // assign cancel token
    cancelToken = axios.CancelToken.source();

    // call search function
    searchUser(searchValue, cancelToken, setLoading);
  }, 1500);

  const renderSearchResults = () => {
    if (searchValue === '') return null;
    if (loading) return <p className="result_msg">loading...</p>;
    else if (state.searchResults) {
      if (state.searchResults.msg)
        return <p className="result_msg">{state.searchResults.msg}</p>;
      return (
        <li
          className="chats__item"
          onClick={e => {
            setSearchValue('');
            addUserToChatList(state.searchResults._id, finalCallback);
          }}>
          <img
            src={require(`../../../images/${state.searchResults.gender}-avatar.svg`)}
            alt=""
            className="chats__img"
          />
          <p className="chats__name">{`${state.searchResults.firstname} ${state.searchResults.lastname}`}</p>
        </li>
      );
    }
  };

  return (
    <nav className="nav">
      {error ? <Alert heading="An error occured" message={error} /> : null}
      <h2 className="logo">LOGO</h2>
      <div className="search">
        <input
          type="text"
          className="search__input"
          placeholder="Add connections.."
          id="connection-input"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyPress={onKeyPress}
          // onKeyUp={search}
        />
        <span className="focus-border"></span>
        <img
          src={require('../../../images/search.svg')}
          alt="search icon"
          className="basic-icon"
          onClick={e => searchUser(searchValue)}
        />
        {searchValue !== '' ? (
          <div className="search__results">{renderSearchResults()}</div>
        ) : null}
      </div>
      <ul className="nav__items">
        <li
          className="nav__item"
          onClick={e =>
            showRightTab(
              <UserInfo id={state.auth.user._id} showRightTab={showRightTab} />
            )
          }>
          <img
            src={require('../../../images/profile.svg')}
            alt="profile"
            className="basic-icon box-icon"
          />
        </li>
        <li
          className="nav__item"
          onClick={e => showRightTab(<Settings showRightTab={showRightTab} />)}>
          <img
            src={require('../../../images/settings.svg')}
            alt="settings"
            className="basic-icon box-icon"
          />
        </li>
        <li
          className="nav__item"
          onClick={() => {
            logoutUser(destroyEverything);
            state.socket.emit('user-offline', state.auth.user._id);
          }}>
          <img
            src={require('../../../images/logout.svg')}
            alt="about"
            className="basic-icon box-icon"
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
