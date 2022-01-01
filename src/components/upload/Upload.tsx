import { FC, useState, ChangeEvent, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import * as exifr from 'exifr'
import { getPlaceFromLatLng } from '../../api'
import { Timestamp as firestoreTimestamp } from 'firebase/firestore'
import {
  getDateTimeForFile, getThumbnailAndRotationForFile,
  setImageAndThumbnailInFirestorage, setOrUpdateImageForLocationInFirestore,
  getDownloadUrlFromUri
} from '../../firestoreUtils'
import ImagesWithoutLocation from './ImagesWithoutLocation'
import { ImageDataWithoutLocation } from './uploadTypes'

const Upload: FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>()
  const [uploading, setUploading] = useState(false)
  const [numberUploaded, setNumberUploaded] = useState(0)
  const [filesWithoutLocation, setFilesWithoutLocation] = useState<ImageDataWithoutLocation[]>([])

  const user = getAuth().currentUser
  if (!user) {
    throw new Error('User not logged in')
  }

  const incrementNumberUploaded = () => setNumberUploaded(current => current + 1)
  const addFileWithoutLocation = (
    dataToAdd: ImageDataWithoutLocation
  ) => setFilesWithoutLocation((current: ImageDataWithoutLocation[]) => [...current, {...dataToAdd}])

  useEffect(() => {
    if (numberUploaded === selectedFiles?.length) {
      setUploading(false)
    }
  }, [numberUploaded, selectedFiles?.length])

  
  const selectFiles = (e: ChangeEvent<HTMLInputElement>) => {
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
          const datetime = getDateTimeForFile(selectedFile)
          const { thumbnail, rotation} = await getThumbnailAndRotationForFile(selectedFile)
          
          const {
            imageUri,
            thumbnailUri
          } = await setImageAndThumbnailInFirestorage(user, datetime, selectedFile, thumbnail)
          
          const { latitude, longitude } = await exifr.gps(selectedFile)

          if (latitude && longitude) {
            const { geo_data, place_full, place, country } = await getPlaceFromLatLng({lat: latitude, lng: longitude})
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
          } else {
            const thumbnailUrl = await getDownloadUrlFromUri(thumbnailUri) // get the new component to handle this
            if (!thumbnailUrl) {
              throw new Error('Could not get thumbnail url')
            }
            const imageDataWithoutLocation = {
              datetime,
              imageUri,
              thumbnailUri,
              rotation,
              thumbnailUrl,
              filename: selectedFile.name
            }
            addFileWithoutLocation(imageDataWithoutLocation)
            incrementNumberUploaded()
          }
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
        onChange={selectFiles}
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
      {!uploading && filesWithoutLocation.length > 0 && <ImagesWithoutLocation imageData={filesWithoutLocation} />}
    </div>
  )
}

export default Upload
