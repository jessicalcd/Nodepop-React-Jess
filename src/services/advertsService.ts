// src/services/advertsService.ts
import axios from 'axios'; // Necesario para usar axios.get() directamente en getAdvertDetail
import apiClient from '../api/client'; // Para el resto de las funciones
import { Ad, AdFilters } from '../types';
import { getStoredToken } from '../utils/storage'; // Para getAdvertDetail

export const getAdverts = async (params?: AdFilters): Promise<Ad[]> => {
  console.log('[advertsService] PASO 3: getAdverts INICIO con params:', JSON.stringify(params));
  try {
    console.log('[advertsService] Ejecutando apiClient.get a "/v1/adverts" con params:', JSON.stringify(params));
    const response = await apiClient.get<Ad[]>('/v1/adverts', { params });
    console.log('[advertsService] Respuesta de la API recibida en getAdverts:', response.data);
    return response.data || []; 
  } catch (error) {
    console.error("[advertsService] Error DENTRO de getAdverts:", error);
    return []; 
  }
};

// --- getAdvertDetail MODIFICADA para usar axios.get() directo ---
export const getAdvertDetail = async (id: string): Promise<Ad> => {
  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/adverts/${id}`;
  console.log(`[advertsService] getAdvertDetail: Llamando a axios.get DIRECTAMENTE para URL: ${fullUrl}`);
  
  const token = getStoredToken();
  const headers: { Authorization?: string } = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Usamos axios.get() directamente en lugar de apiClient.get()
    const response = await axios.get<Ad>(fullUrl, { headers }); 
    
    console.log(`[advertsService] getAdvertDetail: Éxito con axios.get directo, response.data:`, response.data);
    return response.data; // Solo se alcanza si el status es 2xx

  } catch (error: any) {
    console.error('[advertsService] getAdvertDetail: Error capturado desde axios.get directo:', error);
    // Verificamos si es un AxiosError para loguear más info (opcional pero útil para depurar)
    if (axios.isAxiosError(error) && error.response) {
      console.error('[advertsService] getAdvertDetail: Es AxiosError. Status:', error.response.status, 'Data:', error.response.data);
    } else {
      console.error('[advertsService] getAdvertDetail: El error capturado no es un AxiosError estándar con .response o axios.isAxiosError es false.');
    }
    // Re-lanzamos el error para que AdvertDetailPage (o quien llame) lo capture y maneje.
    // Si es un 404, este 'error' debería ser el AxiosError que contiene response.status = 404.
    throw error; 
  }
};
// --- FIN de getAdvertDetail MODIFICADA ---

export const createAdvert = async (advertData: FormData): Promise<Ad> => {
  // Esta función sigue usando apiClient, asumiendo que funciona bien para POST.
  // Si también diera problemas, se podría cambiar a axios.post() directo.
  console.log('[advertsService] createAdvert: Enviando FormData...');
  const response = await apiClient.post<Ad>('/v1/adverts', advertData, {
    // headers: { 'Content-Type': 'multipart/form-data' }, // Axios suele ponerlo si el cuerpo es FormData
  });
  console.log('[advertsService] createAdvert: Anuncio creado:', response.data);
  return response.data;
};

export const deleteAdvert = async (id: string): Promise<void> => {
  console.log(`[advertsService] deleteAdvert: Borrando anuncio con ID: ${id}`);
  // Asumimos que esto funciona bien con apiClient
  await apiClient.delete(`/v1/adverts/${id}`);
  console.log(`[advertsService] deleteAdvert: Anuncio ${id} borrado.`);
};

export const getTags = async (): Promise<string[]> => {
  console.log('[advertsService] getTags: Obteniendo tags...');
  try {
    const response = await apiClient.get<string[]>('/v1/adverts/tags');
    console.log('[advertsService] getTags: Tags recibidos:', response.data);
    return response.data || []; 
  } catch (error) {
    console.error("[advertsService] Error en getTags:", error);
    return []; 
  }
};