export interface Ad {
  id: string;         
  name: string;
  sale: boolean;      
  price: number;
  tags: string[];
  photo?: string;        
  createdAt?: string;  
  updatedAt?: string;
  // owner?: string;   // El API puede devolver el ID del propietario
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: string;
  username: string; 
}

export interface AdFilters {
  name?: string;
  sale?: string; 
  price?: string; 
  tags?: string; 
}