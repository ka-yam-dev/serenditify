import React from "react";
import { useNavigate } from "react-router-dom";
import { Disc, ShuffleIcon, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const HomePage: React.FC = () => {
  const { userProfile, isFree } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="py-8">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {userProfile
            ? `ようこそ, ${userProfile.display_name}`
            : "Welcome to Serenditify"}
        </h1>
        <p className="text-spotify-light-gray text-lg">
          Let's find your next musical surprise
        </p>
      </div>

      {/* Main CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 rounded-xl p-8 mb-12 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              今日のランダムプレイリストを作成しましょう
            </h2>
            <p className="text-lg text-spotify-light-gray">
              ジャンルとムードを選択。あなた限定のプレイリストを作成します。
            </p>
            {!userProfile && (
              <div className="mt-4 flex items-center text-yellow-500 bg-yellow-500 bg-opacity-10 px-4 py-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>
                  プレイリストを作成するにはPremiumプランに加入する必要があります。
                </span>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => navigate("/select")}
              className={`btn btn-primary flex items-center space-x-2 ${
                isFree ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!userProfile}
            >
              <ShuffleIcon className="w-5 h-5" />
              <span>プレイリストを作成</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card hover:bg-spotify-dark-gray hover:bg-opacity-90">
          <div className="flex mb-4">
            <div className="w-12 h-12 rounded-full bg-spotify-green bg-opacity-20 flex items-center justify-center mr-4">
              <Disc className="w-6 h-6 text-spotify-green" />
            </div>
            <h3 className="text-xl font-bold">音楽の世界を広げる</h3>
          </div>
          <p className="text-spotify-light-gray">
            いつも同じ曲ばかり聴いていませんか？
            <br />
            このサービスなら、思いがけない最高の音楽との出会いが待っています。
          </p>
        </div>

        <div className="card hover:bg-spotify-dark-gray hover:bg-opacity-90">
          <div className="flex mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center mr-4">
              <ShuffleIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">思いがけない音楽との出会い</h3>
          </div>
          <p className="text-spotify-light-gray">
            嗜好を分析して予測する従来のアルゴリズムとは異なり、
            <br />
            何が出てくるか分からない、予期せぬ音楽との出会いを提供します。
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">ご利用方法</h2>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1 p-6 bg-spotify-dark-gray rounded-lg">
            <div className="text-spotify-green text-4xl font-bold mb-2">1</div>
            <h3 className="text-xl font-semibold mb-2">
              ジャンルとムードを選ぶ
            </h3>
            <p className="text-spotify-light-gray">
              今日の気分に合う音楽のジャンルやムードを選択してください。
            </p>
          </div>

          <div className="flex-1 p-6 bg-spotify-dark-gray rounded-lg">
            <div className="text-spotify-green text-4xl font-bold mb-2">2</div>
            <h3 className="text-xl font-semibold mb-2">ランダムな曲を生成</h3>
            <p className="text-spotify-light-gray">
              選んだ条件に合わせて、ランダムな曲を9曲自動で選び、プレイリストにします。
            </p>
          </div>

          <div className="flex-1 p-6 bg-spotify-dark-gray rounded-lg">
            <div className="text-spotify-green text-4xl font-bold mb-2">3</div>
            <h3 className="text-xl font-semibold mb-2">
              {" "}
              気に入った曲は保存・シェア
            </h3>
            <p className="text-spotify-light-gray">
              聴いてみて気に入った曲があれば、Spotifyへ保存したり、友達にシェアしたりできます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
