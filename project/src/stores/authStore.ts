import { create } from "zustand";
import SpotifyWebApi from "spotify-web-api-js";
import {
  SPOTIFY_CLIENT_ID,
  REDIRECT_URI,
  SCOPES,
  AUTH_ENDPOINT,
  generateCodeVerifier,
  generateCodeChallenge,
} from "../config/spotify";
import { spotifyApi } from "../utils/spotify";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  userProfile: SpotifyApi.CurrentUsersProfileResponse | null;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  getUserProfile: () => Promise<void>;
  isFree: boolean;
  initialize: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const spotifyApi = new SpotifyWebApi();

  // Initialize auth state from local storage
  const init = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    const expiresAt = localStorage.getItem("spotify_expires_at");

    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
    }

    try {
      const userProfile = await spotifyApi.getMe();
      set({
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? parseInt(expiresAt, 10) : null,
        isAuthenticated:
          !!accessToken &&
          Date.now() < (expiresAt ? parseInt(expiresAt, 10) : 0),
        isInitializing: false,
        userProfile,
        spotifyApi,
        isFree: userProfile.product === "free",
      });

      // If we have a token but it's close to expiring, refresh it
      if (
        accessToken &&
        expiresAt &&
        Date.now() > parseInt(expiresAt, 10) - 300000
      ) {
        get().refreshAccessToken();
      }

      // If authenticated, fetch the user profile
      if (accessToken && expiresAt && Date.now() < parseInt(expiresAt, 10)) {
        get().getUserProfile();
      }
    } catch (error) {
      console.error("Failed to initialize:", error);
      localStorage.removeItem("spotify_access_token");
      set({
        accessToken: null,
        userProfile: null,
        isFree: false,
        isInitializing: false,
      });
    }
  };

  // Initial load
  setTimeout(init, 0);

  return {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    isAuthenticated: false,
    isInitializing: true,
    userProfile: null,
    spotifyApi,
    isFree: false,

    initialize: init,

    login: async () => {
      const codeVerifier = generateCodeVerifier(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store code verifier in local storage to use during callback
      localStorage.setItem("spotify_code_verifier", codeVerifier);

      const authUrl = new URL(AUTH_ENDPOINT);
      authUrl.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
      authUrl.searchParams.append("scope", SCOPES);
      authUrl.searchParams.append("code_challenge_method", "S256");
      authUrl.searchParams.append("code_challenge", codeChallenge);

      window.location.href = authUrl.toString();
    },

    logout: () => {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_expires_at");
      localStorage.removeItem("spotify_code_verifier");

      set({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        isAuthenticated: false,
        userProfile: null,
        isFree: false,
      });

      spotifyApi.setAccessToken(null);
    },

    handleCallback: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      if (error || !code) {
        console.error("Authentication error:", error);
        return false;
      }

      try {
        const codeVerifier = localStorage.getItem("spotify_code_verifier");

        if (!codeVerifier) {
          throw new Error("Code verifier not found");
        }

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get access token");
        }

        const { access_token, refresh_token, expires_in } = data;
        const expiresAt = Date.now() + expires_in * 1000;

        localStorage.setItem("spotify_access_token", access_token);
        localStorage.setItem("spotify_refresh_token", refresh_token);
        localStorage.setItem("spotify_expires_at", expiresAt.toString());
        localStorage.removeItem("spotify_code_verifier");

        spotifyApi.setAccessToken(access_token);

        set({
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expiresAt,
          isAuthenticated: true,
          isFree: data.product === "free",
        });

        await get().getUserProfile();

        return true;
      } catch (error) {
        console.error("Token exchange error:", error);
        return false;
      }
    },

    refreshAccessToken: async () => {
      const { refreshToken } = get();

      if (!refreshToken) {
        return false;
      }

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to refresh token");
        }

        const { access_token, expires_in } = data;
        const expiresAt = Date.now() + expires_in * 1000;

        localStorage.setItem("spotify_access_token", access_token);
        localStorage.setItem("spotify_expires_at", expiresAt.toString());

        // The refreshToken may be updated in the response
        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          set({ refreshToken: data.refresh_token });
        }

        spotifyApi.setAccessToken(access_token);

        set({
          accessToken: access_token,
          expiresAt: expiresAt,
          isAuthenticated: true,
          isFree: data.product === "free",
        });

        return true;
      } catch (error) {
        console.error("Token refresh error:", error);
        get().logout();
        return false;
      }
    },

    getUserProfile: async () => {
      try {
        const userProfile = await spotifyApi.getMe();
        set({ userProfile });
      } catch (error) {
        console.error("Error fetching user profile:", error);

        // If we get a 401, try to refresh the token
        if (error.status === 401) {
          const refreshed = await get().refreshAccessToken();
          if (refreshed) {
            // Try again after refreshing
            const userProfile = await spotifyApi.getMe();
            set({ userProfile });
          }
        }
      }
    },

    setAccessToken: async (token) => {
      localStorage.setItem("spotify_access_token", token);
      spotifyApi.setAccessToken(token);

      try {
        const userProfile = await spotifyApi.getMe();
        set({
          accessToken: token,
          userProfile,
          isFree: userProfile.product === "free",
        });
      } catch (error) {
        console.error("Failed to get user profile:", error);
      }
    },
  };
});
