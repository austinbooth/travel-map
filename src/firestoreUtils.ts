import { getDocs, collection, doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from './firebaseSingleton'

export const addNewUserToFirestore = async (uid: string) => {
  const userRef = doc(db, '/users/', uid)
  return await setDoc(userRef, {uid})
}

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, `/users/`))
  const { docs } = querySnapshot
  return docs.map(doc => doc.data()).map(doc => doc.uid) as string[]
}

export const getAllMediaForUser = async (uid: string) => {
  const querySnapshot = await getDocs(collection(db, `users/${uid}/media`))
  const { docs } = querySnapshot
  return docs.map(doc => doc.data())
}

export const getDownloadUrlFromUri = async (uri: string) => {
  try {
    const storageRef = ref(storage, uri)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (err) {
    console.error(err)
  }
}