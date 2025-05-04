import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { usePlayerStore } from "../stores/playerStore";

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const SpotifyPlayer: React.FC = () => {
  const { accessToken } = useAuthStore();
  const { setDeviceId } = usePlayerStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Serenditify Web Player",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Ready handling
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error("Failed to initialize:", message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Failed to authenticate:", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account:", message);
      });

      player.addListener("playback_error", ({ message }) => {
        console.error("Failed to perform playback:", message);
      });

      // Connect to the player
      player.connect();
    };

    return () => {
      script.remove();
    };
  }, [accessToken, setDeviceId]);

  return (
    <div className="fixed bottom-4 left-4">
      {isReady && (
        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
          Web Player Ready
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;
