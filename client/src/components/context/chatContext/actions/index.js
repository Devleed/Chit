// import cheerio from 'cheerio';
// import fetch from 'node-fetch';
// import getUrls from 'get-urls';
import API from '../../../../utils/api';
import {
  SET_LOGGED_IN_USER,
  SET_LOGGED_IN_USER_FAIL,
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  SET_VISITED_USER,
  SET_CHAT_LIST,
  SET_SELECTED_CHAT,
  MESSAGE_SENDING,
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  ADD_CONNECTION,
  SET_SOCKET,
  MESSAGE_READ,
  DESTROY_EVERY_THING,
  DESTROY_SELECTED_CHAT,
  SET_ONLINE_USERS,
  UPDATE_AVATAR
} from './actionTypes';

const setOnlineUser = (socket, user, cb) => {
  socket.emit('user-online', user, cb);
};

// ? visited user
const visitedUser = (state, dispatch) => {
  return async id => {
    if (id === state.auth.user._id)
      dispatch({ type: SET_VISITED_USER, payload: state.auth.user });
    else if (id === state.chat.selectedChat.user._id) {
      dispatch({
        type: SET_VISITED_USER,
        payload: state.chat.selectedChat.user
      });
    }
  };
};
// ? load user
const loadUser = (state, dispatch) => {
  return async cb => {
    try {
      // look for token in localstorage
      const token = localStorage.getItem('auth-token');

      if (!token) {
        // if does not exist set logged in user fail
        dispatch({ type: SET_LOGGED_IN_USER_FAIL });
        cb({ status: 1 });
      } else {
        const config = {
          headers: {
            'auth-token': token
          }
        };
        // send request and recieve response
        const { data } = await API.get('/auth/user', config);

        setOnlineUser(state.socket, data, () => {
          dispatch({ type: SET_LOGGED_IN_USER, payload: data });
          cb({ status: 1, payload: data });
        });
      }
    } catch (error) {
      console.error(error);

      // if request failed call callback and alert component
      cb({ status: 0, payload: error });
    }
  };
};

// ? register user
const registerUser = (state, dispatch) => {
  return data => {
    dispatch({
      type: REGISTER_USER,
      payload: { token: localStorage.getItem('auth-token'), user: data }
    });
  };
};

// ? login user
const loginUser = (state, dispatch) => {
  return async (body, cb) => {
    try {
      const { data } = await API.post('/auth/login', body);

      console.log(data);

      setOnlineUser(state.socket, data.user, () => {
        dispatch({ type: LOGIN_USER, payload: data });
        cb({ status: 1, payload: data });
      });
    } catch (error) {
      if (error.response) {
        cb({ status: 0, payload: error.response.data });
      }
    }
  };
};

// ? logout user
const logoutUser = (state, dispatch) => {
  return cb => {
    dispatch({ type: LOGOUT_USER });
    cb();
  };
};

// ? get and set selected chat
const getChatMessages = ({ auth }, dispatch) => {
  return async (id, cb) => {
    try {
      const config = {
        headers: {
          'auth-token': auth.token
        }
      };
      const { data } = await API.get(`/message/${id}`, config);

      dispatch({ type: SET_SELECTED_CHAT, payload: data });

      cb({ status: 1, payload: data });
    } catch (error) {
      console.error(error);
      cb({ status: 0, payload: error });
    }
  };
};

// ? destroy chat messages
const destroyChatMessages = (state, dispatch) => {
  return () => {
    dispatch({ type: DESTROY_SELECTED_CHAT });
  };
};

// ? add message to selected chat
const sendMessage = (state, dispatch) => {
  return (messageData, cb) => {
    // scrape meta data
    // const scrapedData = await scrapeMetaTags(messageData.textBody);

    // attach a unique message identifier
    messageData.identifier = Math.floor(Math.random() * 100000);

    // create dummy message to update state
    let sendingMessage = {
      body: messageData.textBody,
      media: messageData.media,
      date: Date.now(),
      sentBy: state.auth.user._id,
      status: 0,
      identifier: messageData.identifier
    };

    // attach media if there's any
    if (messageData.media) sendingMessage.media = messageData.media;

    // update the state with dummy message
    dispatch({ type: MESSAGE_SENDING, payload: sendingMessage });

    // message callback
    const messagecb = response => {
      // check if it's success or failure
      if (response.status === 1) {
        // success
        dispatch({ type: MESSAGE_SENT, payload: response.payload });
        cb(response);
      } else if (response.status === 0) {
        // fail
        cb(response);
      }
    };

    // emit message
    state.socket.emit(
      'private-message',
      {
        reciever: state.chat.selectedChat.user._id,
        messageData
      },
      messagecb
    );
  };
};

// ? add message to selected chat
const recieveMessage = (state, dispatch) => {
  return (message, cb) => {
    console.log('recieve message action called');
    dispatch({ type: MESSAGE_RECIEVED, payload: message });
    cb();
  };
};

// ? tells connected user that his messages are read
const messagesAreRead = (state, dispatch) => {
  return date => {
    dispatch({ type: MESSAGE_READ, payload: date });
  };
};

// ? tells current user he has read messages
const readMessage = (state, dispatch) => {
  return () => {
    const socketcb = response => {
      if (response.status === 1) {
        console.log('successfully read message');
        dispatch({ type: MESSAGE_READ });
      } else if (response.status === 0) {
        console.log(
          'an error occured while reading message =>',
          response.payload
        );
      }
    };
    state.socket.emit(
      'message-read',
      { connectedUser: state.chat.selectedChat.user._id },
      socketcb
    );
  };
};

// ? get and set chat list
const getChatList = ({ auth }, dispatch) => {
  return async cb => {
    try {
      const config = {
        headers: {
          'auth-token': auth.token
        }
      };

      const { data } = await API.get('/message/chats', config);

      dispatch({ type: SET_CHAT_LIST, payload: data });

      cb({ status: 1, payload: data });
    } catch (error) {
      console.error(error);
      cb({ status: 0, payload: error });
    }
  };
};

// * add to chat list
const addUserToChatList = (state, dispatch) => {
  return async (id, cb) => {
    try {
      const config = {
        headers: {
          'auth-token': state.auth.token
        }
      };

      const messages = await API.get(`/message/${id}`, config);
      dispatch({ type: SET_SELECTED_CHAT, payload: messages.data });

      cb({ status: 1, payload: messages });
    } catch (error) {
      console.error(error);
      cb({ status: 0, payload: error });
    }
  };
};

const updateAvatar = (state, dispatch) => {
  return async (avatar, cb) => {
    try {
      const { data } = await API.post(
        '/user/set/avatar',
        { avatar },
        {
          headers: {
            'auth-token': state.auth.token
          }
        }
      );
      dispatch({ type: UPDATE_AVATAR, payload: data.avatar });
      cb({ status: 1 });
    } catch (error) {
      console.error(error);
      cb({ status: 1, payload: error });
    }
  };
};

// ! ? add connection
const addConnection = (State, dispatch) => {
  return async (id, cb) => {
    try {
      const { data } = await API.get(`/user/${id}`);

      dispatch({ type: ADD_CONNECTION, payload: data });

      cb({ status: 1, payload: data });
    } catch (error) {
      console.error(error);
      cb({ status: 0, payload: error });
    }
  };
};

// ? set socket
const setSocket = (state, dispatch) => {
  return socket => {
    dispatch({ type: SET_SOCKET, payload: socket });
  };
};

// ! destruction
const destroyEverything = (state, dispatch) => {
  return () => {
    dispatch({ type: DESTROY_EVERY_THING });
  };
};

const setOnlineUsers = (state, dispatch) => {
  return onlineUsers => {
    dispatch({ type: SET_ONLINE_USERS, payload: onlineUsers });
  };
};

// ? HELPERS
// const scrapeMetaTags = text => {
//   const urls = Array.from(getUrls(text));

//   if (urls.length === 0) return {};

//   const requests = urls.map(async url => {
//     const res = await fetch(url);
//     const html = await res.text();

//     const $ = cheerio.load(html);

//     const getMetaTag = name =>
//       $(`meta[name=${name}]`).attr('content') ||
//       $(`meta[property="og:${name}"]`).attr('content') ||
//       $(`meta[property="twitter:${name}"]`).attr('content');

//     return {
//       url,
//       title: $('title').first().text(),
//       description: getMetaTag('description'),
//       image: getMetaTag('image'),
//       author: getMetaTag('author'),
//       favicon: $('link[rel="shortcut icon"]').attr('content')
//     };
//   });

//   return Promise.all(requests);
// };

export default {
  addUserToChatList,
  loadUser,
  registerUser,
  loginUser,
  logoutUser,
  getChatMessages,
  sendMessage,
  addConnection,
  getChatList,
  recieveMessage,
  setSocket,
  visitedUser,
  readMessage,
  messagesAreRead,
  destroyEverything,
  destroyChatMessages,
  setOnlineUsers,
  updateAvatar
};
