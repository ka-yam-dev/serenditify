import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, handleCallback } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    const processCallback = async () => {
      if (location.pathname === '/callback') {
        const success = await handleCallback();
        if (success) {
          window.history.replaceState({}, document.title, '/');
        } else {
          window.history.replaceState({}, document.title, '/login');
        }
      }
    };
    
    processCallback();
  }, [location.pathname, handleCallback]);
  
  if (location.pathname === '/callback') {
    return (
      <div className="flex items-center justify-center h-screen bg-spotify-black">
        <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-spotify-green border-t-transparent"></div>
      </div>
    );
  }
  
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;