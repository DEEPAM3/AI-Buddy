import React from 'react';
import { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import './ImageGenerator.js';
import './Chater_Generator.js';

function Dashboard() {
  const [imageHistory, setImageHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [stats, setStats] = useState({
    totalImages: 0,
    totalChats: 0
  });

  useEffect(() => {
    // Fetch image history
    fetch('/api/db/images')
      .then(res => res.json())
      .then(data => {
        setImageHistory(data);
        setStats(prev => ({ ...prev, totalImages: data.length }));
      })
      .catch(error => console.error('Error fetching images:', error));

    // Fetch chat history
    fetch('/api/db/chats')
      .then(res => res.json())
      .then(data => {
        setChatHistory(data);
        setStats(prev => ({ ...prev, totalChats: data.length }));
      })
      .catch(error => console.error('Error fetching chats:', error));
  }, []);

  return (
    <div className="dashboard">
      <div className="tab-buttons">
        <button 
          className="tab-btn"
          onClick={() => window.location.href = '/ImageGeneration'}
        >
          Image Generation
        </button>
        <button 
          className="tab-btn"
          onClick={() => window.location.href = '/Chat_Generation'}
        >
          Chat Generation
        </button>
      </div>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Images Generated</h3>
          <p className="stat-number">{stats.totalImages}</p>
        </div>
        <div className="stat-card">
          <h3>Total Chats Generated</h3>
          <p className="stat-number">{stats.totalChats}</p>
        </div>
      </div>

      <div className="history-container">
        <div className="history-section">
          <h2>Recent Images</h2>
          <div className="history-list">
            {imageHistory.slice(0, 5).map((image, index) => (
              <div key={image._id} className="history-item">
                <span className="history-number">{index + 1}</span>
                <p>{image.prompt}</p>
                <span className="history-date">
                  {new Date(image.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="history-section">
          <h2>Recent Chats</h2>
          <div className="history-list">
            {chatHistory.slice(0, 5).map((chat, index) => (
              <div key={chat._id} className="history-item">
                <span className="history-number">{index + 1}</span>
                <p>{chat.input}</p>
                <span className="history-date">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;