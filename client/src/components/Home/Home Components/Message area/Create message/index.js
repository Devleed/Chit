import React, { useState, useContext } from 'react';
import { Context } from '../../../../context/chatContext';
import Textarea from './Textarea';
import Alert from '../../../../Alert Box';

const CreateMsg = () => {
  const { state, sendMessage, getChatList, readMessage } = useContext(Context);
  const [messageVal, setMessageVal] = useState('');
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  // * FILE ON CHANGE
  const onChange = e => {
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach(file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setFiles([
            ...files,
            {
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result
            }
          ]);
        };
        reader.onerror = () => {
          alert('unable to upload file');
        };
      });
    }
  };

  // * TEXTAREA ON FOCUS
  const onFocus = () => {
    let messagesByDateLength = state.chat.selectedChat.messagesByDate.length;
    if (messagesByDateLength) {
      let lastMessageByDate =
        state.chat.selectedChat.messagesByDate[messagesByDateLength - 1];
      let lastMessage =
        lastMessageByDate.messages[lastMessageByDate.messages.length - 1];
      if (
        lastMessage.status !== 2 &&
        lastMessage.sentBy !== state.auth.user._id
      )
        readMessage();
    }
  };

  // * SEND MESSAGE TO USER
  const sendMessageToUser = () => {
    timeoutFunction();
    let messageData = {
      textBody: messageVal
    };
    if (files.length !== 0) messageData.media = files;
    sendMessage(messageData, messageCallback);
    setMessageVal('');
    setFiles([]);
  };

  let errorTimeout;

  // * CALLBACK AFTER MESSAGE SENT OR AN ERROR OCCURRED
  const messageCallback = ({ status, payload }) => {
    if (status !== 1) {
      console.log(
        'an error occured while sending while sending message =>',
        payload
      );
      setError('An error occured, ' + String(payload));
      if (errorTimeout) clearTimeout(errorTimeout);
      errorTimeout = setTimeout(() => {
        setError(null);
      }, 5000);
    } else getChatList(chatListCallback);
  };

  const chatListCallback = response => {
    if (response.status !== 1) {
      setError('An error occured, ' + String(response.payload));
    }
  };

  // * PREVIEW IMAGES
  const previewImages = () => {
    return files.map((file, i) => {
      return (
        <figure className="image-figure" key={i}>
          <img src={file.url} alt={file.name} className="create-image" />
          <span
            className="image-cancel-icon"
            onClick={e => {
              setFiles(files.filter(item => item.name !== file.name));
            }}>
            &times;
          </span>
        </figure>
      );
    });
  };

  let typing = false;
  let timeout;

  // * TYPING TIMEOUT FUNCTION
  const timeoutFunction = () => {
    typing = false;
    state.socket.emit('typing-message', {
      reciever: state.chat.selectedChat.user._id,
      typing
    });
  };

  // * TEXTAREA ON KEYUP
  const onKeyUp = e => {
    if (typing === false) {
      typing = true;
      state.socket.emit('typing-message', {
        reciever: state.chat.selectedChat.user._id,
        typing
      });
      timeout = setTimeout(timeoutFunction, 5000);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunction, 5000);
    }
  };

  return (
    <div className="create-msg">
      {error ? <Alert heading="message sending error" message={error} /> : null}
      <div className="input-content">
        <input
          type="file"
          className="msg-file-upload"
          id="msg-file-upload"
          onChange={onChange}
        />
        <label htmlFor="msg-file-upload">
          <img
            src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828370/chat%20app/photo_liowtl.svg"
            alt="upload icon"
            className="basic-icon"
          />
        </label>
        <Textarea
          value={messageVal}
          setValue={setMessageVal}
          submit={sendMessageToUser}
          placeholder="say hello .. !!"
          onFocus={onFocus}
          onKeyUp={onKeyUp}
        />
        <img
          src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828372/chat%20app/send_mbjv2l.svg"
          alt="send icon"
          className="basic-icon"
          onClick={e => sendMessageToUser()}
        />
      </div>
      {files.length ? (
        <div className="image-preview">{previewImages()}</div>
      ) : null}
    </div>
  );
};

export default CreateMsg;
