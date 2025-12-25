import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Check if config is loaded
if (typeof window !== 'undefined') {
    const missingKeys: string[] = [];
    Object.entries(firebaseConfig).forEach(([key, value]) => {
        if (!value) missingKeys.push(key);
    })

    if (missingKeys.length > 0) {
        alert(`CRITICAL ERROR: Missing Firebase Configuration!\n\nPlease check your .env.local file.\nMissing keys: ${missingKeys.join(", ")}`);
        console.error("Missing keys:", missingKeys);
    } else {
        console.log("Firebase Config OK. Connected to Project:", firebaseConfig.projectId);
        console.log("Auth Domain:", firebaseConfig.authDomain);
    }
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

export async function getStorageUrl(path: string): Promise<string> {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;

    try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error fetching storage URL:", error);
        // Fallback to local path or return empty if failed
        return path.startsWith('/') ? path : `/${path}`;
    }
}
