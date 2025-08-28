import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - JobLink ISCIM
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCcTndm3_mbCi3TR4JQSW5C-wFEuruIdIc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "joblinkiscim.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "joblinkiscim",
  // O bucket correto geralmente é <project-id>.appspot.com
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "joblinkiscim.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "338100372457",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:338100372457:web:7be9dd2b8ca82e2f318178",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GFH29448SZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Pequeno diagnóstico em dev
if (import.meta?.env?.DEV) {
  // eslint-disable-next-line no-console
  console.info("[Firebase] authDomain:", firebaseConfig.authDomain, "projectId:", firebaseConfig.projectId);
}

// Inicializar Auth
export const auth = getAuth(app);

// Inicializar Analytics (somente no browser e se houver measurementId)
export const analytics = (typeof window !== 'undefined' && firebaseConfig.measurementId)
  ? (() => {
      try {
        return getAnalytics(app);
      } catch {
        return undefined;
      }
    })()
  : undefined;

// Provedores de autenticação
export const googleProvider = new GoogleAuthProvider();

export default app;
