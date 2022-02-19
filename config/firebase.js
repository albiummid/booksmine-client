import { initializeApp } from 'firebase/app'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC9Q03x50Oe6Ra6_oN1bDqtwImFzGw8J8Q',
  authDomain: 'books-mine.firebaseapp.com',
  projectId: 'books-mine',
  storageBucket: 'books-mine.appspot.com',
  messagingSenderId: '164913059176',
  appId: '1:164913059176:web:8825a81bfd0105ccc0f2dd',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export default app
