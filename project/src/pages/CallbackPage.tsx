import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const CallbackPage: React.FC = () => {
  const { handleCallback } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const success = await handleCallback();
        if (success) {
          navigate("/", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error processing callback:", error);
        navigate("/login", { replace: true });
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-spotify-black">
      <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-spotify-green border-t-transparent"></div>
    </div>
  );
};

export default CallbackPage;
