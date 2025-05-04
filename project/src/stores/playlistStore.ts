import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { GENRES, MOODS } from "../config/spotify";

interface PlaylistFilters {
  genres: string[];
  moods: string[];
}

interface PlaylistState {
  isGenerating: boolean;
  currentPlaylist: {
    id: string | null;
    name: string;
    tracks: SpotifyApi.TrackObjectFull[];
    filters: PlaylistFilters;
    created: Date | null;
  };
  savedPlaylists: {
    id: string;
    spotifyId: string;
    name: string;
    tracks: SpotifyApi.TrackObjectFull[];
    filters: PlaylistFilters;
    created: Date;
  }[];
  filters: PlaylistFilters;
  setFilter: (type: "genres" | "moods", value: string, active: boolean) => void;
  generatePlaylist: () => Promise<string | null>;
  saveCurrentPlaylist: () => Promise<string | null>;
  getPlaylistById: (id: string) => any;
  clearFilters: () => void;
}

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export const usePlaylistStore = create<PlaylistState>((set, get) => {
  return {
    isGenerating: false,
    currentPlaylist: {
      id: null,
      name: "",
      tracks: [],
      filters: { genres: [], moods: [] },
      created: null,
    },
    savedPlaylists: [],
    filters: {
      genres: [],
      moods: [],
    },

    setFilter: (type, value, active) => {
      const { filters } = get();

      if (active) {
        // Add filter if not already present
        set({
          filters: {
            ...filters,
            [type]: filters[type].includes(value)
              ? filters[type]
              : [...filters[type], value],
          },
        });
      } else {
        // Remove filter
        set({
          filters: {
            ...filters,
            [type]: filters[type].filter((item) => item !== value),
          },
        });
      }
    },

    clearFilters: () => {
      set({
        filters: {
          genres: [],
          moods: [],
        },
      });
    },

    generatePlaylist: async () => {
      const { filters } = get();
      const { spotifyApi } = useAuthStore.getState();

      if (filters.genres.length === 0 && filters.moods.length === 0) {
        // Need at least one filter
        return null;
      }

      set({ isGenerating: true });

      try {
        // Get genre names for the playlist title
        const selectedGenres = filters.genres.map(
          (id) => GENRES.find((genre) => genre.id === id)?.name || id
        );

        const selectedMoods = filters.moods.map(
          (id) => MOODS.find((mood) => mood.id === id)?.name || id
        );

        // Create a search query based on filters
        let searchQuery = "";

        if (filters.genres.length > 0) {
          // Use the first genre as a main seed
          searchQuery = `genre:"${selectedGenres[0]}"`;
        }

        // Generate playlist name
        const date = new Date();
        const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
        const playlistName = `${formattedDate}のプレイリスト - ${[
          ...selectedGenres,
          ...selectedMoods,
        ].join("、")}`;

        // Search for tracks
        const results = await spotifyApi.search(
          searchQuery || "year:1990-2025",
          ["track"],
          { limit: 50 }
        );

        // Select exactly 8 tracks from the results
        const shuffledTracks =
          results.tracks?.items.sort(() => Math.random() - 0.5) || [];
        const selectedTracks = shuffledTracks.slice(0, 9);

        // Get full track details
        const trackIds = selectedTracks.map((track) => track.id);
        const fullTracks = await spotifyApi.getTracks(trackIds);

        const playlistId = generateId();

        set({
          isGenerating: false,
          currentPlaylist: {
            id: playlistId,
            name: playlistName,
            tracks: fullTracks.tracks,
            filters: { ...filters },
            created: new Date(),
          },
        });

        return playlistId;
      } catch (error) {
        console.error("Error generating playlist:", error);
        set({ isGenerating: false });
        return null;
      }
    },

    saveCurrentPlaylist: async () => {
      const { currentPlaylist } = get();
      const { spotifyApi, userProfile } = useAuthStore.getState();

      if (!currentPlaylist.id || !userProfile) {
        return null;
      }

      try {
        // Create a new playlist on Spotify
        const playlist = await spotifyApi.createPlaylist(userProfile.id, {
          name: currentPlaylist.name,
          description: "Created with Spotify Random Discovery",
          public: false,
        });

        // Add tracks to the playlist
        await spotifyApi.addTracksToPlaylist(
          playlist.id,
          currentPlaylist.tracks.map((track) => track.uri)
        );

        // Save the playlist to our local store
        const savedPlaylist = {
          id: currentPlaylist.id,
          spotifyId: playlist.id,
          name: currentPlaylist.name,
          tracks: currentPlaylist.tracks,
          filters: currentPlaylist.filters,
          created: currentPlaylist.created || new Date(),
        };

        set((state) => ({
          savedPlaylists: [...state.savedPlaylists, savedPlaylist],
        }));

        return playlist.id;
      } catch (error) {
        console.error("Error saving playlist:", error);
        return null;
      }
    },

    getPlaylistById: (id) => {
      const { currentPlaylist, savedPlaylists } = get();

      if (currentPlaylist.id === id) {
        return currentPlaylist;
      }

      return savedPlaylists.find((playlist) => playlist.id === id) || null;
    },
  };
});
