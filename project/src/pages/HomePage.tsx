import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc, ShuffleIcon } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const HomePage: React.FC = () => {
  const { userProfile } = useAuthStore();
  const navigate = useNavigate();
  
  return (
    <div className="py-8">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {userProfile ? `Welcome, ${userProfile.display_name}` : 'Welcome to Random Discovery'}
        </h1>
        <p className="text-spotify-light-gray text-lg">
          Let's find your next musical surprise
        </p>
      </div>
      
      {/* Main CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 rounded-xl p-8 mb-12 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Create Today's Random Playlist
            </h2>
            <p className="text-lg text-spotify-light-gray">
              Generate 3-5 tracks based on your preferred genres and moods.
              You might discover your next favorite song!
            </p>
          </div>
          
          <div>
            <button 
              onClick={() => navigate('/select')}
              className="btn btn-primary flex items-center space-x-2"
            >
              <ShuffleIcon className="w-5 h-5" />
              <span>Create Random Playlist</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card hover:bg-spotify-dark-gray hover:bg-opacity-90">
          <div className="flex mb-4">
            <div className="w-12 h-12 rounded-full bg-spotify-green bg-opacity-20 flex items-center justify-center mr-4">
              <Disc className="w-6 h-6 text-spotify-green" />
            </div>
            <h3 className="text-xl font-bold">Your Daily Music Discovery</h3>
          </div>
          <p className="text-spotify-light-gray">
            Escape your personal echo chamber with tracks you might never have encountered otherwise.
          </p>
        </div>
        
        <div className="card hover:bg-spotify-dark-gray hover:bg-opacity-90">
          <div className="flex mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center mr-4">
              <ShuffleIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Truly Random Selection</h3>
          </div>
          <p className="text-spotify-light-gray">
            Unlike algorithms that try to predict what you'll like, we embrace the joy of serendipitous discovery.
          </p>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1 p-6 bg-spotify-dark-gray rounded-lg">
            <div className="text-spotify-green text-4xl font-bold mb-2">1</div>
            <h3 className="text-xl font-semibold mb-2">Select Genres & Moods</h3>
            <p className="text-spotify-light-gray">Choose what kind of music you're in the mood for today.</p>
          </div>
          
          <div className="flex-1 p-6 bg-spotify-dark-gray rounded-lg">
            <div className="text-spotify-green text-4xl font-bold mb-2">2</div>
            <h3 className="text-xl font-semibold mb-2">Get Random Tracks</h3>
            <p className="text-spotify-light-gray">We'll generate a small playlist of completely random tracks.</p>
          </div>
          
          <div className="flex-1 p-6 bg-spotify-dark-gray rounded-lg">
            <div className="text-spotify-green text-4xl font-bold mb-2">3</div>
            <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
            <p className="text-spotify-light-gray">Like what you hear? Save to your Spotify or share with friends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;