import React from 'react';
import ActionCard from '../components/ActionCard';
import { TextIcon, ImageIcon, GalleryIconLarge, IconMusic } from '../components/Icons';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="text-left">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-700 tracking-tight">
          Bem-vind@ ao Lyria Studio!
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-600">
          Transforme texto em música com Lyria - sua criatividade sem limites!
        </p>
        <p className="mt-2 text-lg sm:text-xl md:text-2xl text-gray-600">
          Dê vida às suas ideias - resultados sonoros profissionais!
        </p>
        <button className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105">
          ✨ Experimente o futuro da produção de música com IA ✨
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <ActionCard 
          icon={<TextIcon />}
          title="Texto para Música"
          description="Transforme suas ideias em trilhas sonoras incríveis usando apenas texto."
          tag="Geração de música por texto"
          to="/text-to-music"
          className="text-sm sm:text-base py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition"
        />
        <ActionCard 
          icon={<ImageIcon />}
          title="Imagem para Música"
          description="Converta suas imagens estáticas em paisagens sonoras dinâmicas."
          tag="Música com Imagens, Interativo"
          to="/image-to-music"
        />
        <ActionCard
          icon={<IconMusic className="w-6 h-6 text-blue-700" />}
          title="Prompt DJ"
          description="Crie música em tempo real com prompts de texto."
          tag="Geração de música em tempo real"
          to="/prompt-dj"
        />
        <ActionCard 
          icon={<GalleryIconLarge />}
          title="Galeria de Músicas"
          description="Explore e ouça as trilhas sonoras de exemplo."
          tag="Explore: Criações recorrentes"
          to="/gallery"
        />
      </div>
    </div>
  );
};

export default HomePage;