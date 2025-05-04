import React from 'react';
import { GENRES } from '../config/spotify';

interface GenreCardProps {
  genre: typeof GENRES[0];
  isSelected: boolean;
  onToggle: (id: string, selected: boolean) => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, isSelected, onToggle }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-spotify-green ring-offset-2 ring-offset-spotify-black' : 'opacity-80 hover:opacity-100'
      }`}
      onClick={() => onToggle(genre.id, !isSelected)}
    >
      <div className={`${genre.color} h-36 flex items-center justify-center p-4`}>
        <h3 className="text-white text-2xl font-bold text-center">{genre.name}</h3>
      </div>
      
      {isSelected && (
        <div className="absolute inset-0 bg-spotify-green bg-opacity-20 flex items-center justify-center">
          <div className="bg-spotify-green text-spotify-black text-sm font-medium py-1 px-3 rounded-full">
            Selected
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreCard;