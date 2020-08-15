import React, { Fragment, useRef, useEffect } from 'react';
import moment from 'moment';

const Message = ({
  messages,
  loggedInUser,
  unreadIndex,
  unreadMessages,
  typing
}) => {
  const unreadRef = useRef(null);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    (() => {
      if (unreadRef.current) {
        unreadRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    })();
  }, []);

  const renderImages = media => {
    let moreToShow;
    if (media.length > 4) {
      let length = media.length;
      media = media.slice(0, 3);
      moreToShow = (
        <figure className="message-fig message-fig-more" key={length}>
          {length - 3}+
        </figure>
      );
    }

    let finalArr = media.map((item, i) => {
      return (
        <figure className="message-fig" key={i}>
          <img src={item.url} alt={item.name} className="message-image" />
        </figure>
      );
    });

    if (moreToShow) finalArr.push(moreToShow);

    return finalArr;
  };

  const renderMessageStatus = status => {
    if (status === 0) {
      return (
        <img
          src={require('../../../../../../images/clock.svg')}
          className="status-icon"
        />
      );
    } else if (status === 1) {
      return (
        <img
          src={require('../../../../../../images/single-tick.svg')}
          className="status-icon"
        />
      );
    } else if (status === 2) {
      return (
        <img
          src={require('../../../../../../images/double-tick-blue.svg')}
          className="status-icon"
        />
      );
    } else {
      return (
        <img
          src={require('../../../../../../images/message-send-error.svg')}
          className="status-icon"
        />
      );
    }
  };

  const renderMessages = () => {
    return messages.map((message, i) => {
      if (
        message.status !== 2 &&
        message.sentBy !== loggedInUser &&
        unreadIndex === null
      ) {
        unreadIndex = i;
        unreadMessages += messages.length - i;
      }
      return (
        <Fragment key={i}>
          {i === unreadIndex ? (
            <div ref={unreadRef} className="unread__messages-bar">
              {unreadMessages} unread message{unreadMessages > 1 && 's'}
            </div>
          ) : null}
          <div
            className={`message ${
              message.sentBy === loggedInUser ? 'own' : 'friend'
            }-message`}>
            <div className="message-content">
              <div className="message__body">
                <p className="message__text">{message.body}</p>
                {message.media && message.media.length !== 0 ? (
                  <div
                    className={`message-media ${
                      message.media.length > 3 ? 'message-media-composite' : ''
                    }`}>
                    {renderImages(message.media)}
                  </div>
                ) : null}
              </div>
              {message.sentBy === loggedInUser && (
                <span className="message__options">
                  <img
                    src={require('../../../../../../images/delete.svg')}
                    alt="more options"
                  />
                </span>
              )}
              <span className="message__reactions">
                <input
                  type="checkbox"
                  id={`react-check-msg-${message._id}`}
                  className="react-checkbox"
                />
                <label
                  htmlFor={`react-check-msg-${message._id}`}
                  className="react-btn">
                  <img
                    src={require('../../../../../../images/react.svg')}
                    alt="react option"
                  />
                </label>
                <span className="message__reaction">
                  <img
                    src={require('../../../../../../images/happy-2.svg')}
                    alt="happy react"
                  />
                  <img
                    src={require('../../../../../../images/surprised.svg')}
                    alt="surprised react"
                  />
                  <img
                    src={require('../../../../../../images/in-love.svg')}
                    alt="love react"
                  />
                  <img
                    src={require('../../../../../../images/unhappy.svg')}
                    alt="sad react"
                  />
                  <img
                    src={require('../../../../../../images/confused.svg')}
                    alt="confuse react"
                  />
                  <img
                    src={require('../../../../../../images/mad.svg')}
                    alt="angry react"
                  />
                </span>
              </span>
              <span className="message__date">
                {moment(message.date).format('h:mm a')}
              </span>
            </div>

            {message.sentBy === loggedInUser && (
              <div className="message-status">
                {renderMessageStatus(message.status)}
              </div>
            )}
          </div>

          {i === messages.length - 1 ? (
            <div style={{ width: '100%' }} ref={messageEndRef} />
          ) : null}
        </Fragment>
      );
    });
  };
  return (
    <Fragment>
      {renderMessages()}
      {typing && (
        <div className="message message-loading" ref={messageEndRef}>
          <div className="message__text">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Message;
