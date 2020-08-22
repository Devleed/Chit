import createContext from '../createContext';
import reducer from './reducer';
import actions from './actions';

const initialState = {
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
  onlineUsers: [],
  errors: {}
};

export const { Context, Provider } = createContext(
  reducer,
  actions,
  initialState
);
