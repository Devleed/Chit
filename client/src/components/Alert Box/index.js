import React from 'react';

const Alert = ({ heading, message, type }) => {
  return (
    <div className="alert">
      <img
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828369/chat%20app/message-send-error_nfboqz.svg"
        className="basic-icon"
      />
      <div className="alert-text">
        <h3 className="alert-heading">{heading}</h3>
        <p className="alert-message">{message}</p>
      </div>
      {/* <span className="cross-icon">&times;</span> */}
    </div>
  );
};

export default Alert;
