import React, { useState, useEffect } from 'react';
import { InferenceClient } from "@huggingface/inference";

function ChatGeneration() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const client = new InferenceClient("ADD_YOUR_HUGGINGFACE_API_HERE");//API KEY FOR CHAT GENERATION

  // Fetch chat history from the database
  const fetchChatHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch('/api/db/chats');
      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.status}`);
      }
      const data = await response.json();
      setChatHistory(data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError(err.message);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Toggle chat history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory && chatHistory.length === 0) {
      fetchChatHistory();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Add user message to the chat
      const updatedMessages = [...messages, { role: "user", content: inputMessage }];
      setMessages(updatedMessages);
      
      // Use a better model for chat responses
      const output = await client.textGeneration({
        model: "tiiuae/falcon-7b-instruct",  // Changed to Falcon model which is better for instructions
        inputs: inputMessage,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      });

      // Process the response to remove repetitions
      let responseText = output.generated_text || "No response generated";
      
      // Clean up the response - remove repetitions
      const sentences = responseText.split('. ');
      const uniqueSentences = [...new Set(sentences)];
      responseText = uniqueSentences.join('. ');
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: responseText
      }]);

      // Save chat to database
      try {
        const response = await fetch('/api/generate-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: inputMessage })
        });

        if (!response.ok) {
          console.error('Failed to save chat to database');
        }
      } catch (saveError) {
        console.error('Error saving chat to database:', saveError);
      }
      
      setInputMessage('');
    } catch (err) {
      setError(err.message);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load chat history when component mounts
  useEffect(() => {
    if (showHistory && chatHistory.length === 0) {
      fetchChatHistory();
    }
  }, [showHistory, chatHistory.length]); // Empty dependency array for mount-only behavior

  return (
    <div className="chat-container">
      <div className="chat-header">
      <h2 className="generator-title">AI ChatBot</h2>
        <button className="history-toggle-btn" onClick={toggleHistory}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      {showHistory ? (
        <div className="history-container-2">
          <h3>Chat History</h3>
          {isHistoryLoading ? (
            <div className="loading-message">Loading chat history...</div>
          ) : chatHistory.length === 0 ? (
            <div className="empty-history">No chat history found.</div>
          ) : (
            <div className="history-list">
              {chatHistory.map((chat) => (
                <div key={chat._id} className="history-item">
                  <div className="history-timestamp">{formatDate(chat.createdAt)}</div>
                  <div className="history-content">
                    <div className="history-input">
                      <strong>You:</strong> {chat.input}
                    </div>
                    <div className="history-response">
                      <strong>AI:</strong> {chat.response}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatGeneration;