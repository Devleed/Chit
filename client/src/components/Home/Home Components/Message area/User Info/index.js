import React, { useContext } from 'react';
import MainUserInfo from '../../User Info/index';
import { Context } from '../../../../context/chatContext';

const UserInfo = ({ showRightTab }) => {
  const { state, destroyChatMessages } = useContext(Context);

  return (
    <div className="user">
      <img
        src={require('../../../../../images/left-chevron.svg')}
        className="basic-icon left-chevron box-icon"
        onClick={destroyChatMessages}
      />
      <img
        src={require(`../../../../../images/${state.chat.selectedChat.user.gender}-avatar.svg`)}
        alt=""
        className="chats__img"
      />
      <div className="user__info">
        <p className="user__name">{`${state.chat.selectedChat.user.firstname} ${state.chat.selectedChat.user.lastname}`}</p>
        <span className="active-status">
          {/* {state.onlineUsers.includes(state.chat.selectedChat.user._id)
            ? 'online'
            : 'last active 2 minutes ago'} */}
        </span>
      </div>
      <img
        src={require('../../../../../images/info.svg')}
        alt="info"
        className="basic-icon box-icon"
        onClick={e =>
          showRightTab(
            <MainUserInfo
              id={state.chat.selectedChat.user._id}
              showRightTab={showRightTab}
            />
          )
        }
      />
    </div>
  );
};

export default UserInfo;
