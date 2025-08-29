// src/types/socialAuth.ts
export interface SocialUser {
  provider: string;
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  accessToken?: string;
}

export interface SocialAuthResponse {
  token: string;
  user: any;
}

export interface SocialAuthService {
  getRedirectResult: () => Promise<SocialUser | null>;
  quickSocialLogin: (socialUser: SocialUser) => Promise<SocialAuthResponse>;
  smartSignInWithGoogle: () => Promise<SocialUser | null>;
}