import apiClient from '../api/client'; 
import { AuthResponse, User } from '../types'; 


interface UserCredentials {
  email: string; 
  password: string;
}


export const loginUser = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data; 
};


export const registerUser = async (credentials: UserCredentials): Promise<void> => {
  await apiClient.post('/auth/signup', credentials);
};


export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};