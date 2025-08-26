import type { Soundtrack } from '../types';

/**
 * Generates a text prompt from an image by sending it to the backend server.
 * @param imageBase64 The base64 encoded image data.
 * @returns A promise that resolves to the generated text prompt.
 */
export const generatePromptFromImage = async (imageBase64: string): Promise<Soundtrack> => {
  const body = { imageBase64 };

  try {
    const response = await fetch('/api/generate-prompt-from-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error("Backend Proxy Error:", errorBody);
      throw new Error(`Failed to generate prompt. Status: ${response.status}. ${errorBody.error || 'Unknown server error'}`);
    }

    const data = await response.json();
    
    if (data.title && data.description && data.genre && data.mood) {
      return data;
    } else {
      throw new Error("Invalid response structure from backend. The response did not contain the expected prompt data.");
    }
  } catch (error: any) {
    console.error("Error during prompt generation via backend:", error);
    throw new Error(error.message || "An unexpected error occurred while generating prompt.");
  }
};

export const generateMusicDetailsFromText = async (prompt: string): Promise<Soundtrack> => {
  const body = { prompt };

  try {
    const response = await fetch('/api/generate-music-from-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error("Backend Proxy Error:", errorBody);
      throw new Error(`Failed to generate music details. Status: ${response.status}. ${errorBody.error || 'Unknown server error'}`);
    }

    const data = await response.json();

    if (data.title && data.description && data.genre && data.mood) {
      return data;
    } else {
      throw new Error("Invalid response structure from backend. The response did not contain the expected music details.");
    }
  } catch (error: any) {
    console.error("Error during music details generation via backend:", error);
    throw new Error(error.message || "An unexpected error occurred while generating music details.");
  }
};
