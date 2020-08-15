import React, { useState, useEffect } from 'react';
import validate from '../validator';
import OverlayLoader from '../../Overlay loader';
import Alert from '../../Alert Box';

const Register = ({ state, register, children }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('gender');
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(null);

  // useEffect(() => {
  //   setErrors({ ...state.errors.register });
  // }, [state.errors.register || state.errors]);

  useEffect(() => {
    return () => {
      setErrors({});
      setLoading(null);
      setFirstname('');
      setLastname('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setGender('');
    };
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const body = {
      firstname,
      lastname,
      username,
      password,
      confirmPassword,
      gender
    };

    let formErrors = validate(body);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      register(body, finalCallback);
    } else setErrors(formErrors);
  };

  const finalCallback = response => {
    if (response.status !== 1) {
      setErrors({ ...response.payload.register });
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
        register
      </h3>
      <div className="registration__form--content">
        <div className="form__group">
          <label
            htmlFor="firstname"
            className={`form__label ${errors['firstname'] && 'error-label'}`}>
            {errors['firstname'] || 'firstname'}
          </label>
          <input
            type="text"
            className="form__input"
            id="firstname"
            placeholder="john"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
          />
          <span className="focus-border"></span>
        </div>
        <div className="form__group">
          <label
            htmlFor="lastname"
            className={`form__label ${errors['lastname'] && 'error-label'}`}>
            {errors['lastname'] || 'lastname'}
          </label>
          <input
            type="text"
            className="form__input"
            id="lastname"
            placeholder="doe"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
          />
          <span className="focus-border"></span>
        </div>
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
            placeholder="john123"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <span className="focus-border"></span>
        </div>
        <div className="form__group">
          <label
            htmlFor="password"
            className={`form__label ${errors['password'] && 'error-label'}`}>
            {errors['password'] || 'password'}
          </label>
          <input
            type="password"
            className="form__input"
            id="password"
            placeholder="unique and hard to guess"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <span className="focus-border"></span>
        </div>
        <div className="form__group">
          <label
            htmlFor="confirm-password"
            className={`form__label ${
              errors['confirmPassword'] && 'error-label'
            }`}>
            {errors['confirmPassword'] || 'confirm password'}
          </label>
          <input
            type="password"
            className="form__input"
            id="confirm-password"
            placeholder="re-enter password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <span className="focus-border"></span>
        </div>
      </div>
      <div className="form__group form__group-select">
        <label
          htmlFor="gender"
          className={`form__label ${errors['gender'] && 'error-label'}`}>
          {errors['gender'] || 'gender'}
        </label>
        <select
          name="gender"
          id="gender"
          value={gender}
          onChange={e => setGender(e.target.value)}>
          <option value="gender" disabled>
            gender
          </option>
          <option value="male" className="gender__option">
            Male
          </option>
          <option value="female" className="gender__option">
            Female
          </option>
          <option value="other" className="gender__option">
            Other
          </option>
        </select>
        <span className="focus-border"></span>
      </div>
      <div className="form__group form__group-checkbox">
        <input type="checkbox" name="terms-checkbox" id="terms-checkbox" />
        <label htmlFor="terms-checkbox">
          i agree to <a href="#">terms and conditions</a>
        </label>
      </div>
      <div className="form__group">{children}</div>
      <button className="primary-btn">register</button>
    </form>
  );
};

export default Register;
