import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Context } from '../../../context/chatContext';
import Modal from '../../../Modal';
import AvatarSelect from '../../../Auth/Register/FormPage3';

const UserInfo = ({ id, showRightTab }) => {
  const { state, visitedUser, updateAvatar } = useContext(Context);
  const [avatar, setAvatar] = useState(state.auth.user.avatar);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (() => {
      visitedUser(id);
    })();
  }, [id]);

  if (!state.visitedUser) return null;

  const onSubmit = e => {
    e.preventDefault();

    updateAvatar(avatar, ({ status, payload }) => {
      if (status !== 1) {
        setError('an error occured' + String(payload));
      }
      setShowModal(false);
    });
  };

  return (
    <div className="user-info">
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
          src={state.visitedUser.avatar}
          alt="female avatar"
          className="user__avatar margin-bottom-small"
        />
        {state.auth.user._id === state.visitedUser._id && (
          <img
            src={require('../../../../images/camera.svg')}
            alt="camera icon"
            className="change-avatar"
            onClick={e => setShowModal(true)}
          />
        )}
      </figure>
      <h3 className="user__name">
        {state.visitedUser.firstname + ' ' + state.visitedUser.lastname}
      </h3>
      <span className="user__register-date">
        Joined on {moment(state.visitedUser.register_date).format('ll')}
      </span>
    </div>
  );
};

export default UserInfo;
