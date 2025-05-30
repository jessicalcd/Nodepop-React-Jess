import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  getStoredToken, 
  storeToken, 
  removeStoredToken, 
  getShouldRememberSession,
  setShouldRememberSession
} from '../utils/storage'; 
import { getCurrentUser } from '../services/authService'; // ¡Importa getCurrentUser!
import { User } from '../types'; 

interface AuthContextType {
  isLogged: boolean;
  token: string | null;
  currentUser: User | null; // Para guardar datos del usuario logueado
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
    // Esta función asume que el token ya está en apiClient por el interceptor
    // o porque se acaba de hacer login y está en el estado 'token'.
    // No es necesario pasar el token como argumento si el interceptor está activo.
    if (getStoredToken()) { // Solo intenta si hay un token
      try {
        console.log('[AuthContext] Intentando obtener currentUser...');
        const user = await getCurrentUser();
        setCurrentUser(user);
        console.log('[AuthContext] CurrentUser obtenido:', user);
      } catch (error) {
        console.error("[AuthContext] Error al obtener datos del usuario actual (posible token inválido/expirado):", error);
        // Si falla obtener el usuario (ej. token expirado), deslogueamos
        // Es importante que la función logout se defina antes o se use con useCallback para evitar bucles si logout cambia.
        // Para simplificar, llamaremos a las funciones de limpieza directamente aquí.
        removeStoredToken();
        setTokenState(null);
        setCurrentUser(null);
        // Considera si aquí deberías forzar una redirección a /login si la app ya está montada.
        // El ProtectedRoute se encargará de redirigir si isLogged se vuelve false.
      }
    }
  }, []); // No hay dependencias si getStoredToken es estable y getCurrentUser no depende de props/estado de aquí

 
  const logout = useCallback(() => {
    console.log('[AuthContext] Cerrando sesión...');
    removeStoredToken();
    setTokenState(null);
    setCurrentUser(null);

    //window.location.href = '/login'; 
  }, []);

 
  useEffect(() => {
    const attemptAutoLogin = async () => {
      setIsLoadingAuth(true); // Indicar que estamos cargando
      const storedToken = getStoredToken();
      const shouldRemember = getShouldRememberSession();

if (storedToken && shouldRemember) {
        console.log('[AuthContext] Token encontrado en storage y se debe recordar. Estableciendo token.');
        setTokenState(storedToken); // Establece el token para que el interceptor de apiClient lo use
        await fetchAndSetCurrentUser(); // Intenta obtener los datos del usuario
      } else if (storedToken && !shouldRemember) {
        // Si hay token pero no se debe recordar (sesión anterior), limpiar
        console.log('[AuthContext] Token encontrado pero no se debe recordar. Limpiando.');
        removeStoredToken(); // Llama a la función de limpieza
        setTokenState(null);
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
    setTokenState(newToken); // Establece el token para que el interceptor de apiClient lo use
    setIsLoadingAuth(true); // Mientras se carga el usuario
    await fetchAndSetCurrentUser(); // Obtiene los datos del usuario después de establecer el token
    setIsLoadingAuth(false);
  };


  return (
    <AuthContext.Provider value={{ 
      isLogged: !!token, 
      token, 
      currentUser,  // <--- PROVEER currentUser
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