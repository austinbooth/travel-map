import { getDocs, collection, doc, setDoc, query, where, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from './firebaseSingleton'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { mean } from 'lodash'
import * as exifr from 'exifr'
import { getDateFromFilename, earliestDateTime } from './util'
import { ImageData, MediaData, ImageDataForSavingToFirestore } from './types'
import { User } from 'firebase/auth'

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

export const findMediaForLocationDataForUser = async (uid: string, place_full: string) => {
  const ref = collection(db, `users/${uid}/media`)
  const { docs } = await getDocs(query(ref, where('place_full', '==', place_full)))
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

export const setImageAndThumbnailInFirestorage = async (
  user: User,
  datetime: DateTime,
  selectedFile: File,
  thumbnail: Buffer | Uint8Array
) => {
  const dateFolder = `${datetime.day}-${datetime.month}-${datetime.year}`
  const uploadFileName = uuid()
  const firestoreFileRef = ref(storage, `${user.uid}/${dateFolder}/${uploadFileName}`)
  await uploadBytes(firestoreFileRef, selectedFile)
  const imageUri = firestoreFileRef.toString()
  console.log('Uploaded:', imageUri)

  const firestoreFileRefThumbnail = ref(storage, `${user.uid}/${dateFolder}/${uploadFileName}-thumb`)
  await uploadBytes(firestoreFileRefThumbnail, thumbnail, {contentType: 'image/jpeg'})
  const thumbnailUri = firestoreFileRefThumbnail.toString()
  console.log('Uploaded thumbnail:', thumbnailUri)

  return { imageUri, thumbnailUri }
}

export const setOrUpdateImageForLocationInFirestore = async (data: ImageDataForSavingToFirestore) => {
  const { userUid, place_full, place, country } = data
  const existingDbEntry = await findMediaForLocationDataForUser(userUid, place_full) as MediaData[]
  if (existingDbEntry.length > 1) {
    throw new Error('More than 1 DB entry found.')
  }
  const docRef = existingDbEntry.length === 0 ?
    doc(collection(db, `users/${userUid}`, 'media'))
      : doc(db, `users/${userUid}/media`, existingDbEntry[0].uid)
  
  const images: ImageData[] = [
    ...existingDbEntry[0]?.images ?? [],
    data.imageData
  ]

  const dbEntity = {
    user: userUid,
    uid: docRef.id,
    latitude: mean(images.map(image => image.latitude)),
    longitude: mean(images.map(image => image.longitude)),
    place,
    place_full,
    country,
    images,
  }        
  await setDoc(docRef, dbEntity)
}

export const getThumbnailAndRotationForFile = async (selectedFile: File) => {
  const thumbnail = await exifr.thumbnail(selectedFile)
  const r = await exifr.rotation(selectedFile)
  
  if (!thumbnail || !r) {
    throw new Error('Could not generate thumbnail or get rotation info')
  }
  const { deg } = r

  return {
    thumbnail,
    rotation: deg
  }
}

export const getDateTimeForFile = (selectedFile: File) => {
  const datetimeFromFilename = getDateFromFilename(selectedFile.name)
  const datetimeFromFile = DateTime.fromMillis(selectedFile.lastModified).toUTC()
  const datetime = earliestDateTime(datetimeFromFilename, datetimeFromFile)
  return datetime
}

export const setPlaceInFirestore = async (user: string, uid: string, place: string) => {
  const docRef = doc(db, `users/${user}/media`, uid)
  const existingDbEntry = (await getDoc(docRef)).data() as MediaData
  const updatedData = {
    ...existingDbEntry,
    place
  }
  return await setDoc(docRef, updatedData)
}
