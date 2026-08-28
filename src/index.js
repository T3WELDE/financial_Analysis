import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//Entry point of the React application
// rendering the App component into the root element in the HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);