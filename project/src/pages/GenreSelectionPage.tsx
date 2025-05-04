import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, HeartIcon } from 'lucide-react';
import { usePlaylistStore } from '../stores/playlistStore';
import GenreCard from '../components/GenreCard';
import MoodSelector from '../components/MoodSelector';
import { GENRES } from '../config/spotify';

const GenreSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { filters, setFilter, generatePlaylist, clearFilters } = usePlaylistStore();
  
  const handleGenreToggle = (id: string, selected: boolean) => {
    setFilter('genres', id, selected);
  };
  
  const handleMoodToggle = (id: string, selected: boolean) => {
    setFilter('moods', id, selected);
  };
  
  const handleGeneratePlaylist = async () => {
    if (filters.genres.length === 0 && filters.moods.length === 0) {
      // Show an error or message
      return;
    }
    
    navigate('/generating');
    const playlistId = await generatePlaylist();
    
    if (playlistId) {
      navigate(`/playlist/${playlistId}`);
    } else {
      // Handle error
      navigate('/');
    }
  };
  
  const hasSelections = filters.genres.length > 0 || filters.moods.length > 0;
  
  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-spotify-light-gray hover:text-spotify-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to home</span>
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Create Your Random Discovery</h1>
          <p className="text-spotify-light-gray">
            Select genres and moods to generate a random playlist of 3-5 tracks.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 space-x-3">
          {hasSelections && (
            <button 
              onClick={clearFilters}
              className="btn btn-outline"
            >
              Clear All
            </button>
          )}
          
          <button 
            onClick={handleGeneratePlaylist}
            className={`btn btn-primary flex items-center space-x-2 ${
              !hasSelections ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!hasSelections}
          >
            <Music className="w-5 h-5" />
            <span>Generate Playlist</span>
          </button>
        </div>
      </div>
      
      {/* Genre Selection */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Music className="w-5 h-5 mr-2 text-spotify-green" />
          Select Genres
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GENRES.map(genre => (
            <GenreCard 
              key={genre.id} 
              genre={genre} 
              isSelected={filters.genres.includes(genre.id)}
              onToggle={handleGenreToggle}
            />
          ))}
        </div>
      </div>
      
      {/* Mood Selection */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HeartIcon className="w-5 h-5 mr-2 text-pink-500" />
          Select Moods
        </h2>
        
        <MoodSelector 
          selectedMoods={filters.moods}
          onToggle={handleMoodToggle}
        />
      </div>
      
      {/* Action Button (Mobile) */}
      <div className="md:hidden mt-8">
        <button 
          onClick={handleGeneratePlaylist}
          className={`btn btn-primary w-full flex items-center justify-center space-x-2 ${
            !hasSelections ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!hasSelections}
        >
          <Music className="w-5 h-5" />
          <span>Generate Playlist</span>
        </button>
      </div>
    </div>
  );
};

export default GenreSelectionPage;