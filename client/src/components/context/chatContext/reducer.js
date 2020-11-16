import moment from 'moment';
import {
  SET_LOGGED_IN_USER,
  SET_LOGGED_IN_USER_FAIL,
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  SET_CHAT_LIST,
  UPDATE_CHAT_LIST,
  SET_SELECTED_CHAT,
  MESSAGE_SENDING,
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  SET_SOCKET,
  SET_ERROR,
  CLEAR_ERROR,
  MESSAGE_READ,
  DESTROY_EVERY_THING,
  DESTROY_SELECTED_CHAT,
  SET_ONLINE_USERS,
  UPDATE_AVATAR,
  SET_USER_LASTACTIVE
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
      if (!localStorage.getItem('auth-token'))
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

    case UPDATE_AVATAR:
      return {
        ...state,
        auth: {
          ...state.auth,
          user: {
            ...state.auth.user,
            avatar: payload
          }
        }
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
        onlineUsers: payload
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
        chat: {
          chatList: [],
          selectedChat: null
        },
        errors: {},
        onlineUsers: []
      };

    case SET_USER_LASTACTIVE:
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedChat: (chat => {
            if (chat) {
              if (chat.user._id === payload._id)
                return {
                  ...chat,
                  user: { ...chat.user, lastActive: payload.lastActive }
                };
              return chat;
            }
            return null;
          })(state.chat.selectedChat)
        }
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
        const messageExist = messageByDate.messages.find(
          msg => msg._id === message._id
        );
        console.log('this message already exists =>', messageExist);
        if (!messageExist)
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
  return chat;
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
