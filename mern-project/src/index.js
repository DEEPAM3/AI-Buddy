import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App.js';

// Create root element if it doesn't exist
let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

// Set document title and meta tags programmatically
document.title = 'AI Image Generator';
const metaViewport = document.createElement('meta');
metaViewport.name = 'viewport';
metaViewport.content = 'width=device-width, initial-scale=1';
document.head.appendChild(metaViewport);

const metaThemeColor = document.createElement('meta');
metaThemeColor.name = 'theme-color';
metaThemeColor.content = '#000000';
document.head.appendChild(metaThemeColor);

const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'AI Image Generator using Hugging Face API';
document.head.appendChild(metaDescription);

// Render React app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);