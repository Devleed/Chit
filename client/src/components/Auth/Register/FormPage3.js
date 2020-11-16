import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';
import Alert from '../../Alert Box';

const avatars = [
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672123/chat%20app/avatars/account_c1eqt0.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672124/chat%20app/avatars/admin_wcsopx.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672124/chat%20app/avatars/call-center_xwdf7z.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672123/chat%20app/avatars/curly_bybc1u.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672126/chat%20app/avatars/doctor_gcxf8l.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672125/chat%20app/avatars/employee_ed09fn.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672125/chat%20app/avatars/female-avatar_absf6q.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672126/chat%20app/avatars/gamer_spwpor.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672127/chat%20app/avatars/maid_c9i02q.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672128/chat%20app/avatars/man_qud9yy.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672128/chat%20app/avatars/pikachu_vllpq9.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672128/chat%20app/avatars/policeman_nhfedo.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672128/chat%20app/avatars/programmer_jehtup.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672128/chat%20app/avatars/robot_xrkrnx.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672130/chat%20app/avatars/spike_nwoijy.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672130/chat%20app/avatars/support_bkz83t.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672131/chat%20app/avatars/teacher_lm2x8b.svg',
  'http://res.cloudinary.com/drhgwsxz0/image/upload/v1597672131/chat%20app/avatars/woman_yb04nf.svg'
];

const FormPage3 = ({ onSubmit, defaultAvatar, setAvatar }) => {
  // const [avatars, setAvatars] = useState([]);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   getAvatars();
  // }, []);

  // const getAvatars = async () => {
  //   try {
  //     const { data } = await API.get('/assets/avatars');
  //     setAvatars(data);
  //   } catch (error) {
  //     if (error.response) setError(error.response.data.msg);
  //   }
  // };

  const displayAvatars = () => {
    return avatars.map((avatar, i) => {
      return <img src={avatar} key={i} onClick={() => setAvatar(avatar)} />;
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
