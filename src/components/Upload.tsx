import { FC, useState, ChangeEvent, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import * as exifr from 'exifr'
import { getPlaceFromLatLng, getLatLngFromName } from '../api'
import { Timestamp as firestoreTimestamp } from 'firebase/firestore'
import {
  getDateTimeForFile, getThumbnailAndRotationForFile,
  setImageAndThumbnailInFirestorage, setOrUpdateImageForLocationInFirestore,
  getDownloadUrlFromUri
} from '../firestoreUtils'
import { DateTime } from 'luxon'
import { ImageDataForSavingToFirestore } from '../types'

interface ImageDataWithoutLocation {
  datetime: DateTime
  imageUri: string
  thumbnailUri: string
  thumbnailUrl: string
  rotation: number
  filename: string
}

interface LocationData {
  geo_data: Record<string, string | number>
  place: string
  place_full: string
  country: string
}

interface LocationDataWithCoords extends LocationData {
  lat: number
  lng: number
}

// interface FileDetailsWithLocationData

const Upload: FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>()
  const [uploading, setUploading] = useState(false)
  const [numberUploaded, setNumberUploaded] = useState(0)
  const [filesWithoutLocation, setFilesWithoutLocation] = useState<ImageDataWithoutLocation[]>([])
  const [userEnteredLocation, setUserEnteredLocation] = useState<string>('')
  const [locationDataForUserConfirmation, setLocationDataForUserConfirmation] = useState<LocationDataWithCoords>()
  const [filesWithLocationAdded, setFilesWithLocationAdded] = useState<ImageDataForSavingToFirestore[]>([])
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout>()

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

  const getLocationData = async () => {
    console.log('user stopped entering location...')
    if (userEnteredLocation) {
      const coords = await getLatLngFromName(userEnteredLocation)
      console.log(coords)
      const locationData: LocationData = await getPlaceFromLatLng(coords)
      console.log(locationData.place, locationData.place_full, locationData.country)
      setLocationDataForUserConfirmation({...locationData, ...coords})
    }
  }
  useEffect(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }
    setTimeoutRef(setTimeout(getLocationData, 500))
  }, [userEnteredLocation])
  
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
            const thumbnailUrl = await getDownloadUrlFromUri(thumbnailUri)
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
          }
        })
      } catch (err) {
        console.error(err)
        setUploading(false)
      }
    }
  }

  const saveImageToFirestoreWithUserAddedLocation = async (data: ImageDataForSavingToFirestore) => {
    console.log('location submitted')
    await setOrUpdateImageForLocationInFirestore(data)
    incrementNumberUploaded()
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
      {filesWithoutLocation.length > 0 && (
        <>
          <p>The files(s) below do not have a location.</p>
          {[filesWithoutLocation[0]].map((file: ImageDataWithoutLocation) => (
            <>
              <img
                key={file.thumbnailUrl}
                src={file.thumbnailUrl}
                alt={file.filename}
                style={{
                  transform: `rotate(${file.rotation}deg)`,
                  height: '200px'
                }}
              />
              <input
                type='text'
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserEnteredLocation(e.currentTarget.value)}
              />
            </>
            ))}
        </>
      )}
      {locationDataForUserConfirmation && (
        <>
          <p>{locationDataForUserConfirmation.place_full}</p>
          <button
            onClick={
              () => saveImageToFirestoreWithUserAddedLocation({
                userUid: user.uid,
                place: locationDataForUserConfirmation.place,
                place_full: locationDataForUserConfirmation.place_full,
                country: locationDataForUserConfirmation.country,
                imageData: {
                  geo_data: locationDataForUserConfirmation.geo_data,
                  datetime: firestoreTimestamp.fromDate(filesWithoutLocation[0].datetime.toJSDate()),
                  imageUri: filesWithoutLocation[0].imageUri,
                  thumbnailUri: filesWithoutLocation[0].thumbnailUri,
                  rotation: filesWithoutLocation[0].rotation,
                  latitude: locationDataForUserConfirmation.lat,
                  longitude: locationDataForUserConfirmation.lng,
                },
              })
            }
          >
            Use this location
          </button>
        </>
      )}
    </div>
  )
}

export default Upload
