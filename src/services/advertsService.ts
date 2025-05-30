import apiClient from '../api/client'; 
import { Ad, AdFilters } from '../types'; 


export const getAdverts = async (params?: AdFilters): Promise<Ad[]> => {
  try {
    const response = await apiClient.get<Ad[]>('/v1/adverts', { params });
    return response.data || []; 
  } catch (error) {
    console.error("[advertsService] Error en getAdverts:", error);
    return []; 
  }
};


export const getAdvertDetail = async (id: string): Promise<Ad> => {
  const response = await apiClient.get<Ad>(`/v1/adverts/${id}`);
  return response.data;
};


export const createAdvert = async (advertData: FormData): Promise<Ad> => {
  const response = await apiClient.post<Ad>('/v1/adverts', advertData, {
  });
  return response.data;
};


export const deleteAdvert = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/adverts/${id}`);
};


export const getTags = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/v1/adverts/tags');
    return response.data || []; 
  } catch (error) {
    console.error("Error en getTags:", error);
    return []; 
  }
};