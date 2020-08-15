import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Context } from '../../../context/chatContext';
import BasicLoader from '../../../Basic loader';

const getDate = date => {
  if (moment(date).format('MMM Do YY') === moment().format('MMM Do YY')) {
    return moment(date).format('h:mm a');
  } else if (moment(date).format('MMM') === moment().format('MMM')) {
    return moment(date).format('dddd');
  } else return moment(date).format('MMM Do YY');
};

const ChatItem = ({ item, callback }) => {
  const [messagesLoading, setMessagesLoading] = useState(null);
  const { state, getChatMessages } = useContext(Context);

  let chatSelected =
    state.chat.selectedChat &&
    state.chat.selectedChat.user._id === item.user._id;

  useEffect(() => {
    if (chatSelected && messagesLoading) {
      setMessagesLoading(false);
    }
    return () => {
      setMessagesLoading(null);
    };
  }, [state.chat]);

  let unread =
    item.message.body !== '' &&
    item.message.status !== 2 &&
    item.message.sentBy !== state.auth.user._id;

  let classNames = `chats__item ${unread && 'chats__item-unread'} ${
    chatSelected && 'chats__item-selected'
  }`;
  return (
    <li
      className={classNames}
      onClick={e => {
        setMessagesLoading(true);
        getChatMessages(item.user._id, callback);
      }}
      key={item.user._id}>
      {item.user.username === 'Waleed' ? (
        <img
          src={`${require(`../../../../images/admin.svg`)}`}
          alt="admin avatar"
          className="chats__img"
        />
      ) : (
        <img
          src={`${require(`../../../../images/${item.user.gender}-avatar.svg`)}`}
          alt={`${item.user.gender} avatar`}
          className="chats__img"
        />
      )}
      <div className="chats__user">
        <p className="chats__name">{`${item.user.firstname} ${item.user.lastname}`}</p>
        <span className="chats__message">
          {item.message.sentBy === state.auth.user._id ? 'you: ' : ' '}
          {item.message.body}
        </span>
      </div>
      {unread ? <span className="unread__messages"></span> : null}
      <span className="chats__date">
        {messagesLoading ? <BasicLoader /> : getDate(item.message.date)}
      </span>
    </li>
  );
};

export default ChatItem;
