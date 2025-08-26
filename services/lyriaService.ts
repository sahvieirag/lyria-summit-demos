/**
 * Generates audio by sending a prompt to the backend server.
 * The backend will then proxy the request to the Lyria model on Vertex AI.
 * @param prompt The text prompt to generate audio from.
 * @returns A promise that resolves to the URL of the generated audio file.
 */
export const generateAudioFromPrompt = async (prompt: string): Promise<string> => {
  const body = { prompt };

  try {
    const response = await fetch('/api/generate-audio-from-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { error: 'Failed to parse error response' };
      }
      console.error("Backend Proxy Error:", errorBody);
      throw new Error(errorBody.error || `Failed to generate audio. Status: ${response.status}.`);
    }

    const data = await response.json();
    
    if (data.audioUrl) {
      return data.audioUrl;
    }
    else {
      throw new Error("Invalid response structure from backend. The response did not contain the expected audio URL.");
    }
  } catch (error: any) {
    console.error("Error during audio generation via backend:", error);
    throw new Error(error.message || "An unexpected error occurred while generating audio.");
  }
};

export const getMusicSamples = async (): Promise<string[]> => {
  try {
    const response = await fetch('/api/music-samples');
    if (!response.ok) {
      throw new Error('Failed to fetch music samples');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching music samples:', error);
    throw error;
  }
};
