import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { authService } from './api';
import type { AuthResponse } from '../types';

export interface SocialUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
}

function mapFirebaseUser(user: any): SocialUser {
  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || user.email!.split('@')[0],
    photoURL: user.photoURL || undefined,
    provider: 'google'
  };
}

function shouldFallbackToRedirect(errorCode: string): boolean {
  // Erros comuns que justificam fallback para redirect em vez de popup
  return (
    errorCode === 'auth/popup-blocked' ||
    errorCode === 'auth/popup-closed-by-user' ||
    errorCode === 'auth/cancelled-popup-request' ||
    errorCode === 'auth/operation-not-supported-in-this-environment'
  );
}

function withConfigHelp(message: string, code?: string) {
  if (code === 'auth/configuration-not-found') {
    return `${message}. Dica: habilite o provedor Google no Firebase Console (Authentication → Sign-in method → Google) e adicione os domínios autorizados: localhost, 127.0.0.1 e joblinkiscim.firebaseapp.com.`;
  }
  return message;
}

export const socialAuthService = {
  // Login com Google usando popup
  async signInWithGoogle(): Promise<SocialUser> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return mapFirebaseUser(result.user);
    } catch (error: any) {
      const code: string | undefined = error?.code;
      const message: string = withConfigHelp(error?.message || 'Erro desconhecido', code);
      throw new Error(code ? `${code}: ${message}` : message);
    }
  },

  // Login com Google com fallback automático para redirect
  async smartSignInWithGoogle(): Promise<SocialUser | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return mapFirebaseUser(result.user);
    } catch (error: any) {
      const code: string = error?.code || '';
      if (shouldFallbackToRedirect(code)) {
        await signInWithRedirect(auth, googleProvider);
        return null; // fluxo continuará no getRedirectResult()
      }
      const message = withConfigHelp(error?.message || 'Erro no login com Google', code);
      throw new Error(code ? `${code}: ${message}` : message);
    }
  },

  // Login com Google usando redirect (para dispositivos móveis)
  async signInWithGoogleRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      const code: string | undefined = error?.code;
      const message: string = withConfigHelp(error?.message || 'Erro no redirect do Google', code);
      throw new Error(code ? `${code}: ${message}` : message);
    }
  },

  // Verificar resultado do redirect
  async getRedirectResult(): Promise<SocialUser | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        return mapFirebaseUser(result.user);
      }
      return null;
    } catch (error: any) {
      const code: string | undefined = error?.code;
      const message: string = withConfigHelp(error?.message || 'Erro ao verificar redirect', code);
      throw new Error(code ? `${code}: ${message}` : message);
    }
  },

  // Registrar usuário social no backend
  async registerSocialUser(socialUser: SocialUser): Promise<AuthResponse> {
    try {
      // Gerar senha temporária para usuários sociais
      const tempPassword = `social_${socialUser.uid}_${Date.now()}`;
      
      const userData = {
        name: socialUser.displayName,
        email: socialUser.email,
        password: tempPassword,
        password_confirmation: tempPassword,
        social_id: socialUser.uid,
        social_provider: socialUser.provider,
        profile_picture: socialUser.photoURL
      };

      return await authService.register(userData);
    } catch (error: any) {
      throw new Error(`Erro ao registrar usuário social: ${error.message}`);
    }
  },

  // Login rápido com usuário social
  async quickSocialLogin(socialUser: SocialUser): Promise<AuthResponse> {
    try {
      // Tentar fazer login primeiro
      try {
        return await authService.login({
          email: socialUser.email,
          password: `social_${socialUser.uid}_${Date.now()}`
        });
      } catch (error) {
        // Se não existir, registrar o usuário
        return await this.registerSocialUser(socialUser);
      }
    } catch (error: any) {
      throw new Error(`Erro no login rápido social: ${error.message}`);
    }
  }
};

export default socialAuthService;
