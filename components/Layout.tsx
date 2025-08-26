
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
