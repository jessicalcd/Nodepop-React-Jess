import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const ProtectedRoute: React.FC = () => {
  const { isLogged, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-700"></div>
        <p className="mt-4 text-slate-700 text-lg font-semibold">Verificando sesión...</p>
      </div>
    );
  }

  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;