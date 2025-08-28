export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  graduation_year?: number;
  employment_status?: 'employed' | 'seeking' | 'entrepreneur' | 'other';
  bio?: string;
  cv_path?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  course?: string;
  graduation_year?: number;
  employment_status?: 'employed' | 'seeking' | 'entrepreneur' | 'other';
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
