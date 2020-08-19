import React, { useState, useContext, Fragment } from 'react';
import Register from './Register';
import Login from './Login';
import { Context } from '../context/chatContext';

const Auth = () => {
  const [loginTab, setLoginTab] = useState(false);
  const { state, loginUser, registerUser } = useContext(Context);

  let authChild = (
    <button className="auth-change" onClick={e => setLoginTab(!loginTab)}>
      {loginTab ? 'create an account' : 'have an account'}
    </button>
  );

  return (
    <div className="registration">
      {state.auth.isLoggedIn ? (
        <h3 className="secondary-heading margin-bottom-small">
          already logged in
        </h3>
      ) : (
        <Fragment>
          {loginTab ? (
            <Login login={loginUser} state={state}>
              {authChild}
            </Login>
          ) : (
            <Register register={registerUser} state={state}>
              {authChild}
            </Register>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Auth;
