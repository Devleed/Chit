import React, { useState, useEffect, useContext } from 'react';
import API from '../../../utils/api';
import validate from '../validator';
import FormPage1 from './FormPage1';
import FormPage2 from './FormPage2';
import FormPage3 from './FormPage3';
import { Context } from '../../context/chatContext';

const Register = ({ children }) => {
  const { state, registerUser } = useContext(Context);

  // * form page 1
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('gender');
  const [form1Loading, setForm1Loading] = useState(null);

  // * form page 2
  const [email, setEmail] = useState('');

  // * form page 3
  const [avatar, setAvatar] = useState(
    'https://res.cloudinary.com/drhgwsxz0/image/upload/v1597672123/chat%20app/avatars/account_c1eqt0.svg'
  );

  const [errors, setErrors] = useState({});

  const [formPage, setFormPage] = useState(0);

  let form1Body = {
    firstname,
    lastname,
    username,
    password,
    confirmPassword,
    gender,
    setFirstname,
    setLastname,
    setUsername,
    setPassword,
    setConfirmPassword,
    setGender
  };

  let form2Body = {
    email,
    setEmail
  };

  useEffect(() => {
    return () => {
      setErrors({});
      setForm1Loading(null);
      setFirstname('');
      setLastname('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setGender('');
    };
  }, []);

  // * form 1
  const onForm1Submit = async e => {
    e.preventDefault();

    let formErrors = validate(form1Body);

    if (Object.keys(formErrors).length === 0) {
      setForm1Loading(true);
      // register(form1Body, finalCallback);
      try {
        const { data } = await API.post('/auth/register', form1Body);

        state.socket.emit('user-online', data.user, () => {
          localStorage.setItem('auth-token', data.token);
          setForm1Loading(false);
          setFormPage(1);
        });
      } catch (error) {
        setForm1Loading(false);
        console.log(error.response);
        if (error.response) setErrors({ ...error.response.data.register });
      }
    } else setErrors(formErrors);
  };

  // * form 2
  const onForm2Submit = async e => {
    setForm1Loading(true);

    e.preventDefault();

    try {
      console.log('sending req');
      const { data } = await API.post(
        '/user/set/email',
        { email },
        {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        }
      );

      console.log(data);

      setForm1Loading(false);
      setFormPage(2);
    } catch (error) {
      if (error.response)
        setErrors({ ...errors, server: error.response.data.msg });
    }
  };

  // * form 3
  const onForm3Submit = async e => {
    setForm1Loading(true);

    e.preventDefault();

    try {
      const { data } = await API.post(
        '/user/set/avatar',
        { avatar },
        {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        }
      );

      setForm1Loading(false);
      registerUser(data);
    } catch (error) {
      if (error.response)
        setErrors({ ...errors, server: error.response.data.msg });
    }
  };

  const formPages = [
    <FormPage1
      onSubmit={onForm1Submit}
      errors={errors}
      body={form1Body}
      loading={form1Loading}
      switchAuth={children}
      formPage={formPage}
      setFormPage={setFormPage}
    />,
    <FormPage2
      formPage={formPage}
      setFormPage={setFormPage}
      body={form2Body}
      onSubmit={onForm2Submit}
    />,
    <FormPage3
      defaultAvatar={avatar}
      setAvatar={setAvatar}
      onSubmit={onForm3Submit}
    />
  ];

  return formPages[formPage];
};

export default Register;
