import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAWW0hqvFEB_Wy7AbqkQSw6nTo36aIXW0Q",
  authDomain: "to-do-324fd.firebaseapp.com",
  projectId: "to-do-324fd",
  storageBucket: "to-do-324fd.firebasestorage.app",
  messagingSenderId: "742812259243",
  appId: "1:742812259243:web:7d7c154276b4dc491078ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
