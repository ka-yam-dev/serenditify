// Spotify API Configuration

// Client credentials should be set in .env file
export const SPOTIFY_CLIENT_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "24df0f6abea64b2c8671922b0489324a";

// Redirect URI should be set in .env file
export const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  "https://lighthearted-alfajores-1e4fa2.netlify.app/callback";

// Scopes required for our application
export const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-library-read",
  "user-library-modify",
].join(" ");

// API endpoints
export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const API_BASE_URL = "https://api.spotify.com/v1";

// PKCE Authentication helpers
export const generateCodeVerifier = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join("");
};

export const generateCodeChallenge = async (codeVerifier: string) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// Predefined genre and mood options
export const GENRES = [
  { id: "pop", name: "Pop", color: "bg-pink-500" },
  { id: "rock", name: "Rock", color: "bg-red-600" },
  { id: "hip-hop", name: "Hip Hop", color: "bg-yellow-500" },
  { id: "r-n-b", name: "R&B", color: "bg-purple-600" },
  { id: "electronic", name: "Electronic", color: "bg-blue-500" },
  { id: "indie", name: "Indie", color: "bg-green-600" },
  { id: "jazz", name: "Jazz", color: "bg-orange-600" },
  { id: "classical", name: "Classical", color: "bg-gray-600" },
];

export const MOODS = [
  { id: "energetic", name: "Energetic", icon: "Zap" },
  { id: "chill", name: "Chill", icon: "Cloud" },
  { id: "happy", name: "Happy", icon: "Smile" },
  { id: "sad", name: "Sad", icon: "CloudRain" },
  { id: "romantic", name: "Romantic", icon: "Heart" },
  { id: "focus", name: "Focus", icon: "Target" },
];
