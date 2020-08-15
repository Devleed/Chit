import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from './components/context/chatContext';

const app = (
  <Provider>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
