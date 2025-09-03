import axios from 'axios';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  Company,
  Job,
  Application,
  UpdateProfileData,
  ApplicationStatus
} from '../types';

// Extend the AxiosInstance type to include our auth methods
interface CustomAxiosInstance extends ReturnType<typeof axios.create> {
  auth: {
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    register: (userData: RegisterRequest) => Promise<AuthResponse>;
    social: (userData: Partial<RegisterRequest> & { password: string }) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    getUser: () => Promise<User>;
  };
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// Add auth methods to the axios instance
api.auth = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  async social(userData: Partial<RegisterRequest> & { password: string }): Promise<AuthResponse> {
    const response = await api.post('/auth/social', userData);
    return response.data;
  },
  
  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  async getUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data;
  }
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async social(userData: Partial<RegisterRequest> & { password: string }): Promise<AuthResponse> {
    const response = await api.post('/auth/social', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data;
  },
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await api.put<User>('/user', data);
  return response.data;
};

export const uploadCV = async (file: File): Promise<{ cv_url: string }> => {
  const formData = new FormData();
  formData.append('cv', file);
  
  const response = await api.post('/user/cv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updateEmploymentStatus = async (status: string): Promise<User> => {
  const response = await api.put<User>('/user/status', { status });
  return response.data;
};

// Company related API calls
export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>('/companies');
  return response.data;
};

export const createCompany = async (data: Omit<Company, 'id' | 'created_at'>): Promise<Company> => {
  const response = await api.post<Company>('/companies', data);
  return response.data;
};

// Job related API calls
export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>('/jobs');
  return response.data;
};

export const getJob = async (id: number): Promise<Job> => {
  const response = await api.get<Job>(`/jobs/${id}`);
  return response.data;
};

// Application related API calls
export const getMyApplications = async (): Promise<Application[]> => {
  const response = await api.get<Application[]>('/applications');
  return response.data;
};

export const getJobApplications = async (jobId: number): Promise<Application[]> => {
  const response = await api.get<Application[]>(`/jobs/${jobId}/applications`);
  return response.data;
};

export const applyForJob = async (jobId: number): Promise<Application> => {
  const response = await api.post<Application>(`/jobs/${jobId}/apply`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId: number, status: ApplicationStatus): Promise<Application> => {
  const response = await api.put<Application>(`/applications/${applicationId}`, { status });
  return response.data;
};

export default api;
