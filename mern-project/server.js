import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connection.js';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose'; 
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.js';
import authRoutes from './routes/auth.js';
import { fileURLToPath } from 'url';
 
// Add this import if you have db routes
import dbRoutes from './routes/db.js';  // Make sure this file exists

// Add these imports at the top with other imports
import Image from './db/models/Image.js';
import Chat from './db/models/Chat.js';

// Add these right after imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3001;

// Update your CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Use database routes
app.use('/api/db', dbRoutes);

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const HF_TOKEN = process.env.HF_TOKEN || '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';
    const API_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt }),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      if (response.status === 503) {
        return res.status(503).json({ 
          error: 'Image generation service is temporarily unavailable. Please try again later.'
        });
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Create a new image record in MongoDB
    const newImage = new Image({
      prompt: prompt,
    });
    
    await newImage.save();
    console.log(`Image record saved to MongoDB with ID: ${newImage._id}`);

    // Get the image buffer from the response
    const imageBuffer = await response.arrayBuffer();
    
    // Set appropriate headers and send the image
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Error generating image:', error);
    if (error.name === 'AbortError') {
      res.status(504).json({ error: 'Request timed out. Please try again.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Add new endpoint for chat generation
app.post('/api/generate-chat', async (req, res) => {
  try {
    const { inputs } = req.body;
    if (!inputs) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return res.status(401).json({ error: 'API token not configured' });
    }

    const API_URL = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: inputs,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      // const errorText = await response.text();
      // console.error('Hugging Face API Error:', errorText); // Commented out to prevent logging
      if (response.status === 503) {
        return res.status(503).json({ 
          error: 'The AI service is currently unavailable. Please try again later.',
          details: 'Hugging Face API returned 503 Service Unavailable'
        });
      }
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid API token. Please check your Hugging Face credentials.'
        });
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text || result;
    
    // Create a new chat record in MongoDB
    try {
      const newChat = new Chat({
        input: inputs,
        response: generatedText
      });
      
      // Save the chat record
      await newChat.save();
      console.log(`Chat record saved to MongoDB with ID: ${newChat._id}`);
      
      res.json({ response: generatedText });
    } 
    catch (dbError) {
      console.error('Error saving chat to MongoDB:', dbError);
      // Still send the response even if DB save fails
      res.json({ response: generatedText });
    }
  } catch (error) {
    // console.error('Error generating chat response:', error); // Commented out to prevent logging
    res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Initialize MongoDB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});

