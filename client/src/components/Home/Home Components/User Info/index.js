import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Context } from '../../../context/chatContext';
import Modal from '../../../Modal';
import AvatarSelect from '../../../Auth/Register/FormPage3';
import Alert from '../../../Alert Box';

const UserInfo = ({ id, showRightTab }) => {
  const { state, updateAvatar } = useContext(Context);
  const [avatar, setAvatar] = useState(state.auth.user.avatar);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visitedUser, setVisitedUser] = useState(null);

  useEffect(() => {
    if (id === state.auth.user._id) setVisitedUser(state.auth.user);
    else if (id === state.chat.selectedChat.user._id) {
      setVisitedUser(state.chat.selectedChat.user);
    }

    return () => {
      setVisitedUser(null);
    };
  }, [id]);

  if (!visitedUser) return null;

  const onSubmit = e => {
    e.preventDefault();

    updateAvatar(avatar, ({ status, payload }) => {
      if (status !== 1) {
        setError('an error occured' + String(payload));
      } else if (status === 1 && state.auth.user._id === visitedUser._id) {
        setVisitedUser({ ...visitedUser, avatar: payload });
      }
      setShowModal(false);
    });
  };

  return (
    <div className="user-info">
      {error && <Alert heading="try again later" message={error} />}
      {showModal ? (
        <Modal show={showModal} setShowModal={setShowModal}>
          <div className="modal-content">
            <img
              src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828360/chat%20app/close_eczum9.svg"
              className="modal-close-icon basic-icon box-icon"
              alt="close icon"
              onClick={e => setShowModal(false)}
            />
            <AvatarSelect
              defaultAvatar={avatar}
              setAvatar={setAvatar}
              onSubmit={onSubmit}
            />
          </div>
        </Modal>
      ) : null}
      <img
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828360/chat%20app/close_eczum9.svg"
        className="basic-icon box-icon"
        alt="close icon"
        onClick={() => showRightTab(null)}
      />
      <figure className="user-avatar">
        <img
          src={visitedUser.avatar}
          alt="female avatar"
          className="user__avatar margin-bottom-small"
        />
        {state.auth.user._id === visitedUser._id && (
          <img
            src={require('../../../../images/camera.svg')}
            alt="camera icon"
            className="change-avatar"
            onClick={e => setShowModal(true)}
          />
        )}
      </figure>
      <h3 className="user__name">
        {visitedUser.firstname + ' ' + visitedUser.lastname}
      </h3>
      <span className="user__register-date">
        Joined on {moment(visitedUser.register_date).format('ll')}
      </span>
    </div>
  );
};

export default UserInfo;
