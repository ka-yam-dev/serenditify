import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Share2, PlayCircle } from 'lucide-react';
import { usePlaylistStore } from '../stores/playlistStore';
import { usePlayerStore } from '../stores/playerStore';
import TrackList from '../components/TrackList';

const PlaylistResultPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { getPlaylistById, saveCurrentPlaylist } = usePlaylistStore();
  const { playPlaylist } = usePlayerStore();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (playlistId) {
      const playlistData = getPlaylistById(playlistId);
      
      if (!playlistData) {
        navigate('/select');
        return;
      }
      
      setPlaylist(playlistData);
    }
  }, [playlistId, getPlaylistById, navigate]);
  
  const handleSavePlaylist = async () => {
    if (saveStatus === 'idle') {
      setSaveStatus('saving');
      
      const spotifyId = await saveCurrentPlaylist();
      
      if (spotifyId) {
        setSaveStatus('saved');
        setShareUrl(`https://open.spotify.com/playlist/${spotifyId}`);
      } else {
        setSaveStatus('error');
      }
    }
  };
  
  const handleSharePlaylist = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      
      // Open in Spotify if available
      window.open(shareUrl, '_blank');
    }
  };
  
  const handlePlayAll = () => {
    if (playlist && playlist.tracks.length > 0) {
      playPlaylist(playlist.tracks);
    }
  };
  
  if (!playlist) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-spotify-green border-t-transparent"></div>
      </div>
    );
  }
  
  // Format filters for display
  const selectedGenres = playlist.filters.genres.length > 0
    ? playlist.filters.genres.join(', ')
    : 'Any';
    
  const selectedMoods = playlist.filters.moods.length > 0
    ? playlist.filters.moods.join(', ')
    : 'Any';
  
  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/select')}
          className="flex items-center text-spotify-light-gray hover:text-spotify-white mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Create another playlist</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            <p className="text-spotify-light-gray">
              {playlist.tracks.length} tracks • Generated from {selectedGenres} genres and {selectedMoods} moods
            </p>
          </div>
          
          <div className="flex mt-4 md:mt-0">
            <button 
              onClick={handlePlayAll}
              className="btn btn-primary flex items-center space-x-2 mr-3"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Play All</span>
            </button>
            
            <button 
              onClick={handleSavePlaylist}
              className={`btn ${
                saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : 'btn-outline'
              } flex items-center space-x-2 mr-3`}
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            >
              <Save className="w-5 h-5" />
              <span>
                {saveStatus === 'idle' && 'Save to Spotify'}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && 'Saved!'}
                {saveStatus === 'error' && 'Try Again'}
              </span>
            </button>
            
            {shareUrl && (
              <button 
                onClick={handleSharePlaylist}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Artwork Collage */}
      <div className="mb-8 grid grid-cols-3 gap-2 md:gap-4">
        {playlist.tracks.map((track: SpotifyApi.TrackObjectFull) => (
          <div key={track.id} className="aspect-square overflow-hidden rounded-md">
            <img 
              src={track.album.images[0]?.url} 
              alt={track.album.name}
              className="w-full h-full object-cover transition-transform hover:scale-110"
            />
          </div>
        ))}
      </div>
      
      {/* Track List */}
      <div className="bg-spotify-dark-gray bg-opacity-30 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Your Random Discoveries</h2>
        <TrackList tracks={playlist.tracks} />
      </div>
      
      {/* Call to Action */}
      <div className="mt-10 text-center">
        <p className="text-spotify-light-gray mb-4">
          Want to discover more random tracks?
        </p>
        <button 
          onClick={() => navigate('/select')}
          className="btn btn-outline"
        >
          Create Another Random Playlist
        </button>
      </div>
    </div>
  );
};

export default PlaylistResultPage;