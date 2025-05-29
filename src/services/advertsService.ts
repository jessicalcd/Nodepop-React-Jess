// src/services/advertsService.ts
import apiClient from '../api/client'; // Tu cliente Axios configurado
import { Ad, AdFilters } from '../types'; // Los tipos que definimos anteriormente

/**
 * Obtiene un listado de anuncios, con posibilidad de aplicar filtros.
 * El backend Nodepop (según su documentación) envuelve los resultados en un objeto { results: [] }.
 * @param params Objeto con los filtros a aplicar (name, sale, price, tags).
 * @returns Promesa con un array de anuncios. Devuelve un array vacío en caso de error.
 */
export const getAdverts = async (params?: AdFilters): Promise<Ad[]> => {
  try {
    // El endpoint del backend es /api/v1/adverts
    // Como apiClient tiene baseURL: 'http://localhost:3001/api', la ruta relativa es '/v1/adverts'
    const response = await apiClient.get<{ results: Ad[] }>('/v1/adverts', { params });
    // Asegurarse de que response.data y response.data.results existen antes de acceder
    return response.data?.results || []; // Devuelve un array vacío si 'results' no está o es undefined
  } catch (error) {
    console.error("Error en getAdverts:", error);
    return []; // Devuelve un array vacío en caso de cualquier error en la petición
  }
};

/**
 * Obtiene el detalle de un anuncio específico por su ID.
 * @param id El ID del anuncio.
 * @returns Promesa con el detalle del anuncio.
 */
export const getAdvertDetail = async (id: string): Promise<Ad> => {
  // Aquí podríamos añadir un manejo de errores similar si fuera necesario,
  // pero por ahora lo dejamos como estaba. Si da problemas, se puede refactorizar.
  const response = await apiClient.get<Ad>(`/v1/adverts/${id}`);
  return response.data;
};

/**
 * Crea un nuevo anuncio.
 * El backend Nodepop espera FormData si se incluye una foto.
 * @param advertData FormData que contiene los datos del anuncio.
 * @returns Promesa con el anuncio creado.
 */
export const createAdvert = async (advertData: FormData): Promise<Ad> => {
  const response = await apiClient.post<Ad>('/v1/adverts', advertData, {
    // Axios suele configurar 'Content-Type': 'multipart/form-data' automáticamente
    // cuando el cuerpo de la petición es una instancia de FormData.
  });
  return response.data;
};

/**
 * Borra un anuncio por su ID.
 * @param id El ID del anuncio a borrar.
 * @returns Promesa que se resuelve cuando el anuncio es borrado.
 */
export const deleteAdvert = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/adverts/${id}`);
};

/**
 * Obtiene el listado de todos los tags disponibles en el backend.
 * @returns Promesa con un array de strings (los tags). Devuelve un array vacío en caso de error.
 */
export const getTags = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/v1/adverts/tags');
    return response.data || []; // Devuelve un array vacío si response.data es undefined/null
  } catch (error) {
    console.error("Error en getTags:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};