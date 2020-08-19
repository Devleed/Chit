import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import { Context } from '../../../../context/chatContext';

const MessageBox = () => {
  const { state } = useContext(Context);
  const [typing, setTyping] = useState(null);
  // const messageEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   if (messageEndRef.current) {
  //     messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // useEffect(scrollToBottom, [state.chat]);

  useEffect(() => {
    if (state.socket) {
      state.socket.on('typing-message', userTyping => {
        setTyping(userTyping);
      });
    }
  }, [state.socket]);

  let unreadIndex = null;
  let unreadMessages = 0;

  const renderMessagesByDate = () => {
    return state.chat.selectedChat.messagesByDate
      .sort(dateSorting)
      .map((messageByDate, i) => {
        if (unreadIndex !== null) {
          unreadMessages += messageByDate.messages.length;
        }
        let isLastMessage =
          i === state.chat.selectedChat.messagesByDate.length - 1;
        return (
          <div className="by-date" key={i}>
            <span className="date">{messageByDate.date}</span>
            <div className="by-date-messages">
              <Message
                unreadIndex={unreadIndex}
                date={messageByDate.date}
                messages={messageByDate.messages}
                loggedInUser={state.auth.user._id}
                unreadMessages={unreadMessages}
                typing={isLastMessage ? typing : null}
              />
            </div>
            {/* {isLastMessage ? <div ref={messageEndRef} /> : null} */}
          </div>
        );
      });
  };

  return <div className="messages">{renderMessagesByDate()}</div>;
};

const dateSorting = (a, b) => {
  a = {
    month: Number(a.date.split('-')[0]),
    day: Number(a.date.split('-')[1]),
    year: Number(a.date.split('-')[2])
  };
  b = {
    month: Number(b.date.split('-')[0]),
    day: Number(b.date.split('-')[1]),
    year: Number(b.date.split('-')[2])
  };

  if (a.year !== b.year) return a.year - b.year;
  else if (a.month !== b.month) return a.month - b.month;
  else if (a.day !== b.day) return a.day - b.day;
};

export default MessageBox;
