import moment from 'moment';
import {
  SET_LOGGED_IN_USER,
  SET_LOGGED_IN_USER_FAIL,
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  SET_VISITED_USER,
  SET_CHAT_LIST,
  UPDATE_CHAT_LIST,
  REMOVE_FROM_CHAT_LIST,
  SET_SELECTED_CHAT,
  MESSAGE_SENDING,
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  REMOVE_MESSAGE_FROM_SELECTED_CHAT,
  ADD_CONNECTION,
  REMOVE_CONNECTION,
  SET_SOCKET,
  SET_SEARCH_RESULTS,
  SET_ERROR,
  CLEAR_ERROR,
  MESSAGE_READ,
  DESTROY_EVERY_THING,
  DESTROY_SELECTED_CHAT,
  SET_ONLINE_USERS
} from './actions/actionTypes';

export default (state, { type, payload }) => {
  switch (type) {
    // ? AUTH REDUCERS
    case SET_LOGGED_IN_USER:
      return {
        ...state,
        auth: {
          token: localStorage.getItem('auth-token'),
          isLoggedIn: true,
          user: payload,
          userLoading: false
        }
      };
    case LOGIN_USER:
    case REGISTER_USER:
      localStorage.setItem('auth-token', payload.token);
      return {
        ...state,
        auth: {
          token: payload.token,
          isLoggedIn: true,
          user: payload.user,
          userLoading: false
        }
      };
    case SET_LOGGED_IN_USER_FAIL:
    case LOGOUT_USER:
      localStorage.removeItem('auth-token');
      return {
        ...state,
        auth: {
          token: null,
          isLoggedIn: false,
          user: null,
          userLoading: false
        }
      };

    // ? CHAT LIST REDUCERS
    case SET_CHAT_LIST:
      return {
        ...state,
        chat: {
          ...state.chat,
          chatList: payload
        }
      };
    case UPDATE_CHAT_LIST:
      return {
        ...state,
        chat: {
          ...state.chat,
          chatList: [payload, ...state.chat.chatList]
        }
      };

    // ? SELECTED CHAT REDUCERS
    case SET_SELECTED_CHAT:
      return {
        ...state,
        chat: {
          ...state.chat,
          chatList: updateChatList(state.chat.chatList, payload),
          selectedChat: payload
        }
      };

    case DESTROY_SELECTED_CHAT:
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedChat: null
        }
      };

    // ? MESSAGE REDUCERS
    case MESSAGE_SENT:
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedChat: updateSelectedChat(state.chat.selectedChat, payload)
        }
      };

    case MESSAGE_SENDING:
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedChat: addMessageToChat(state.chat.selectedChat, payload)
        }
      };

    case MESSAGE_RECIEVED:
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedChat: addMessageToChat(state.chat.selectedChat, payload)
        }
      };

    case MESSAGE_READ:
      return {
        ...state,
        chat: {
          ...state.chat,
          chatList: (() => {
            if (state.chat.selectedChat) {
              for (let item of state.chat.chatList) {
                if (item.user._id === state.chat.selectedChat.user._id) {
                  item.message.status = 2;
                  break;
                }
              }
            }

            return [...state.chat.chatList];
          })(),
          selectedChat: (() => {
            if (state.chat.selectedChat) {
              return {
                ...state.chat.selectedChat,
                messagesByDate: readMessages(state.chat.selectedChat, payload)
              };
            }

            return state.chat.selectedChat;
          })()
        }
      };

    // ? SOCKET REDUCERS
    case SET_SOCKET:
      return {
        ...state,
        socket: payload
      };

    // ? SEARCH REDUCERS
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: payload
      };

    // ? VISITED USER REDUCER
    case SET_VISITED_USER:
      return {
        ...state,
        visitedUser: payload
      };

    // ? ERROR REDUCERS
    case SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          ...payload
        }
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [payload]: null
        }
      };

    case SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: [...state.onlineUsers, ...payload]
      };

    case DESTROY_EVERY_THING:
      return {
        auth: {
          token: null,
          isLoggedIn: null,
          userLoading: null,
          user: null
        },
        socket: null,
        visitedUser: null,
        chat: {
          chatList: [],
          selectedChat: null
        },
        searchResults: null,
        errors: {},
        onlineUsers: []
      };
    default:
      return state;
  }
};

// helper to add messages to chat
const addMessageToChat = (chat, message) => {
  if (chat) {
    // convert new message's date to '07/29/2020' format and then replace '/' with '-'
    const messageDate = moment(message.date).format('L').replace(/\//g, '-');
    // messageDate = '07-29-2020'

    let change;

    // loop through messagesByDate
    const finalMessages = chat.messagesByDate.map(messageByDate => {
      // if dates are equal then add message among that date messages
      if (messageByDate.date === messageDate) {
        change = true;
        messageByDate.messages = [...messageByDate.messages, message];
      }

      return messageByDate;
    });

    // no change occured in any array which means it's the first message on this date
    if (!change) {
      const newMessageByDate = {
        date: messageDate,
        messages: [message]
      };
      chat.messagesByDate = [...chat.messagesByDate, newMessageByDate];

      return chat;
    } else {
      return {
        ...chat,
        messagesByDate: finalMessages
      };
    }
  }
};

const updateChatList = (list, selectedChat) => {
  let exists;
  for (let item of list) {
    if (item.user._id === selectedChat.user._id) {
      exists = true;
      item.message.status = 2;
      break;
    }
  }

  if (!exists) {
    const item = {
      message: {
        sentBy: null,
        body: '',
        date: Date.now()
      },
      user: selectedChat.user
    };
    return [...list, item];
  }
  return list;
};

const updateSelectedChat = (chat, payloadMessage) => {
  const messageDate = moment(payloadMessage.date)
    .format('L')
    .replace(/\//g, '-');

  for (let byDate of chat.messagesByDate) {
    if (byDate.date === messageDate) {
      for (let message of byDate.messages) {
        if (message.identifier === payloadMessage.identifier) {
          message.status = payloadMessage.status;
          if (message.media) {
            message.media = payloadMessage.media;
          }
          delete message.identifier;
          break;
        }
      }
      break;
    }
  }

  return { ...chat, messagesByDate: chat.messagesByDate };
};

const readMessages = (chat, date) => {
  if (chat) {
    for (let byDate of chat.messagesByDate) {
      for (let message of byDate.messages) {
        if (message.status === 1) message.status = 2;
      }
    }
    return [...chat.messagesByDate];
  }
  return chat.messagesByDate;
};
