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

function socialPassword(uid: string): string {
  return `social_${uid}`;
}

export const socialAuthService = {
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

  async smartSignInWithGoogle(): Promise<SocialUser | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return mapFirebaseUser(result.user);
    } catch (error: any) {
      const code: string = error?.code || '';
      if (shouldFallbackToRedirect(code)) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      const message = withConfigHelp(error?.message || 'Erro no login com Google', code);
      throw new Error(code ? `${code}: ${message}` : message);
    }
  },

  async signInWithGoogleRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      const code: string | undefined = error?.code;
      const message: string = withConfigHelp(error?.message || 'Erro no redirect do Google', code);
      throw new Error(code ? `${code}: ${message}` : message);
    }
  },

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

  // Upsert + login via backend em um único passo
  async registerSocialUser(socialUser: SocialUser): Promise<AuthResponse> {
    const password = socialPassword(socialUser.uid);
    return await authService.social({
      name: socialUser.displayName,
      email: socialUser.email,
      password,
      password_confirmation: password,
    });
  },

  async quickSocialLogin(socialUser: SocialUser): Promise<AuthResponse> {
    // Usa o endpoint social para garantir criação/atualização e login
    return await this.registerSocialUser(socialUser);
  }
};

export default socialAuthService;
