import React from 'react';
import ReactDOM from 'react-dom';
import ReactNotification from 'react-notifications-component';
import Routes from './routes';
import 'react-notifications-component/dist/theme.css';

import AppProvider from './hooks';

const App = () => <Routes />;

ReactDOM.render(
  <AppProvider>
    <ReactNotification />
    <App />
  </AppProvider>,
  document.getElementById('root'),
);
