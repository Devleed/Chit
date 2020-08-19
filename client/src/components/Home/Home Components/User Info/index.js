import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { Context } from '../../../context/chatContext';

const UserInfo = ({ id, showRightTab }) => {
  const { state, visitedUser } = useContext(Context);

  useEffect(() => {
    (() => {
      visitedUser(id);
    })();
  }, [id, visitedUser]);

  if (!state.visitedUser) return null;

  return (
    <div className="user-info">
      <img
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828360/chat%20app/close_eczum9.svg"
        className="basic-icon box-icon"
        alt="close icon"
        onClick={() => showRightTab(null)}
      />
      <img
        src={state.visitedUser.avatar}
        alt="female avatar"
        className="user__avatar margin-bottom-small"
      />
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
