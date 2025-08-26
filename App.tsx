
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TextToMusicPage from './pages/TextToMusicPage';
import ImageToMusicPage from './pages/ImageToMusicPage';
import GalleryPage from './pages/GalleryPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/text-to-music" element={<TextToMusicPage />} />
          <Route path="/image-to-music" element={<ImageToMusicPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
