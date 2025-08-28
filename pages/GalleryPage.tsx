import React, { useState, useEffect } from 'react';
import SoundtrackResult from '../components/SoundtrackResult';

const GalleryPage: React.FC = () => {
  const [musicFiles, setMusicFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch('/api/music-samples');
        if (!response.ok) {
          throw new Error('Failed to fetch music samples');
        }
        const data = await response.json();
        setMusicFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    };

    fetchMusic();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Galeria de Músicas</h1>
      <p className="mt-2 text-gray-600">Explore uma coleção de trilhas sonoras da galeria.</p>
      
      {error && <div className="mt-8 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}

      <div className="mt-8 space-y-8">
        {musicFiles.map((audioUrl, index) => (
          <SoundtrackResult key={index} soundtrack={{ audioUrl }} />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
