import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { loginUser } from '../../services/authService'; 
import Layout from '../../components/Layout/Layout'; 
import axios from 'axios'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/adverts';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const authResponse = await loginUser({ email, password });
      auth.login(authResponse.accessToken, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Error completo en handleSubmit:", err); 
      let errorMessage = 'Error desconocido al iniciar sesión. Inténtalo de nuevo.';

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Datos del error de respuesta:", err.response.data);
          console.error("Estado del error de respuesta:", err.response.status);
          errorMessage = err.response.data?.message || `Error del servidor: ${err.response.status}`;
        } else if (err.request) {
          console.error("Petición enviada pero sin respuesta:", err.request);
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o que el servidor esté activo.';
        } else {
          console.error('Error de configuración de Axios:', err.message);
          errorMessage = `Error en la petición: ${err.message}`;
        }
      } else if (err instanceof Error) { 
        console.error('Error genérico de JavaScript:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }; 


  return ( 
    <Layout title="Iniciar Sesión en Nodepop">
      <div className="max-w-md mx-auto mt-8 sm:mt-12 bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email (usuario)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Recordar sesión
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
        {/* Signup Link (opcional) */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Nuevo en Nodepop?{' '}
          <Link to="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            {/* TODO: La ruta /auth/signup no está definida aún en AppRouter si no la has añadido.
                        Para la práctica, el backend sí tiene este endpoint.
                        Habría que añadir <Route path="/auth/signup" element={<SignupPage />} /> en AppRouter.tsx
                        y crear el componente SignupPage.tsx.
            */}
            Crea una cuenta (funcionalidad de registro no implementada en frontend aún)
          </Link>
        </p>
      </div>
    </Layout>
  ); 
}; 

export default LoginPage;