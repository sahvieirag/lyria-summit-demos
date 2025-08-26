
import React from 'react';
import ActionCard from '../components/ActionCard';
import { TextIcon, ImageIcon, GalleryIconLarge } from '../components/Icons';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="text-left max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 tracking-tight">
          Bem-vindo ao Lyria Studio
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Transforme texto em música com Lyria - sua criatividade sem limites!
        </p>
        <p className="mt-2 text-lg text-gray-600">
          Dê vida às suas ideias - resultados sonoros profissionais!
        </p>
        <button className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105">
          ✨ Experimente o futuro da produção de música com IA ✨
        </button>
      </div>

      <div className="space-y-4">
        <ActionCard 
          icon={<TextIcon />}
          title="Texto para Música"
          description="Transforme suas ideias em trilhas sonoras incríveis usando apenas texto."
          tag="Inclui: Geração de Música, Gêneros Variados"
          to="/text-to-music"
        />
        <ActionCard 
          icon={<ImageIcon />}
          title="Imagem para Música"
          description="Converta suas imagens estáticas em paisagens sonoras dinâmicas."
          tag="Inclui: Música com Imagem, Música com Imagem do Usuário"
          to="/image-to-music"
        />
        <ActionCard 
          icon={<GalleryIconLarge />}
          title="Galeria de Músicas"
          description="Explore e ouça as trilhas sonoras geradas pela comunidade."
          tag="Explore: Criações da Comunidade"
          to="/gallery"
        />
      </div>
    </div>
  );
};

export default HomePage;
