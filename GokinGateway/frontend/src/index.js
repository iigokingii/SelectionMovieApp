import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from './components/redux/store';
import { Provider } from 'react-redux';
import AppWrapper from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  </Provider>
  
);