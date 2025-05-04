import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import MiniPlayer from './MiniPlayer';
import { usePlayerStore } from '../stores/playerStore';

const Layout: React.FC = () => {
  const { currentTrack } = usePlayerStore();
  
  return (
    <div className="flex flex-col min-h-screen bg-spotify-black">
      <Navigation />
      
      <main className="flex-grow px-4 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MiniPlayer />
        </div>
      )}
    </div>
  );
};

export default Layout;