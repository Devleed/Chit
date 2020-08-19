import React from 'react';
import Alert from '../../Alert Box';
import OverlayLoader from '../../Overlay loader';

const FormPage1 = ({ onSubmit, errors, body, loading, switchAuth }) => {
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
            value={body.firstname}
            onChange={e => body.setFirstname(e.target.value)}
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
            value={body.lastname}
            onChange={e => body.setLastname(e.target.value)}
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
            value={body.username}
            onChange={e => body.setUsername(e.target.value)}
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
            value={body.password}
            onChange={e => body.setPassword(e.target.value)}
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
            value={body.confirmPassword}
            onChange={e => body.setConfirmPassword(e.target.value)}
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
          value={body.gender}
          onChange={e => body.setGender(e.target.value)}>
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
      {/* <div className="form__group form__group-checkbox">
        <input type="checkbox" name="terms-checkbox" id="terms-checkbox" />
        <label htmlFor="terms-checkbox">
          i agree to <a href="#">terms and conditions</a>
        </label>
      </div> */}
      <div className="switch-auth">{switchAuth}</div>
      <button className="primary-btn">next</button>
    </form>
  );
};

export default FormPage1;
