import React, { useState } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('Men life');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const generateImage = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-generator">
      <h2 className="generator-title">AI Image Generator</h2>
      <div className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a description for the image"
        />
        <button onClick={generateImage} disabled={isLoading}>
          {isLoading ? 'Generating ...' : 'Generate Image'}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {imageUrl && (
        <div className="image-container">
          <img src={imageUrl} alt="Generated" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;