import { FC, useState, ChangeEvent, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import * as exifr from 'exifr'
import { getPlaceFromLatLng } from '../api'
import { Timestamp as firestoreTimestamp } from 'firebase/firestore'
import { getDateTimeForFile, getThumbnailAndRotationForFile, setImageAndThumbnailInFirestorage, setOrUpdateImageForLocationInFirestore } from '../firestoreUtils'

const Upload: FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>()
  const [uploading, setUploading] = useState(false)
  const [numberUploaded, setNumberUploaded] = useState(0)

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
        const user = getAuth().currentUser
        if (!user) {
          throw new Error('User not logged in')
        }
        setUploading(true)
        selectedFiles.forEach(async (selectedFile) => {
          const datetime = getDateTimeForFile(selectedFile)
          const { latitude, longitude } = await exifr.gps(selectedFile)
          const { geo_data, place_full, place, country } = await getPlaceFromLatLng({lat: latitude, lng: longitude})
          const { thumbnail, rotation} = await getThumbnailAndRotationForFile(selectedFile)

          const {
            imageUri,
            thumbnailUri
          } = await setImageAndThumbnailInFirestorage(user, datetime, selectedFile, thumbnail)

          await setOrUpdateImageForLocationInFirestore({
            userUid: user.uid, country, place, place_full,
            imageData: {
              datetime: firestoreTimestamp.fromDate(datetime.toJSDate()),
              geo_data,
              imageUri,
              thumbnailUri,
              rotation,
              latitude,
              longitude
            }
          })
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
    </div>
  )
}

export default Upload
