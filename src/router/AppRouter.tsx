import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'; 


const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('../pages/auth/SignupPage'));
const AdvertsPage = React.lazy(() => import('../pages/adverts/AdvertsPage'));
const AdvertDetailPage = React.lazy(() => import('../pages/adverts/AdvertDetailPage'));
const NewAdvertPage = React.lazy(() => import('../pages/adverts/NewAdvertPage'));
const NotFoundPage = React.lazy(() => import('../pages/misc/NotFoundPage'));


const PageLoader: React.FC = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-700"></div>
    <p className="mt-4 text-slate-700 text-lg font-semibold">Cargando página...</p>
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/adverts" replace />} />
          <Route path="/adverts" element={<AdvertsPage />} />
          <Route path="/adverts/new" element={<NewAdvertPage />} />
          <Route path="/adverts/:id" element={<AdvertDetailPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;