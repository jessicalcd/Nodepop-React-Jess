import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  getStoredToken, 
  storeToken, 
  removeStoredToken, 
  getShouldRememberSession,
  setShouldRememberSession
} from '../utils/storage'; 
import { getCurrentUser } from '../services/authService'; 
import { User } from '../types'; 

interface AuthContextType {
  isLogged: boolean;
  token: string | null;
  currentUser: User | null; 
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
  isLoadingAuth: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 

  const fetchAndSetCurrentUser = useCallback(async () => {
    if (getStoredToken()) { 
      try {
        console.log('[AuthContext] Intentando obtener currentUser...');
        const user = await getCurrentUser();
        setCurrentUser(user);
        console.log('[AuthContext] CurrentUser obtenido:', user);
      } catch (error) {
        console.error("[AuthContext] Error al obtener datos del usuario actual (posible token inválido/expirado):", error);
        removeStoredToken();
        setTokenState(null);
        setCurrentUser(null);
      }
    }
  }, []); 
 
  const logout = useCallback(() => {
    console.log('[AuthContext] Cerrando sesión...');
    removeStoredToken();
    setTokenState(null);
    setCurrentUser(null);

  }, []);

 
  useEffect(() => {
    const attemptAutoLogin = async () => {
      setIsLoadingAuth(true); 
      const storedToken = getStoredToken();
      const shouldRemember = getShouldRememberSession();

if (storedToken && shouldRemember) {
        console.log('[AuthContext] Token encontrado en storage y se debe recordar. Estableciendo token.');
        setTokenState(storedToken); 
        await fetchAndSetCurrentUser(); 
      } else if (storedToken && !shouldRemember) {
        console.log('[AuthContext] Token encontrado pero no se debe recordar. Limpiando.');
        removeStoredToken(); 
        setCurrentUser(null);
      }
      setIsLoadingAuth(false);
    };
    attemptAutoLogin();
  }, []);


  const login = async (newToken: string, remember: boolean = false) => {
    console.log('[AuthContext] Iniciando sesión con nuevo token.');
    storeToken(newToken);
    setShouldRememberSession(remember);
    setTokenState(newToken); 
    setIsLoadingAuth(true); 
    await fetchAndSetCurrentUser(); 
    setIsLoadingAuth(false);
  };


  return (
    <AuthContext.Provider value={{ 
      isLogged: !!token, 
      token, 
      currentUser,  
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