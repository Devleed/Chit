import React, { useContext, useState, useEffect } from 'react';
import UserInfo from '../Home Components/User Info';
import Alert from '../../Alert Box';
import Settings from '../Home Components/Settings';
import { Context } from '../../context/chatContext';
import BasicLoader from '../../Basic loader';
import API from '../../../utils/api';

// const debounce = (fn, delay) => {
//   let timer = null;
//   return function (...args) {
//     const context = this;
//     timer && clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(context, args);
//     }, delay);
//   };
// };

const Navbar = ({ showRightTab }) => {
  const {
    state,
    addUserToChatList,
    logoutUser,
    destroyEverything
  } = useContext(Context);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [searchUser, setSearchUser] = useState(null);

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
  };

  const onKeyPress = async e => {
    if (e.which === 13) {
      setLoading(true);
      // searchUser(searchValue, cancelToken, finalCallback);
      // send request and recieve response
      try {
        const { data } = await API.get(`/user/search/${searchValue}`, {
          headers: {
            'auth-token': state.auth.token
          }
        });
        setSearchUser(data);
      } catch (error) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    }
  };

  const renderSearchResults = () => {
    if (searchValue === '') return null;
    if (loading)
      return (
        <div className="search-loader chats__item">
          <BasicLoader />
        </div>
      );
    else if (searchUser) {
      if (searchUser.msg) return <p className="result_msg">{searchUser.msg}</p>;
      return (
        <li
          className="chats__item"
          onClick={e => {
            setSearchValue('');
            addUserToChatList(searchUser._id, finalCallback);
            setSearchUser(null);
          }}>
          <img src={searchUser.avatar} alt="" className="chats__img" />
          <p className="chats__name">
            {searchUser.firstname + ' ' + searchUser.lastname}
          </p>
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
          src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828372/chat%20app/search_cwnwnz.svg"
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
            src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828370/chat%20app/profile_ycwpga.svg"
            alt="profile"
            className="basic-icon box-icon"
          />
        </li>
        <li
          className="nav__item"
          onClick={e => showRightTab(<Settings showRightTab={showRightTab} />)}>
          <img
            src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828373/chat%20app/settings_hefkmo.svg"
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
            src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828368/chat%20app/logout_vq7t6i.svg"
            alt="about"
            className="basic-icon box-icon"
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
