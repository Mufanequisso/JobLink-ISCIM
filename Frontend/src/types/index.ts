export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  last_login_at?: string;
  admin_notes?: string;
  phone?: string;
  course?: string;
  graduation_year?: number;
  employment_status?: 'employed' | 'seeking' | 'entrepreneur' | 'other';
  bio?: string;
  cv_path?: string;
  social_id?: string;
  social_provider?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  cv_url?: string;
  current_position?: string;
  experience?: string;
  education?: string;
  skills?: string;
  skills_list?: string[];
}

export interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range?: string;
  type: string;
  company_id: number;
  company: {
    id: number;
    name: string;
    logo_url?: string;
  };
  created_at: string;
  updated_at: string;
  application_deadline: string;
  is_active: boolean;
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  job: {
    id: number;
    title: string;
    company: {
      id: number;
      name: string;
      logo_url?: string;
    };
  };
  user?: {
    id: number;
    name: string;
    email: string;
    cv_url?: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  graduation_year?: number;
  current_position?: string;
  experience?: string;
  education?: string;
  skills?: string;
  bio?: string;
  employment_status?: 'employed' | 'seeking' | 'entrepreneur' | 'other';
  cv_path?: string;
  profile_picture?: string;
}

export interface AdminUserUpdate {
  role?: 'user' | 'admin';
  is_active?: boolean;
  admin_notes?: string;
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
  social_id?: string;
  social_provider?: string;
  profile_picture?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
