import React from 'react';
import { MOODS } from '../config/spotify';
import { Zap, Cloud, Smile, CloudRain, Heart, Target } from 'lucide-react';

interface MoodSelectorProps {
  selectedMoods: string[];
  onToggle: (id: string, selected: boolean) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMoods, onToggle }) => {
  // Map for mood icons
  const moodIcons: Record<string, React.ReactNode> = {
    'Zap': <Zap className="w-5 h-5" />,
    'Cloud': <Cloud className="w-5 h-5" />,
    'Smile': <Smile className="w-5 h-5" />,
    'CloudRain': <CloudRain className="w-5 h-5" />,
    'Heart': <Heart className="w-5 h-5" />,
    'Target': <Target className="w-5 h-5" />
  };
  
  return (
    <div className="flex flex-wrap gap-3">
      {MOODS.map(mood => {
        const isSelected = selectedMoods.includes(mood.id);
        
        return (
          <button
            key={mood.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isSelected 
                ? 'bg-spotify-green text-spotify-black' 
                : 'bg-spotify-dark-gray text-spotify-light-gray hover:bg-opacity-70'
            }`}
            onClick={() => onToggle(mood.id, !isSelected)}
          >
            {moodIcons[mood.icon]}
            <span>{mood.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;