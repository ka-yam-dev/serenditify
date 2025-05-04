import React from 'react';
import { Music } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-dark-gray flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center p-6 md:p-12">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <div className="animate-bounce-slow inline-block mb-6">
            <Music className="w-16 h-16 text-spotify-green" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Favorite Song
          </h1>
          
          <p className="text-xl text-spotify-light-gray mb-8 max-w-lg mx-auto md:mx-0">
            Get a daily dose of musical serendipity with randomly selected tracks that match your taste.
          </p>
          
          <button
            onClick={() => login()}
            className="btn btn-primary text-lg flex items-center space-x-2 mx-auto md:mx-0"
          >
            <span>Connect with Spotify</span>
          </button>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full bg-spotify-green opacity-10 animate-pulse-slow"></div>
            <img 
              src="https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Person enjoying music" 
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl transform rotate-3"
            />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-spotify-dark-gray py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            How Random Discovery Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:transform hover:-translate-y-2">
              <div className="text-spotify-green text-xl font-bold mb-2">1. Choose Your Vibe</div>
              <p className="text-spotify-light-gray">
                Select genres and moods that match what you're feeling today.
              </p>
            </div>
            
            <div className="card hover:transform hover:-translate-y-2">
              <div className="text-spotify-green text-xl font-bold mb-2">2. Get Random Tracks</div>
              <p className="text-spotify-light-gray">
                We'll select 3-5 completely random tracks that fit your criteria.
              </p>
            </div>
            
            <div className="card hover:transform hover:-translate-y-2">
              <div className="text-spotify-green text-xl font-bold mb-2">3. Save & Share</div>
              <p className="text-spotify-light-gray">
                Discover something you love? Save it to your Spotify and share with friends.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-spotify-black py-6 px-4 text-center text-spotify-light-gray text-sm">
        <p>Not affiliated with Spotify. Created for music discovery and sharing.</p>
      </footer>
    </div>
  );
};

export default LoginPage;