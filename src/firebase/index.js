import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

let firebaseConfig

const getFirebaseConfig = async () => {
  if (import.meta.env.VITE_APP_FIREBASE_ENV === 'test') {
    const module = await import('./firebaseConfig.test.js')
    return module.firebaseConfig
  } else {
    const module = await import('./firebaseConfig.prod.js')
    return module.firebaseConfig
  }
}

// Initialisation de Firebase
const initFirebase = async () => {
  firebaseConfig = await getFirebaseConfig()

  const dbConfig = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  }

  const firebaseApp = initializeApp(dbConfig)
  const db = getFirestore(firebaseApp)

  return { firebaseApp, db }
}

// Exporter la base de données après initialisation
const { db } = await initFirebase()
export { db }
