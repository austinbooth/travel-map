import { getDocs, collection, doc} from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from './firebaseSingleton'

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