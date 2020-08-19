import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';
import Alert from '../../Alert Box';

const FormPage3 = ({ onSubmit, defaultAvatar, setAvatar }) => {
  const [avatars, setAvatars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAvatars();
  }, []);

  const getAvatars = async () => {
    try {
      const { data } = await API.get('/assets/avatars');
      setAvatars(data);
    } catch (error) {
      if (error.response) setError(error.response.data.msg);
    }
  };

  const displayAvatars = () => {
    return avatars.map(avatar => {
      return (
        <img
          src={avatar.url}
          alt={avatar.asset_id}
          key={avatar.public_id}
          onClick={() => setAvatar(avatar.url)}
        />
      );
    });
  };

  return (
    <form onSubmit={onSubmit} className="registration__form">
      {error ? <Alert heading="an error occured" message={error} /> : null}
      <h3 className="secondary-heading secondary-heading-blue margin-bottom-tiny">
        choose you avatar
      </h3>
      <figure className="avatar-preview">
        <img
          className="avatar-preview-image"
          src={defaultAvatar}
          alt="avatar preview"
        />
      </figure>
      <div className="available-avatars">{displayAvatars()}</div>
      <div className="avatar-options">
        <button className="primary-btn">submit</button>
      </div>
    </form>
  );
};

export default FormPage3;
