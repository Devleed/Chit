import React, { useContext } from 'react';
import MainUserInfo from '../../User Info/index';
import { Context } from '../../../../context/chatContext';

const UserInfo = ({ showRightTab }) => {
  const { state, destroyChatMessages } = useContext(Context);

  return (
    <div className="user">
      <img
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828367/chat%20app/left-chevron_wadlp0.svg"
        className="basic-icon left-chevron box-icon"
        onClick={destroyChatMessages}
        alt="left arrow"
      />
      <img
        src={state.chat.selectedChat.user.avatar}
        alt=""
        className="chats__img"
      />
      <div className="user__info">
        <p className="user__name">
          {state.chat.selectedChat.user.firstname +
            ' ' +
            state.chat.selectedChat.user.lastname}
        </p>
        <span className="active-status">
          {/* {state.onlineUsers.includes(state.chat.selectedChat.user._id)
            ? 'online'
            : 'last active 2 minutes ago'} */}
        </span>
      </div>
      <img
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828367/chat%20app/info_daepbp.svg"
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
