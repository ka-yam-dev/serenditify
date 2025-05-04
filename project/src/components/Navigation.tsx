import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music, LogOut, User } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const Navigation: React.FC = () => {
  const { userProfile, logout, isFree } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-spotify-dark-gray bg-opacity-95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-spotify-green" />
            <span className="text-xl font-bold">Serenditify</span>
          </Link>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {!userProfile && (
              <button
                onClick={handleLogout}
                className="text-spotify-light-gray hover:text-white flex items-center space-x-2 px-4 py-2 rounded-full border border-spotify-light-gray hover:border-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>ログアウト</span>
              </button>
            )}
            {userProfile && (
              <div className="flex items-center space-x-4">
                {!isFree && (
                  <div className="relative group">
                    <div className="w-9 h-9 rounded-full bg-spotify-light-gray flex items-center justify-center cursor-pointer">
                      {userProfile.images && userProfile.images[0] ? (
                        <img
                          src={userProfile.images[0].url}
                          alt={userProfile.display_name || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-spotify-white" />
                      )}
                    </div>

                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-spotify-dark-gray rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                      <div className="px-4 py-2 text-sm">
                        <div className="font-medium">
                          {userProfile.display_name}
                        </div>
                        <div className="text-spotify-light-gray truncate">
                          {userProfile.email}
                        </div>
                      </div>

                      <div className="border-t border-gray-700"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm hover:bg-spotify-black flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ログアウト</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
