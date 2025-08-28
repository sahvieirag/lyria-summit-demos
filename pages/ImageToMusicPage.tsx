import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Soundtrack } from '../types';
import { generatePromptFromImage, generateImageFromPrompt } from '../services/geminiService';
import { generateAudioFromPrompt } from '../services/lyriaService';
import SoundtrackResult from '../components/SoundtrackResult';
import CameraCapture from '../components/CameraCapture';
import LoadingState from '../components/LoadingState';
import { LoadingIcon } from '../components/Icons';
import actionImage from '../images/action.png';
import devImage from '../images/dev.png';
import romanceImage from '../images/romance.png';

const presetImages = [
  { name: 'Action', src: actionImage },
  { name: 'Developer', src: devImage },
  { name: 'Romance', src: romanceImage },
];

// Componente para a visualização de compartilhamento
const ShareView = ({ audioId }: { audioId: string }) => {
  const shareUrl = window.location.href;
  const audioSrc = `/musics/${audioId}.wav`;
  // Assumindo que a imagem correspondente está no formato jpg na pasta images
  const imgSrc = `/images/${audioId}.jpg`; 

  return (
    <div className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Música Gerada</h1>
        <img src={imgSrc} alt={`Imagem para ${audioId}`} className="rounded-lg shadow-lg w-full mb-4" onError={(e) => e.currentTarget.style.display='none'}/>
        <audio controls src={audioSrc} className="w-full">
            Seu navegador não suporta o elemento de áudio.
        </audio>
        <div className="mt-6 flex items-center gap-4">
            <a href={audioSrc} download className="flex-1 text-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition">
                Baixar Áudio
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition">
                Compartilhar no LinkedIn
            </a>
        </div>
    </div>
  );
};


const ImageToMusicPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const audioId = searchParams.get('id');

  const [prompt, setPrompt] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Soundtrack | null>(null);

  const handleCapture = useCallback((imageBase64: string) => {
    setCapturedImage(imageBase64);
  }, []);

  const handlePresetSelect = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1] || '';
        setCapturedImage(base64String);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError('Failed to load preset image.');
    }
  };

  const handleGenerate = async () => {
    if (!capturedImage || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      setLoadingMessage('Analisando imagem para inspiração...');
      const musicDetails = await generatePromptFromImage(capturedImage);

      setLoadingMessage('Compondo sua música com Lyria...');
      const audioUrl = await generateAudioFromPrompt(musicDetails.description);

      setResult({
        ...musicDetails,
        audioUrl,
        imageUrl: `data:image/jpeg;base64,${capturedImage}`
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setResult(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };
  
  // Se um 'id' de áudio estiver na URL, mostre a visualização de compartilhamento
  if (audioId) {
    return <ShareView audioId={audioId} />;
  }

  // Caso contrário, mostre a lógica original da página para gerar música
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Imagem para Música</h1>
      <p className="mt-2 text-gray-600">Use sua câmera para capturar um momento, gere uma imagem com AI ou escolha uma imagem para nós criarmos a trilha sonora perfeita para ele.</p>

      <div className="mt-8">
        {!capturedImage ? (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Gerar imagem com o Imagen (VertexAI):</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Digite um prompt para gerar uma imagem. Ex: Uma Cidade Futurista ao anoitecer"
                  className="flex-grow p-2 border rounded-lg"
                />
                <button
                  onClick={async () => {
                    if (!prompt) return;
                    setIsLoading(true);
                    setLoadingMessage('Gerando imagem com Imagen (VertexAI)...');
                    try {
                      const imageBase64 = await generateImageFromPrompt(prompt);
                      setCapturedImage(imageBase64);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                    } finally {
                      setIsLoading(false);
                      setLoadingMessage('');
                    }
                  }}
                  disabled={isLoading}
                  className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 flex items-center"
                >
                  {isLoading && <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />}
                  Gerar Imagem
                </button>
              </div>
            </div>
            <div className="my-8 text-center text-gray-500"></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Capture uma imagem com a câmera:</h3>
            <CameraCapture onCapture={handleCapture} />
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ou escolha um preset:</h3>
              <div className="grid grid-cols-3 gap-4">
                {presetImages.map((image) => (
                  <div key={image.name} className="cursor-pointer group" onClick={() => handlePresetSelect(image.src)}>
                    <img src={image.src} alt={image.name} className="rounded-lg shadow-md group-hover:opacity-75 transition" />
                    <p className="text-center mt-2 text-gray-600">{image.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Foto Selecionada:</h3>
            <img
              src={`data:image/jpeg;base64,${capturedImage}`}
              alt="Captured"
              className="rounded-lg shadow-lg w-full"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                    {loadingMessage}
                  </>
                ) : (
                  'Gerar Trilha Sonora'
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition"
              >
                Escolher Outra Foto
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-8 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}
      {result && <SoundtrackResult soundtrack={result} />}
    </div>
  );
};

export default ImageToMusicPage;
