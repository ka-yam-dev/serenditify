import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Music, HeartIcon, AlertTriangle } from "lucide-react";
import { usePlaylistStore } from "../stores/playlistStore";
import { useAuthStore } from "../stores/authStore";
import GenreCard from "../components/GenreCard";
import MoodSelector from "../components/MoodSelector";
import { GENRES } from "../config/spotify";

const GenreSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { filters, setFilter, generatePlaylist, clearFilters } =
    usePlaylistStore();
  const { userProfile } = useAuthStore();

  const handleGenreToggle = (id: string, selected: boolean) => {
    setFilter("genres", id, selected);
  };

  const handleMoodToggle = (id: string, selected: boolean) => {
    setFilter("moods", id, selected);
  };

  const handleGeneratePlaylist = async () => {
    if (!userProfile) {
      return;
    }

    if (filters.genres.length === 0 && filters.moods.length === 0) {
      return;
    }

    navigate("/generating");
    const playlistId = await generatePlaylist();

    if (playlistId) {
      navigate(`/playlist/${playlistId}`);
    } else {
      navigate("/");
    }
  };

  const hasSelections = filters.genres.length > 0 || filters.moods.length > 0;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-spotify-light-gray hover:text-spotify-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>ホームに戻る</span>
          </button>

          <h1 className="text-3xl font-bold mb-2">
            ランダムプレイリストを作成
          </h1>
          <p className="text-spotify-light-gray">
            ジャンルとムードを選択して、8曲のランダムプレイリストを生成します
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col items-end">
          {!userProfile && (
            <div className="mb-3 flex items-center text-yellow-500 bg-yellow-500 bg-opacity-10 px-4 py-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>
                プレイリストを作成するにはPremiumプランに加入する必要があります。
              </span>
            </div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={clearFilters}
              className={`btn btn-outline flex items-center space-x-2 ${
                !hasSelections ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!hasSelections}
            >
              すべてクリア
            </button>

            <button
              onClick={handleGeneratePlaylist}
              className={`btn btn-primary flex items-center space-x-2 ${
                !hasSelections || !userProfile
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={!userProfile || !hasSelections}
            >
              <Music className="w-5 h-5" />
              <span>プレイリストを生成</span>
            </button>
          </div>
        </div>
      </div>

      {/* Genre Selection */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Music className="w-5 h-5 mr-2 text-spotify-green" />
          ジャンルを選択
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GENRES.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              isSelected={filters.genres.includes(genre.id)}
              onToggle={handleGenreToggle}
            />
          ))}
        </div>
      </div>

      {/* Mood Selection */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HeartIcon className="w-5 h-5 mr-2 text-pink-500" />
          ムードを選択
        </h2>

        <MoodSelector
          selectedMoods={filters.moods}
          onToggle={handleMoodToggle}
        />
      </div>

      {/* Action Button (Mobile) */}
      <div className="md:hidden mt-8">
        {!userProfile && (
          <div className="mb-3 flex items-center text-yellow-500 bg-yellow-500 bg-opacity-10 px-4 py-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>
              プレイリストを作成するにはPremiumプランに加入する必要があります。
            </span>
          </div>
        )}
        <div className="flex space-x-3">
          <button
            onClick={clearFilters}
            className={`btn btn-outline flex-1 ${
              !hasSelections ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!hasSelections}
          >
            すべてクリア
          </button>

          <button
            onClick={handleGeneratePlaylist}
            className={`btn btn-primary flex-1 flex items-center justify-center space-x-2 ${
              !hasSelections || !userProfile
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!userProfile || !hasSelections}
          >
            <Music className="w-5 h-5" />
            <span>プレイリストを生成</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreSelectionPage;
