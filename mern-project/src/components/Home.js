import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransparentNavbar from './TransparentNavbar.js';
import Symbol from './Symbol.js'; // Add the .js extension

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <TransparentNavbar />
      <div className="home-logo">
        <Symbol />
      </div>
      <div className="home-content">
        <h1>AI Buddy</h1>
        <p className="subtitle">Welcome, Your intelligent companion for </p>
        <p className="subtitle">chat and image generation</p>
        <button 
          className="get-started-btn"
          onClick={() => navigate('/login')}
        >
          Get Started
          <span className="arrow">➔</span>
        </button>
      </div>
      <div className="home-overlay"></div>
    </div>
  );
};

export default Home;