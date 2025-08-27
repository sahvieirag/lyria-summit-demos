
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isPromptDJ = location.pathname === '/prompt-dj';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main
        className={`flex-grow ${
          isPromptDJ ? 'h-full' : 'p-4 sm:p-6 md:p-8 max-w-7xl mx-auto'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
