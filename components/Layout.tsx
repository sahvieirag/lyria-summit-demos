
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
        className={`flex-grow w-full ${
          isPromptDJ ? 'h-full' : 'p-6 sm:p-8 md:p-12 mx-auto'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
