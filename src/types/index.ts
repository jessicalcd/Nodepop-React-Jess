export interface Ad {
  id: string;         
  name: string;
  sale: boolean;      
  price: number;
  tags: string[];
  photo?: string;        
  createdAt?: string;  
  updatedAt?: string;
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
  tags?: string; 
}