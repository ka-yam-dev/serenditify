import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { usePlaylistStore } from "../stores/playlistStore";

const PlaylistGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const { isGenerating } = usePlaylistStore();

  // If we navigate here but isGenerating is false,
  // it means we're coming here without triggering the generation properly
  useEffect(() => {
    if (!isGenerating) {
      navigate("/select");
    }
  }, [isGenerating, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Music className="w-20 h-20 text-spotify-green animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full border-4 border-spotify-green border-opacity-30 animate-spin-slow"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">
          ランダムプレイリストを作成中
        </h1>

        <p className="text-xl text-spotify-light-gray mb-8 max-w-lg">
          何百万もの曲の中からあなたにぴったりの曲を探しています...
        </p>

        <div className="w-64 h-1 bg-spotify-dark-gray rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-spotify-green origin-left animate-pulse-slow"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistGenerationPage;
