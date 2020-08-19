import React from 'react';

const FormPage2 = ({ onSubmit, body }) => {
  return (
    <form onSubmit={onSubmit} className="registration__form">
      <h3 className="secondary-heading secondary-heading-blue margin-bottom-small">
        enter your recovery email
      </h3>
      <div className="registration__form--content">
        <div className="form__group form__group-large">
          <label htmlFor="email" className={`form__label`}>
            email
          </label>
          <input
            type="email"
            className="form__input form__input"
            id="email"
            placeholder="john@gmail.com"
            value={body.email}
            onChange={e => body.setEmail(e.target.value)}
          />
          <span className="focus-border"></span>
        </div>
      </div>
      <button className="primary-btn">next</button>
    </form>
  );
};

export default FormPage2;
