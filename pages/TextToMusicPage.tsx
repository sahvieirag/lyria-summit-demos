import React, { useState } from 'react';
import type { Soundtrack } from '../types';
import { generateMusicDetailsFromText } from '../services/geminiService';
import { generateAudioFromPrompt } from '../services/lyriaService';
import SoundtrackResult from '../components/SoundtrackResult';

const examplePrompts = [
  "Lo-fi beats for studying on a rainy day",
  "Epic cinematic score for a space battle",
  "Upbeat synthwave for a retro-futuristic car chase",
  "Calm, ambient music for meditation and focus",
];

const TextToMusicPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Soundtrack | null>(null);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      setLoadingMessage('Analisando seu prompt...');
      const musicDetails = await generateMusicDetailsFromText(prompt);

      setLoadingMessage('Compondo sua música com Lyria...');
      const audioUrl = await generateAudioFromPrompt(musicDetails.description);
      
      setResult({
        ...musicDetails,
        audioUrl,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setResult(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleExampleClick = (example: string) => {
      setPrompt(example);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Texto para Música</h1>
      <p className="mt-2 text-gray-600">Descreva o tipo de música que você quer criar. Seja específico sobre o humor, gênero e instrumentos.</p>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Uma trilha sonora de fantasia épica com violinos crescentes e tambores de guerra, para uma cena de coroação..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
        >
          {isLoading ? loadingMessage : 'Gerar Trilha Sonora'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700">Ou tente um exemplo:</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleExampleClick(p)}
              disabled={isLoading}
              className="text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading && !result && <div className="mt-8 text-center text-gray-600">{loadingMessage}</div>}
      {error && <div className="mt-8 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}
      {result && <SoundtrackResult soundtrack={result} />}
    </div>
  );
};

export default TextToMusicPage;
