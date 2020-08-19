import React, { useContext, useEffect, useState, Fragment } from 'react';
import io from 'socket.io-client';

import Auth from '../Auth';
import Home from '../Home';
import { Context } from '../context/chatContext';
import './main.scss';
import OverlayLoader from '../Overlay loader';
import Alert from '../Alert Box';

const App = () => {
  const { state, loadUser, setSocket } = useContext(Context);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  console.clear();

  const finalCallback = response => {
    if (response.status !== 1) {
      setError('server error, ', response.payload);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    if (!state.socket) {
      const ENDPOINT = 'http://localhost:5000';
      const socket = io(ENDPOINT);
      setSocket(socket);
    }

    if (state.socket) {
      loadUser(finalCallback);
    }

    return () => {
      setLoading(null);
      setError(null);
    };
  }, [state.socket]);

  if (loading) return <OverlayLoader />;

  return (
    <Fragment>
      {error ? <Alert heading="an error occured" message={error} /> : null}
      {!state.auth.isLoggedIn ? <Auth /> : <Home />}
    </Fragment>
  );
  // return <Home />;
};

export default App;
