import React, { ReactNode, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { isLogged, logout, isLoadingAuth, currentUser } = useAuth();
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false); 

  const handleLogoutInitiate = () => {
    setShowLogoutConfirmModal(true); 
  };

  const handleLogoutConfirm = () => {
    logout(); 
    setShowLogoutConfirmModal(false); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link 
            to={isLogged ? "/adverts" : "/login"} 
            className="text-xl font-bold hover:text-slate-300 transition-colors duration-150 flex items-center"
          >
            <span className="bg-green-500 p-2 rounded-md mr-2 text-sm">NP</span> 
            {import.meta.env.VITE_APP_NAME || 'Nodepop'}
          </Link>
          <div className="space-x-2 sm:space-x-4 flex items-center">
            {isLogged ? (
              <>
                {currentUser && (
                  <span className="text-sm text-slate-300 hidden sm:block">
                    Hola, {currentUser.name || currentUser.email}
                  </span>
                )}
                <NavLink 
                  to="/adverts" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`
                  }
                >
                  Anuncios
                </NavLink>
                <NavLink 
                  to="/adverts/new" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`
                  }
                >
                  Crear Anuncio
                </NavLink>
                <button
                  onClick={handleLogoutInitiate} 
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150"
                  disabled={isLoadingAuth}
                >
                  Logout
                </button>
              </>
            ) : (
              !isLoadingAuth && location.pathname !== '/login' && (
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`
                  }
                >
                 Login
                </NavLink>
              )
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-6">{title}</h1>}
        {children}
      </main>

      <footer className="bg-slate-200 text-slate-600 text-center p-4 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Nodepop React. Práctica Fundamentos de React.</p>
      </footer>

      {showLogoutConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all sm:my-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Confirmar Cierre de Sesión</h3>
            <p className="text-slate-600 mb-6 text-sm">
              ¿Estás seguro de que quieres cerrar tu sesión?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirmModal(false)} 
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition duration-150 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutConfirm} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm font-medium"
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;