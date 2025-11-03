/**
 * Main Layout Component
 */

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1">
          <div className="container-main animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
