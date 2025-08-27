import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LogoIcon, GalleryIcon } from './Icons';
import ApiKeyModal from './ApiKeyModal';

const Header: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (clickCount === 5) {
      setIsModalOpen(true);
      setClickCount(0);
    }
  }, [clickCount]);

  const handleLogoClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  const handleSaveApiKey = async (apiKey: string) => {
    try {
      const response = await fetch('/api/save-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      const result = await response.json();
      console.log(result.message);
      // Optionally, you can add a toast notification to inform the user
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <LogoIcon />
            </div>

            <nav className="hidden md:flex items-center space-x-2 bg-white border border-gray-200 p-1 rounded-full shadow-sm">
              <NavLink to="/" className={navLinkClass}>Página Principal</NavLink>
              <NavLink to="/text-to-music" className={navLinkClass}>Texto para Música</NavLink>
              <NavLink to="/image-to-music" className={navLinkClass}>Imagem para Música</NavLink>
              <NavLink to="/prompt-dj" className={navLinkClass}>Prompt DJ</NavLink>
            </nav>

            <div className="flex items-center space-x-2">
              <NavLink to="/gallery" className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                <GalleryIcon />
                <span>Galeria</span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </>
  );
};

export default Header;
