import { FC, useState, ChangeEvent, useEffect } from 'react'
import { ref, uploadBytes } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { storage, db } from '../firebaseSingleton'
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'
import * as exifr from 'exifr'
import { getDateFromFilename, earliestDateTime } from '../util'
import { getPlaceFromLatLng } from '../api'
import { Timestamp as firestoreTimestamp, doc, setDoc, collection } from 'firebase/firestore'
import { findMediaForLocationDataForUser } from '../firestoreUtils'
import { mean } from 'lodash'
import { ImageData, MediaData } from '../types'

const Upload: FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>()
  const [uploading, setUploading] = useState(false)
  const [numberUploaded, setNumberUploaded] = useState(0)

  const [coords, setCoords] = useState<any>()

  const incrementNumberUploaded = () => setNumberUploaded(current => current + 1)

  useEffect(() => {
    if (numberUploaded === selectedFiles?.length) {
      setUploading(false)
    }
  }, [numberUploaded, selectedFiles?.length])
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
      setNumberUploaded(0)
    }
  }
  
  const uploadFile = () => {
    if (selectedFiles) {
      try {
        setUploading(true)
        selectedFiles.forEach(async (selectedFile) => {
          const user = getAuth().currentUser
          if (!user) {
            throw new Error('User not logged in')
          }
          
          const datetimeFromFilename = getDateFromFilename(selectedFile.name)
          const datetimeFromFile = DateTime.fromMillis(selectedFile.lastModified).toUTC()
          const datetime = earliestDateTime(datetimeFromFilename, datetimeFromFile)

          const dateFolder = `${datetime.day}-${datetime.month}-${datetime.year}`
          const uploadFileName = uuid()
          const firestoreFileRef = ref(storage, `${user.uid}/${dateFolder}/${uploadFileName}`)
          await uploadBytes(firestoreFileRef, selectedFile)
          const imageUri = firestoreFileRef.toString()
          console.log('Uploaded:', imageUri)

          const { latitude, longitude } = await exifr.gps(selectedFile)

          const data = await exifr.parse(selectedFile)
          setCoords(data)


          const { geo_data, place_full, place, country } = await getPlaceFromLatLng({lat: latitude, lng: longitude})
          const thumbnail = await exifr.thumbnail(selectedFile)
          const r = await exifr.rotation(selectedFile)

          if (!thumbnail || !r) {
            throw new Error('Could not generate thumbnail or get rotation info')
          }
          const { deg } = r
          const firestoreFileRefThumbnail = ref(storage, `${user.uid}/${dateFolder}/${uploadFileName}-thumb`)
          await uploadBytes(firestoreFileRefThumbnail, thumbnail, {contentType: 'image/jpeg'})
          const thumbnailUri = firestoreFileRefThumbnail.toString()
          console.log('Uploaded thumbnail:', thumbnailUri)

          const existingDbEntry = await findMediaForLocationDataForUser(user.uid, place_full) as MediaData[]
          console.log('User:', user.uid)
          console.log('--> db entry:', existingDbEntry)
          if (existingDbEntry.length > 1) {
            throw new Error('More than 1 DB entry found.')
          }
          const docRef = existingDbEntry.length === 0 ?
            doc(collection(db, `users/${user.uid}`, 'media'))
              : doc(db, `users/${user.uid}/media`, existingDbEntry[0].uid)
          
          const images: ImageData[] = [
            ...existingDbEntry[0]?.images ?? [],
            {
              imageUri,
              thumbnailUri,
              rotation: deg,
              datetime: firestoreTimestamp.fromDate(datetime.toJSDate()),
              latitude,
              longitude,
              geo_data,
            }
          ]
    
          const dbEntity = {
            user: user.uid,
            uid: docRef.id,
            latitude: mean(images.map(image => image.latitude)),
            longitude: mean(images.map(image => image.longitude)),
            place,
            place_full,
            country,
            images,
          }        
          await setDoc(docRef, dbEntity)
          incrementNumberUploaded()
        })
      } catch (err) {
        console.error(err)
        setUploading(false)
      }
    }
  }

  return (
    <div>
      <input
        type='file'
        multiple
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        style={{width: 'fit-content'}}
      />
      <button onClick={uploadFile} disabled={uploading}>Upload</button>
      {uploading && (
        <>
          <p>Uploading...</p>
          <progress max={selectedFiles?.length} value={numberUploaded} />
        </>
      )}
      {numberUploaded > 0 && numberUploaded === selectedFiles?.length && (
        <p>Your image(s) has been uploaded.</p>
      )}
      {coords && <p>{JSON.stringify(coords)}</p>}
    </div>
  )
}

export default Upload
