import axios from 'axios'; 
import apiClient from '../api/client'; 
import { Ad, AdFilters } from '../types';
import { getStoredToken } from '../utils/storage'; 

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

export const getAdvertDetail = async (id: string): Promise<Ad> => {
  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/adverts/${id}`;
  console.log(`[advertsService] getAdvertDetail: Llamando a axios.get DIRECTAMENTE para URL: ${fullUrl}`);
  
  const token = getStoredToken();
  const headers: { Authorization?: string } = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.get<Ad>(fullUrl, { headers }); 
    
    console.log(`[advertsService] getAdvertDetail: Éxito con axios.get directo, response.data:`, response.data);
    return response.data; 

  } catch (error: any) {
    console.error('[advertsService] getAdvertDetail: Error capturado desde axios.get directo:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('[advertsService] getAdvertDetail: Es AxiosError. Status:', error.response.status, 'Data:', error.response.data);
    } else {
      console.error('[advertsService] getAdvertDetail: El error capturado no es un AxiosError estándar con .response o axios.isAxiosError es false.');
    }
    throw error; 
  }
};

export const createAdvert = async (advertData: FormData): Promise<Ad> => {
  console.log('[advertsService] createAdvert: Enviando FormData...');
  const response = await apiClient.post<Ad>('/v1/adverts', advertData, {
  });
  console.log('[advertsService] createAdvert: Anuncio creado:', response.data);
  return response.data;
};

export const deleteAdvert = async (id: string): Promise<void> => {
  console.log(`[advertsService] deleteAdvert: Borrando anuncio con ID: ${id}`);
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