import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAN3u2EolpiyP5D0PEtir74xLvE1cz-wvY",
  authDomain: "travel-map-6fc3a.firebaseapp.com",
  databaseURL: "https://travel-map-6fc3a.firebaseio.com",
  projectId: "travel-map-6fc3a",
  storageBucket: "travel-map-6fc3a.appspot.com",
  messagingSenderId: "934914244406",
  appId: "1:934914244406:web:cba06ed2e82eb65e873d97"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = initializeFirestore(app, { })
const storage = getStorage(app)

export {
  app, auth, db, storage,
}
