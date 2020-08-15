import React, { useContext, Fragment, useEffect, useState } from 'react';
import UserInfo from './User Info';
import MessageBox from './Message box';
import CreateMsg from './Create message';
import OverlayLoader from '../../../Overlay loader';
import { Context } from '../../../context/chatContext';
import Alert from '../../../Alert Box';

const MessageArea = ({ showRightTab }) => {
  const { state, recieveMessage, getChatList, messagesAreRead } = useContext(
    Context
  );
  const [error, setError] = useState(null);

  const chatListCallback = response => {
    if (response.status !== 1) {
      setError('server error, ', String(response.payload));
    }
  };

  useEffect(() => {
    if (state.socket) {
      state.socket.on('private-message', message => {
        console.log('private message listened on client');
        recieveMessage(message, () => getChatList(chatListCallback));
      });
      state.socket.on('message-read', date => {
        console.log('the user just read your messages');
        messagesAreRead(date);
      });
    }
  }, []);

  return (
    <div className="msg-area">
      {error ? <Alert heading="an error occured" message={error} /> : null}
      {state.chat.selectedChat ? (
        <Fragment>
          <UserInfo showRightTab={showRightTab} />
          <MessageBox />
          <CreateMsg />
        </Fragment>
      ) : (
        <div className="message-cta">
          no chat is selected, select a chat to display messages!
        </div>
      )}
    </div>
  );
};

export default MessageArea;
