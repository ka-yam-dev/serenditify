import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface PlayerState {
  currentTrack: SpotifyApi.TrackObjectFull | null;
  isPlaying: boolean;
  queue: SpotifyApi.TrackObjectFull[];
  position: number;
  volume: number;
  duration: number;
  playTrack: (track: SpotifyApi.TrackObjectFull) => Promise<void>;
  playPlaylist: (tracks: SpotifyApi.TrackObjectFull[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setPosition: (position: number) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  return {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    position: 0,
    volume: 0.5,
    duration: 0,
    
    playTrack: async (track) => {
      try {
        const { spotifyApi } = useAuthStore.getState();
        
        // Play the track on user's active device
        await spotifyApi.play({
          uris: [track.uri]
        });
        
        set({
          currentTrack: track,
          isPlaying: true,
          queue: [track],
          position: 0,
          duration: track.duration_ms
        });
      } catch (error) {
        console.error('Error playing track:', error);
        // If no active device is found, we could handle this case
      }
    },
    
    playPlaylist: async (tracks) => {
      if (tracks.length === 0) return;
      
      try {
        const { spotifyApi } = useAuthStore.getState();
        
        // Play the first track of the playlist
        await spotifyApi.play({
          uris: tracks.map(track => track.uri)
        });
        
        set({
          currentTrack: tracks[0],
          isPlaying: true,
          queue: tracks,
          position: 0,
          duration: tracks[0].duration_ms
        });
      } catch (error) {
        console.error('Error playing playlist:', error);
      }
    },
    
    togglePlayPause: async () => {
      const { isPlaying } = get();
      const { spotifyApi } = useAuthStore.getState();
      
      try {
        if (isPlaying) {
          await spotifyApi.pause();
        } else {
          await spotifyApi.play();
        }
        
        set({ isPlaying: !isPlaying });
      } catch (error) {
        console.error('Error toggling play/pause:', error);
      }
    },
    
    nextTrack: async () => {
      const { queue, currentTrack } = get();
      const { spotifyApi } = useAuthStore.getState();
      
      if (!currentTrack) return;
      
      const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
      
      if (currentIndex < queue.length - 1) {
        try {
          await spotifyApi.skipToNext();
          
          const nextTrack = queue[currentIndex + 1];
          set({
            currentTrack: nextTrack,
            position: 0,
            duration: nextTrack.duration_ms
          });
        } catch (error) {
          console.error('Error skipping to next track:', error);
        }
      }
    },
    
    previousTrack: async () => {
      const { queue, currentTrack, position } = get();
      const { spotifyApi } = useAuthStore.getState();
      
      if (!currentTrack) return;
      
      // If we're more than 3 seconds into the track, restart it instead of going to previous
      if (position > 3000) {
        try {
          await spotifyApi.seek(0);
          set({ position: 0 });
          return;
        } catch (error) {
          console.error('Error seeking to beginning of track:', error);
        }
      }
      
      const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
      
      if (currentIndex > 0) {
        try {
          await spotifyApi.skipToPrevious();
          
          const prevTrack = queue[currentIndex - 1];
          set({
            currentTrack: prevTrack,
            position: 0,
            duration: prevTrack.duration_ms
          });
        } catch (error) {
          console.error('Error skipping to previous track:', error);
        }
      }
    },
    
    setVolume: async (volume) => {
      try {
        const { spotifyApi } = useAuthStore.getState();
        await spotifyApi.setVolume(Math.round(volume * 100));
        set({ volume });
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    },
    
    setPosition: async (position) => {
      try {
        const { spotifyApi } = useAuthStore.getState();
        await spotifyApi.seek(position);
        set({ position });
      } catch (error) {
        console.error('Error seeking position:', error);
      }
    }
  };
});