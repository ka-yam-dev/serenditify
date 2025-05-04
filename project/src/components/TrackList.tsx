import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';

interface TrackListProps {
  tracks: SpotifyApi.TrackObjectFull[];
  showIndex?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, showIndex = true }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayerStore();
  
  const handlePlayTrack = (track: SpotifyApi.TrackObjectFull) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };
  
  return (
    <div className="space-y-2">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;
        
        return (
          <div 
            key={track.id}
            className={`flex items-center p-3 rounded-md ${
              isCurrentTrack ? 'bg-spotify-dark-gray' : 'hover:bg-spotify-dark-gray transition-colors'
            }`}
          >
            {showIndex && (
              <div className="w-8 flex-shrink-0 text-center text-spotify-light-gray">
                {index + 1}
              </div>
            )}
            
            <div className="flex-shrink-0 mr-4 relative">
              <img 
                src={track.album.images[0]?.url} 
                alt={track.album.name}
                className="w-12 h-12 rounded"
              />
              
              <button
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 ${
                  isCurrentTrack ? 'opacity-100' : ''
                }`}
                onClick={() => handlePlayTrack(track)}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
            
            <div className="min-w-0 flex-grow">
              <div className={`font-medium truncate ${isCurrentTrack ? 'text-spotify-green' : ''}`}>
                {track.name}
              </div>
              <div className="text-spotify-light-gray text-sm truncate">
                {track.artists.map(artist => artist.name).join(', ')}
              </div>
            </div>
            
            <div className="text-spotify-light-gray text-sm w-20 text-right">
              {formatDuration(track.duration_ms)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default TrackList;