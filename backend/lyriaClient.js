import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = 'us-central1';

const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

const lyriaApiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/lyria-002:predict`;

async function generateAudio(prompt) {
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    console.log("Sending prompt to Lyria:", prompt);
    const apiResponse = await fetch(lyriaApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instances: [{ 
                prompt: prompt, 
                seed: Math.floor(Math.random() * 100000) 
            }],
            parameters: {
                "negative_prompt": "boring, generic, simple, unoriginal, vocals, excessive cymbal crashes, distorted guitar"
            },
        }),
    });

    console.log("Received response from Lyria with status:", apiResponse.status);

    if (apiResponse.ok) {
        const data = await apiResponse.json();
        return data;
    } else {
        const errorText = await apiResponse.text();
        console.error("Lyria API Error:", errorText);
        throw new Error('Failed to generate audio from Lyria API.');
    }
}

export { generateAudio };