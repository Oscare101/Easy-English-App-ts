// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
  apiKey: 'AIzaSyA5ZCygsUt2JWams71bOsUs337iR9KMwVg',
  authDomain: 'easy-english-ab4a3.firebaseapp.com',
  databaseURL:
    'https://easy-english-ab4a3-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'easy-english-ab4a3',
  storageBucket: 'easy-english-ab4a3.appspot.com',
  messagingSenderId: '455629390384',
  appId: '1:455629390384:web:a1623d657fa9e7d20523f5',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
