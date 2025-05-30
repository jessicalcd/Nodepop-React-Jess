import apiClient from '../api/client'; 
import { AuthResponse, User } from '../types'; 

interface UserSignupData { 
  email: string;
  password: string;
  username: string; 
  name: string;     
}

interface UserLoginCredentials {
  email: string; 
  password: string;
}


export const loginUser = async (credentials: UserLoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data; 
};


export const registerUser = async (userData: UserSignupData): Promise<void> => {
  await apiClient.post('/auth/signup', userData);
};


export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};