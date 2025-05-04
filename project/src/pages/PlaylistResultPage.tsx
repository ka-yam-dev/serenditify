import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Share2, PlayCircle, Play } from "lucide-react";
import { usePlaylistStore } from "../stores/playlistStore";
import { usePlayerStore } from "../stores/playerStore";
import TrackList from "../components/TrackList";

const PlaylistResultPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { getPlaylistById, saveCurrentPlaylist } = usePlaylistStore();
  const { playTrack, playPlaylist } = usePlayerStore();

  const [playlist, setPlaylist] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    if (playlistId) {
      const playlistData = getPlaylistById(playlistId);

      if (!playlistData) {
        navigate("/select");
        return;
      }

      setPlaylist(playlistData);
    }
  }, [playlistId, getPlaylistById, navigate]);

  const handleSavePlaylist = async () => {
    if (saveStatus === "idle") {
      setSaveStatus("saving");

      const spotifyId = await saveCurrentPlaylist();

      if (spotifyId) {
        setSaveStatus("saved");
        setShareUrl(`https://open.spotify.com/playlist/${spotifyId}`);
      } else {
        setSaveStatus("error");
      }
    }
  };

  const handleSharePlaylist = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);

      // Open in Spotify if available
      window.open(shareUrl, "_blank");
    }
  };

  const handlePlayAll = async () => {
    if (playlist && playlist.tracks.length > 0) {
      try {
        setPlaybackError(null);
        await playPlaylist(playlist.tracks);
        // 最初の曲をcurrentTrackとして設定
        await playTrack(playlist.tracks[0]);
      } catch (error) {
        console.error("Playback error:", error);
        setPlaybackError(
          "アクティブなSpotifyデバイスが見つかりません。Spotifyアプリを開いて再生してください。"
        );
      }
    }
  };

  const handlePlayTrack = async (track: SpotifyApi.TrackObjectFull) => {
    try {
      setPlaybackError(null);
      await playTrack(track);
    } catch (error) {
      console.error("Playback error:", error);
      setPlaybackError(
        "アクティブなSpotifyデバイスが見つかりません。Spotifyアプリを開いて再生してください。"
      );
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
  const selectedGenres =
    playlist.filters.genres.length > 0
      ? playlist.filters.genres.join(", ")
      : "Any";

  const selectedMoods =
    playlist.filters.moods.length > 0
      ? playlist.filters.moods.join(", ")
      : "Any";

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/select")}
          className="flex items-center text-spotify-light-gray hover:text-spotify-white mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>新しいプレイリストを作成</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            <p className="text-spotify-light-gray">
              {playlist.tracks.length}曲 • {selectedGenres}のジャンルと
              {selectedMoods}のムードから生成
            </p>
          </div>

          <div className="flex mt-4 md:mt-0">
            <button
              onClick={handlePlayAll}
              className="bg-spotify-green hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 mr-3 transition-all duration-300"
            >
              <PlayCircle className="w-5 h-5" />
              <span>すべて再生</span>
            </button>

            <button
              onClick={handleSavePlaylist}
              className={`${
                saveStatus === "saved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-2 border-white hover:bg-white hover:bg-opacity-10"
              } text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 mr-3 transition-all duration-300`}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
            >
              <Save className="w-5 h-5" />
              <span>
                {saveStatus === "idle" && "Spotifyに保存"}
                {saveStatus === "saving" && "保存中..."}
                {saveStatus === "saved" && "保存完了！"}
                {saveStatus === "error" && "再試行"}
              </span>
            </button>

            {shareUrl && (
              <button
                onClick={handleSharePlaylist}
                className="border-2 border-white hover:bg-white hover:bg-opacity-10 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                <span>共有</span>
              </button>
            )}
          </div>
        </div>

        {playbackError && (
          <div className="mt-4 text-red-500 bg-red-500 bg-opacity-10 p-4 rounded-lg">
            {playbackError}
          </div>
        )}
      </div>

      {/* Artwork Collage */}
      <div className="mb-8 grid grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto">
        {playlist.tracks
          .slice(0, 9)
          .map((track: SpotifyApi.TrackObjectFull) => (
            <div
              key={track.id}
              className="aspect-square overflow-hidden rounded-md relative group cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
      </div>

      {/* Track List */}
      <div className="bg-spotify-dark-gray bg-opacity-30 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">
          あなたのランダムディスカバリー
        </h2>
        <TrackList tracks={playlist.tracks} />
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <p className="text-spotify-light-gray mb-4">
          もっと曲を探してみませんか？
        </p>
        <button
          onClick={() => navigate("/select")}
          className="border-2 border-white hover:bg-white hover:bg-opacity-10 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
        >
          新しいプレイリストを作成
        </button>
      </div>
    </div>
  );
};

export default PlaylistResultPage;
