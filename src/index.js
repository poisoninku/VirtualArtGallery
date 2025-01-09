import React from 'react';
import ReactDOM from 'react-dom/client';  // Use the client entry point for React 18+
import App from './App';  // Ensure the path and filename are correct

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create a root
root.render(
  // Temporarily remove React.StrictMode during development
  <App />
);
