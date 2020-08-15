import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { Context } from '../../../context/chatContext';

const UserInfo = ({ id, showRightTab }) => {
  const { state, visitedUser } = useContext(Context);

  useEffect(() => {
    (() => {
      visitedUser(id);
    })();
  }, [id]);

  if (!state.visitedUser) return null;

  return (
    <div className="user-info">
      <img
        src={require('../../../../images/close.svg')}
        className="basic-icon box-icon"
        alt="close icon"
        onClick={() => showRightTab(null)}
      />
      <img
        src={require(`../../../../images/${state.visitedUser.gender}-avatar.svg`)}
        alt="female avatar"
        className="user__avatar margin-bottom-small"
      />
      <h3 className="user__name">{`${state.visitedUser.firstname} ${state.visitedUser.lastname}`}</h3>
      <span className="user__register-date">
        Joined on {moment(state.visitedUser.register_date).format('ll')}
      </span>
    </div>
  );
};

export default UserInfo;
