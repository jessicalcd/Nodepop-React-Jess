import React, { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import appLogo from '../../assets/images/wallapop-svgrepo-com (1).svg';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { isLogged, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout()
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link 
            to={isLogged ? "/adverts" : "/login"} 
            className="text-xl font-bold hover:text-slate-300 transition-colors duration-150 flex items-center"
          >
            {/* <img src={appLogo} alt="App Logo" className="h-8 w-auto mr-2" />*/ }
            <span className="bg-green-500 p-2 rounded-md mr-2 text-sm">NP</span> {/* Placeholder logo */}
            {import.meta.env.VITE_APP_NAME || 'Nodepop'}
          </Link>
          <div className="space-x-2 sm:space-x-4 flex items-center">
            {isLogged && (
              <>
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
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150"
                  disabled={isLoadingAuth}
                >
                  Logout
                </button>
              </>
            )}
            {!isLogged && !isLoadingAuth && location.pathname !== '/login' && (
               <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`
                }
               >
                Login
               </NavLink>
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
    </div>
  );
};

export default Layout;