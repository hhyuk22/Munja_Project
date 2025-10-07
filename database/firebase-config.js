import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const functions = getFunctions(app); // Functions 서비스도 초기화

// **********************************************
// ********* [중요] 로컬 에뮬레이터 연결 로직 *********
// **********************************************

// 로컬 환경인지 확인하는 조건 (예: Expo Go 또는 개발 빌드 환경)
if (false) { 
  // 1. Firestore 에뮬레이터 연결 (포트 기본값 8080)
  connectFirestoreEmulator(db, "10.0.2.2", 8083); 
  
  // 2. Auth 에뮬레이터 연결 (포트 기본값 9099)
  connectAuthEmulator(auth, "http://10.0.2.2:9099"); 
  
  // 3. Functions 에뮬레이터 연결 (포트 기본값 5001)
  connectFunctionsEmulator(functions, "10.0.2.2", 5001); 
  
  console.log("Firebase Emulators에 연결되었습니다.");
}
