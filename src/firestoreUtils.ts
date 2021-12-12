import { getDocs, collection, doc} from 'firebase/firestore'
import { db } from './firebaseSingleton'

export const getAllMediaForUser = async (uid: string) => {
  const querySnapshot = await getDocs(collection(db, `users/${uid}/media`))
  const { docs } = querySnapshot
  return docs.map(doc => doc.data())
}
