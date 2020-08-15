import React, { useState, useEffect } from 'react';
import validate from '../validator';
import OverlayLoader from '../../Overlay loader';
import Alert from '../../Alert Box';

const Login = ({ state, login, children }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    return () => {
      setLoading(null);
      setUsername('');
      setPassword('');
    };
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const body = { username, password };

    let formErrors = validate(body);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      login(body, finalCallback);
    } else setErrors(formErrors);
  };

  const finalCallback = response => {
    if (response.status !== 1) {
      setErrors({ ...response.payload.login });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="registration__form">
      {errors.server ? (
        <Alert heading="an error occured" message={errors.server} />
      ) : null}
      {loading ? <OverlayLoader /> : null}
      <h3 className="secondary-heading secondary-heading-blue margin-bottom-small">
        login
      </h3>
      <div className="registration__form--content">
        <div className="form__group form__group-large">
          <label
            htmlFor="username"
            className={`form__label ${errors['username'] && 'error-label'}`}>
            {errors['username'] || 'username'}
          </label>
          <input
            type="text"
            className="form__input form__input"
            id="username"
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <span className="focus-border" />
        </div>
        <div className="form__group form__group-large">
          <label
            htmlFor="password"
            className={`form__label ${errors['password'] && 'error-label'}`}>
            {errors['password'] || 'password'}
          </label>
          <input
            type="password"
            className="form__input"
            id="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <span className="focus-border" />
        </div>
      </div>
      <div className="form__group">{children}</div>
      <button className="primary-btn" type="submit">
        login
      </button>
    </form>
  );
};

export default Login;
