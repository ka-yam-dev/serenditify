import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-dark-gray flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center p-6 md:p-12">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <div className="animate-bounce-slow inline-block mb-6">
            <Music className="w-16 h-16 text-spotify-green" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            次のお気に入りの曲を見つけよう
          </h1>

          <p className="text-xl text-spotify-light-gray mb-8 max-w-lg mx-auto md:mx-0">
            あなたの好みに合わせてランダムに選ばれた曲で、
            <br />
            新しい音楽との出会いを楽しみましょう。
          </p>

          <button
            onClick={() => login()}
            className="bg-spotify-green hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-lg flex items-center space-x-2 mx-auto md:mx-0"
          >
            <span>Spotifyと連携</span>
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full bg-spotify-green opacity-10 animate-pulse-slow"></div>
            <img
              src="https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="音楽を楽しむ人"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl transform rotate-3"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-spotify-dark-gray py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Serenditifyの使い方
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-spotify-black p-6 rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-spotify-green text-xl font-bold mb-2">
                1. 好みを選択
              </div>
              <p className="text-spotify-light-gray">
                今の気分に合わせて、ジャンルやムードを選んでください。
              </p>
            </div>

            <div className="bg-spotify-black p-6 rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-spotify-green text-xl font-bold mb-2">
                2. ランダムな曲を取得
              </div>
              <p className="text-spotify-light-gray">
                選択した条件に合わせて、9曲のランダムな曲を選びます。
              </p>
            </div>

            <div className="bg-spotify-black p-6 rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-spotify-green text-xl font-bold mb-2">
                3. 保存と共有
              </div>
              <p className="text-spotify-light-gray">
                気に入った曲は、Spotifyに保存して友達とシェアできます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-spotify-black py-6 px-4 text-center text-spotify-light-gray text-sm">
        <p>
          このアプリはSpotifyの公式アプリではありません。音楽の発見と共有のために作られました。
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
