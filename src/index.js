import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Modal from 'react-modal';
import App from './App';
// Set the application root element for accessibility
Modal.setAppElement('#root');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
