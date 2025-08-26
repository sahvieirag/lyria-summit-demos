import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Soundtrack } from '../types';
import { IconMoodHappy, IconGenre, IconShare } from './Icons';

interface SoundtrackResultProps {
  soundtrack: Soundtrack;
}

const SoundtrackResult: React.FC<SoundtrackResultProps> = ({ soundtrack }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const shareUrl = soundtrack.audioUrl ? `${baseUrl}${soundtrack.audioUrl}` : '';

  return (
    <div className="animate-fade-in mt-8">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
                {soundtrack.imageUrl && (
                    <img
                        src={soundtrack.imageUrl}
                        alt={soundtrack.title}
                        className="w-full md:w-48 h-48 object-cover rounded-xl shadow-md border border-gray-100"
                    />
                )}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{soundtrack.title}</h2>

                    <div className="mt-3 flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                            <IconGenre className="w-4 h-4" />
                            {soundtrack.genre}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font--medium text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
                            <IconMoodHappy className="w-4 h-4" />
                            {soundtrack.mood}
                        </span>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-1">Prompt para Geração</h4>
                        <p className="text-gray-600 text-sm">{soundtrack.description}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
              {soundtrack.audioUrl && (
                <audio controls src={soundtrack.audioUrl} className="w-full">
                    Seu navegador não suporta o elemento de áudio.
                </audio>
              )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                >
                    <IconShare className="w-5 h-5" />
                    Compartilhar
                </button>
            </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Compartilhe sua Música</h3>
            <p className="text-gray-600 mb-6">Aponte a câmera do seu celular para o código.</p>
            <div className="flex justify-center">
              <QRCodeSVG
                value={shareUrl}
                size={256}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
              />
            </div>
            <p className="mt-4 text-xs text-gray-500 break-all">{shareUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundtrackResult;