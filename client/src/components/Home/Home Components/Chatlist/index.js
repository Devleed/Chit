import React, { useContext, useEffect, useState } from 'react';
import OverlayLoader from '../../../Overlay loader';
import { Context } from '../../../context/chatContext';
import Alert from '../../../Alert Box';
import ChatItem from './ChatItem';

const ChatList = () => {
  const { state, getChatList } = useContext(Context);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const finalCallback = response => {
    if (response.status !== 1) {
      setError(response.payload);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getChatList(finalCallback);

    return () => {
      setError(null);
      setLoading(null);
    };
  }, []);

  const renderChatItem = () => {
    // map through each chat item
    return state.chat.chatList.sort(sortChatList).map((item, i) => {
      return <ChatItem key={i} item={item} callback={finalCallback} />;
    });
  };

  return (
    <div className="chats">
      {error ? <Alert heading="an error occured" message={error} /> : null}
      {loading ? (
        <OverlayLoader />
      ) : state.chat.chatList.length === 0 && loading === false ? (
        <div className="chat-cta">
          <label htmlFor="connection-input" className="cta-label">
            add connection
          </label>
        </div>
      ) : (
        <ul className="chats__list">{renderChatItem()}</ul>
      )}
    </div>
  );
};

const sortChatList = (a, b) => b.message.date - a.message.date;

export default ChatList;
