// src/services/socialAuth.ts
import type { AuthResponse, User } from '../types';

// Simulação de serviço de autenticação social
export const socialAuthService = {
  // Simular resultado de redirect
  getRedirectResult: async (): Promise<any> => {
    return null;
  },

  // Simular login social rápido
  quickSocialLogin: async (socialUser: any): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'social-auth-token-' + Date.now(),
          user: {
            id: Math.floor(Math.random() * 1000),
            name: socialUser.name || 'Usuário Social',
            email: socialUser.email || 'social@email.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }, 1000);
    });
  },

  // Adicionar o método registerSocialUser que estava faltando
  registerSocialUser: async (socialUser: any): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'social-register-token-' + Date.now(),
          user: {
            id: Math.floor(Math.random() * 1000),
            name: socialUser.name || 'Usuário Social Registrado',
            email: socialUser.email || 'social-register@email.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }, 1000);
    });
  },

  // Simular login com Google
  smartSignInWithGoogle: async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 500);
    });
  }
};