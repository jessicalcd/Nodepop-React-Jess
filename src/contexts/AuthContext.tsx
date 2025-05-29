import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  getStoredToken, 
  storeToken, 
  removeStoredToken, 
  getShouldRememberSession,
  setShouldRememberSession
} from '../utils/storage'; 

interface AuthContextType {
  isLogged: boolean;
  token: string | null;
  // currentUser: User | null; // Para guardar datos del usuario logueado
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
  isLoadingAuth: boolean; // Para saber si aún se está cargando el estado inicial de auth
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 
 
  const logout = useCallback(() => {
    removeStoredToken();

    setTokenState(null);

    window.location.href = '/login'; 
  }, []);

 
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const storedToken = getStoredToken();
      const shouldRemember = getShouldRememberSession();

      if (storedToken && shouldRemember) {
        setTokenState(storedToken);
      } else if (!shouldRemember && storedToken) {
        logout();
      }
      setIsLoadingAuth(false); 
    };

    attemptAutoLogin();
  }, [logout]);


  const login = (newToken: string, remember: boolean = false) => {
    storeToken(newToken);
    setShouldRememberSession(remember);
    setTokenState(newToken);
  };


  return (
    <AuthContext.Provider value={{ 
      isLogged: !!token, 
      token, 
      // currentUser, 
      login, 
      logout, 
      isLoadingAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};