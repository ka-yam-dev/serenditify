import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";

const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    setPosition,
  } = usePlayerStore();

  const [displayPosition, setDisplayPosition] = useState(0);
  const [progressInterval, setProgressInterval] = useState<number | null>(null);

  useEffect(() => {
    // Update the position display every second when playing
    if (isPlaying) {
      const interval = window.setInterval(() => {
        setDisplayPosition((prev) => {
          const newPosition = prev + 1000;
          return newPosition > duration ? duration : newPosition;
        });
      }, 1000);

      setProgressInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
  }, [isPlaying, duration, progressInterval]);

  useEffect(() => {
    // Reset display position when changing tracks
    setDisplayPosition(position);
  }, [position, currentTrack]);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newPosition = Math.floor(percentage * duration);
    setDisplayPosition(newPosition);

    try {
      await setPosition(newPosition);
    } catch (error) {
      console.error("Error setting position:", error);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newVolume = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    setVolume(newVolume);
  };

  return (
    <div className="bg-spotify-dark-gray bg-opacity-95 backdrop-blur-md shadow-md border-t border-gray-800 p-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center">
        {/* Progress bar (full width on mobile, hidden on desktop) */}
        <div className="w-full md:hidden mb-2">
          <div className="player-progress" onClick={handleProgressClick}>
            <div
              className="player-progress-bar"
              style={{ width: `${(displayPosition / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-spotify-light-gray mt-1">
            <span>{formatTime(displayPosition)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex items-center md:w-1/3">
          <img
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.album.name}
            className="w-12 h-12 mr-3 rounded shadow"
          />
          <div className="truncate">
            <div className="font-medium truncate">{currentTrack.name}</div>
            <div className="text-spotify-light-gray text-sm truncate">
              {currentTrack.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center space-x-4 my-3 md:my-0 md:w-1/3">
          <button
            className="p-1 rounded-full text-spotify-light-gray hover:text-spotify-white"
            onClick={previousTrack}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            className="p-2 bg-spotify-white rounded-full text-spotify-black"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <button
            className="p-1 rounded-full text-spotify-light-gray hover:text-spotify-white"
            onClick={nextTrack}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Volume (desktop) */}
        <div className="hidden md:flex items-center md:w-1/3 justify-end">
          {/* Progress bar */}
          <div className="w-40 mr-4">
            <div className="player-progress" onClick={handleProgressClick}>
              <div
                className="player-progress-bar"
                style={{ width: `${(displayPosition / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-spotify-light-gray mt-1">
              <span>{formatTime(displayPosition)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center space-x-2">
            <button
              className="text-spotify-light-gray hover:text-spotify-white"
              onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <div className="volume-slider w-20" onClick={handleVolumeChange}>
              <div
                className="volume-slider-bar"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
