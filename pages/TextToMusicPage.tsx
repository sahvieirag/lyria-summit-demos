import React, { useState } from 'react';
import type { Soundtrack } from '../types';
import { generateMusicDetailsFromText, enhancePrompt } from '../services/geminiService';
import { generateAudioFromPrompt } from '../services/lyriaService';
import SoundtrackResult from '../components/SoundtrackResult';

const examplePrompts = [
  "Batidas Lo-fi para estudar em um dia chuvoso",
  "Trilha sonora cinematográfica épica para uma batalha espacial",
  "Synthwave animado para uma perseguição de carro retro-futurista",
  "Música ambiente calma para meditação e foco",
];

const TextToMusicPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Soundtrack | null>(null);

  const handleSurpriseMeClick = () => {
    const randomIndex = Math.floor(Math.random() * examplePrompts.length);
    setPrompt(examplePrompts[randomIndex]);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      setLoadingMessage('Aprimorando seu prompt...');
      const enhancedPrompt = await enhancePrompt(prompt);
      setPrompt(enhancedPrompt);

      setLoadingMessage('Analisando seu prompt aprimorado...');
      const musicDetails = await generateMusicDetailsFromText(enhancedPrompt);

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
    <div className="mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">Texto para Música</h1>
      <p className="mt-2 text-lg sm:text-xl text-gray-600">Descreva o tipo de música que você quer criar. Seja específico sobre o humor, gênero e instrumentos.</p>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Uma trilha sonora de fantasia épica com violinos crescentes e tambores de guerra, para uma cena de coroação..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
          >
            {isLoading ? loadingMessage : 'Gerar Trilha Sonora'}
          </button>
          <button
            type="button"
            onClick={handleSurpriseMeClick}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition"
          >
            Surpreenda-me
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Ou tente um exemplo:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleExampleClick(p)}
              disabled={isLoading}
              className="text-sm sm:text-base py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition"
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