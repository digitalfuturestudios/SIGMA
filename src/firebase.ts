import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ESTAS CREDENCIALES DEBEN SER REEMPLAZADAS POR EL USUARIO DESDE LA CONSOLA DE FIREBASE
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "PLACEHOLDER_PROJECT_ID.firebaseapp.com",
  projectId: "PLACEHOLDER_PROJECT_ID",
  storageBucket: "PLACEHOLDER_PROJECT_ID.appspot.com",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
