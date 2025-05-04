import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import SpotifyPlayer from "./components/SpotifyPlayer";
import LoginPage from "./pages/LoginPage";
import CallbackPage from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";
import GenreSelectionPage from "./pages/GenreSelectionPage";
import PlaylistGenerationPage from "./pages/PlaylistGenerationPage";
import PlaylistResultPage from "./pages/PlaylistResultPage";
import Layout from "./components/Layout";

function App() {
  const { isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-spotify-black">
        <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-spotify-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <SpotifyPlayer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="select" element={<GenreSelectionPage />} />
          <Route path="generating" element={<PlaylistGenerationPage />} />
          <Route path="playlist/:playlistId" element={<PlaylistResultPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
