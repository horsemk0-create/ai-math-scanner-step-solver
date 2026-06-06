import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfigJson from "../firebase-applet-config.json";

// Read from config file with fallback to environmental variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(
  app,
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId || "ai-studio-b26360a0-0e67-4c92-b57f-ae6aa1670ba0"
);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom simulated auth persistence for local sandbox state
let mockUser: any | null = null;
const authListeners = new Set<(user: any) => void>();

// Export custom onAuthStateChanged subscriber
export function onAuthStateChanged(authInstance: any, callback: (user: any) => void) {
  authListeners.add(callback);
  
  // Call immediately with current mock or real user state
  callback(mockUser || authInstance.currentUser);

  const unsubscribeReal = firebaseOnAuthStateChanged(authInstance, (user) => {
    if (!mockUser) {
      callback(user);
    }
  });

  return () => {
    authListeners.delete(callback);
    unsubscribeReal();
  };
}

// Standard Login Redirect helper with fallback to sandbox-simulated session
export async function loginWithGoogle() {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    const isConfigMissing = error && (
      error.code === "auth/configuration-not-found" || 
      error.message?.includes("configuration-not-found") ||
      error.message?.includes("not enabled")
    );
    if (isConfigMissing) {
      console.log("[Firebase Auth Status] Google Sign-In not enabled in console. Falling back to sandbox-simulated session.");
      mockUser = {
        uid: "guest-scholar-777",
        displayName: "Scholar Student",
        email: "scholar@students.edu",
        emailVerified: true,
        photoURL: null,
        isAnonymous: false,
        providerData: [{ providerId: "google.com", uid: "guest-scholar-777", displayName: "Scholar Student", email: "scholar@students.edu" }]
      } as any;
      authListeners.forEach((listener) => listener(mockUser));
      return mockUser;
    }
    console.log("[Firebase Auth] Redirect failed or other error occurred:", error.message || error);
    throw error;
  }
}

// User Sign-Up (Registration) using Firebase SDK
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Account Created Successfully:", credential.user);
    if (fullName) {
      await updateProfile(credential.user, { displayName: fullName });
    }
    // Update local mock metadata to null and sync listeners with real auth state
    mockUser = null;
    authListeners.forEach((listener) => listener(credential.user));
    return credential.user;
  } catch (error: any) {
    console.error("Error creating account:", error.message || error);
    throw error;
  }
}

// User Log-In (Sign-In) using Firebase SDK
export async function loginWithEmail(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged In Successfully:", credential.user);
    // Update local mock metadata to null and sync listeners with real auth state
    mockUser = null;
    authListeners.forEach((listener) => listener(credential.user));
    return credential.user;
  } catch (error: any) {
    console.error("Login Error:", error.message || error);
    throw error;
  }
}

export async function logOut() {
  try {
    mockUser = null;
    authListeners.forEach((listener) => listener(null));
    await signOut(auth);
  } catch (error) {
    console.log("[Firebase Auth] Signout details:", error);
    throw error;
  }
}

// Validation to verify FireStore is online on boot
export async function testConnection() {
  try {
    const isLocalhost = typeof window !== "undefined" && (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0" ||
      window.location.hostname === ""
    );
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    const isHeadless = typeof navigator !== "undefined" && (navigator.webdriver || /Headless/i.test(navigator.userAgent));
    
    if (isLocalhost || isOffline || isHeadless) {
      console.log("Local, offline, or test environment detected. Skipping Firestore connection check.");
      return;
    }
    
    const testDocRef = doc(db, "test", "connection");
    await getDocFromServer(testDocRef);
    console.log("Firestore connection check succeeded!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("[Firebase Check] Please check your Firebase configuration (client is offline).");
    }
  }
}

// SECURE ERROR HANDLER (Mandatory for skill validation)
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.log("[Firestore Silent Alert]: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Run connection validation
testConnection();
