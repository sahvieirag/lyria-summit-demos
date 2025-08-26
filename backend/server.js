// backend/server.js
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from "@google/genai";
import { generateAudio } from './lyriaClient.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
// Cloud Run provides the PORT environment variable
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// --- Static File Serving for Production ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const musicDir = path.join(__dirname, '..', 'musics');

// Serve static files from the 'dist' directory located at the project root
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/musics', express.static(musicDir));


const PROJECT_ID = process.env.PROJECT_ID;
if (!PROJECT_ID) {
  throw new Error("PROJECT_ID environment variable not set.");
}
const LOCATION = 'global';

// Initialize Gemini with Vertex AI
const ai = new GoogleGenAI({
  vertexai: true,
  project: PROJECT_ID,
  location: LOCATION
});

// --- API Endpoints ---

app.get('/api/music-samples', (req, res) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) {
      console.error('Error reading music directory:', err);
      return res.status(500).json({ error: 'Failed to read music samples' });
    }
    const musicFiles = files.filter(file => file.endsWith('.wav') || file.endsWith('.mp3'));
    res.json(musicFiles);
  });
});

app.post('/api/generate-prompt-from-image', async (req, res) => {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Image data is required' });

    try {
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } };
        const textPart = { 
            text: `Analyze the image and generate metadata for a soundtrack that fits its mood and style. 
Please return a valid JSON object with the following structure:\n{\n  "title": "A creative and fitting title for the soundtrack",\n  "description": "A detailed prompt for a music generation model, capturing the mood, style, instrumentation, and tempo.",\n  "genre": "The primary genre (e.g., 'Cinematic', 'Ambient', 'Lo-fi', 'Electronic')",\n  "mood": "The dominant mood (e.g., 'Mysterious', 'Uplifting', 'Melancholic', 'Energetic')"\n}` 
        };
        const model = 'gemini-2.5-flash';

        const req_ = {
            contents: [{ role: "user", parts: [imagePart, textPart] }],
            model,
            "generation_config": {
              "response_mime_type": "application/json"
            }
        };

        const streamingResp = await ai.models.generateContentStream(req_);
        
        let aggregatedText = "";
        for await (const chunk of streamingResp) {
            if (chunk.text) {
                aggregatedText += chunk.text;
            }
        }

        // Clean the response to ensure it's valid JSON
        const cleanedJson = aggregatedText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        res.json(parsed);
    } catch(error) {
        console.error('Error with Gemini Image API:', error);
        res.status(500).json({ error: 'Failed to generate from image' });
    }
});

app.post('/api/generate-audio-from-prompt', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const data = await generateAudio(prompt);
        if (data.predictions && data.predictions.length > 0 && data.predictions[0].bytesBase64Encoded) {
            const audioData = data.predictions[0].bytesBase64Encoded;
            const filename = `${Date.now()}.wav`;
            const filePath = path.join(musicDir, filename);
            fs.writeFileSync(filePath, Buffer.from(audioData, 'base64'));
            const audioUrl = `/musics/${filename}`;
            res.json({ audioUrl });
        } else {
            throw new Error("Invalid response structure from Lyria API.");
        }
    } catch (error) {
        console.error('Error processing audio generation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/generate-music-from-text', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
        const textPart = { 
            text: `Analyze the following user prompt and generate metadata for a soundtrack that fits the description. 
Please return a valid JSON object with the following structure:\n{\n  "title": "A creative and fitting title for the soundtrack based on the prompt",\n  "description": "The original user prompt: ${prompt}",\n  "genre": "The primary genre (e.g., 'Cinematic', 'Ambient', 'Lo-fi', 'Electronic')",\n  "mood": "The dominant mood (e.g., 'Mysterious', 'Uplifting', 'Melancholic', 'Energetic')"\n}` 
        };
        const model = 'gemini-2.5-flash';

        const req_ = {
            contents: [{ role: "user", parts: [textPart] }],
            model,
            "generation_config": {
              "response_mime_type": "application/json"
            }
        };

        const streamingResp = await ai.models.generateContentStream(req_);
        
        let aggregatedText = "";
        for await (const chunk of streamingResp) {
            if (chunk.text) {
                aggregatedText += chunk.text;
            }
        }

        const cleanedJson = aggregatedText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        res.json(parsed);
    } catch(error) {
        console.error('Error with Text to Music:', error);
        res.status(500).json({ error: 'Failed to generate from text' });
    }
});


// --- Fallback for Single Page Application (SPA) ---
// This should be after all API routes.. It serves the index.html for any
// request that doesn't match a static file or API route, allowing
// client-side routing to take over.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// --- Temporary File Cleanup ---
const cleanupTemporaryFiles = () => {
    const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            console.error("Error reading music directory for cleanup:", err);
            return;
        }

        files.forEach(file => {
            // Only delete files with a timestamp name (our generated files)
            if (/^\d+\.wav$/.test(file)) {
                const filePath = path.join(musicDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(`Error getting stats for file ${file}:`, err);
                        return;
                    }

                    if (Date.now() - stats.mtime.getTime() > maxAge) {
                        fs.unlink(filePath, err => {
                            if (err) {
                                console.error(`Error deleting temporary file ${file}:`, err);
                            } else {
                                console.log(`Deleted temporary file: ${file}`);
                            }
                        });
                    }
                });
            }
        });
    });
};

// Run cleanup every 15 minutes
setInterval(cleanupTemporaryFiles, 15 * 60 * 1000);


app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
  cleanupTemporaryFiles(); // Run once on startup
});