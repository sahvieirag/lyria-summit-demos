import React from 'react';
import type { Soundtrack } from '../types';
import SoundtrackResult from '../components/SoundtrackResult';

import cafeImage from '../images/cafe.jpg';
import forestImage from '../images/forest.jpg';
import neondriveImage from '../images/neondrive.jpg';
import oceanImage from '../images/ocean.jpg';

const gallerySoundtracks: Soundtrack[] = [
  {
    title: "Café Aconchegante",
    description: "Uma melodia suave e acústica, perfeita para uma tarde relaxante em seu café favorito.",
    genre: "Acústico",
    mood: "Relaxante",
    audioUrl: "/musics/cafe.wav",
    imageUrl: cafeImage,
  },
  {
    title: "Floresta Encantada",
    description: "Uma trilha sonora mágica e etérea, com sons da natureza e instrumentos de sopro.",
    genre: "Ambiente",
    mood: "Mágico",
    audioUrl: "/musics/forest.wav",
    imageUrl: forestImage,
  },
  {
    title: "Neon Drive",
    description: "Uma batida de synthwave pulsante com uma linha de baixo contagiante, para uma viagem noturna pela cidade.",
    genre: "Synthwave",
    mood: "Energético",
    audioUrl: "/musics/neondrive.wav",
    imageUrl: neondriveImage,
  },
  {
    title: "Oceano Tranquilo",
    description: "O som calmante das ondas e uma melodia de piano serena para meditação e relaxamento.",
    genre: "Ambiente",
    mood: "Calmo",
    audioUrl: "/musics/ocean.wav",
    imageUrl: oceanImage,
  },
];

const GalleryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Galeria de Músicas</h1>
      <p className="mt-2 text-gray-600">Explore uma coleção de trilhas sonoras da galeria.</p>
      
      <div className="mt-8 space-y-8">
        {gallerySoundtracks.map((item, index) => (
          <SoundtrackResult key={index} soundtrack={item} />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
