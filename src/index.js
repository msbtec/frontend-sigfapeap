import React from 'react';
import ReactDOM from 'react-dom';
import ReactNotification from 'react-notifications-component';
import Routes from './routes';
import 'react-notifications-component/dist/theme.css';
import 'moment/locale/pt-br';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import AppProvider from './hooks';

const App = () => <Routes />;

ReactDOM.render(
  <AppProvider>
    <ReactNotification />
    <App />
  </AppProvider>,
  document.getElementById('root'),
);
