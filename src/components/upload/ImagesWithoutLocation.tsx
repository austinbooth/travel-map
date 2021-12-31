import { FC, useState, ChangeEvent, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import * as exifr from 'exifr'
import { getPlaceFromLatLng, getLatLngFromName } from '../../api'
import { Timestamp as firestoreTimestamp } from 'firebase/firestore'
import {
  getDateTimeForFile, getThumbnailAndRotationForFile,
  setImageAndThumbnailInFirestorage, setOrUpdateImageForLocationInFirestore,
  getDownloadUrlFromUri
} from '../../firestoreUtils'
import { DateTime } from 'luxon'
import { ImageDataForSavingToFirestore } from '../../types'
import { ImageDataWithoutLocation, LocationData } from './Upload'

interface LocationDataWithCoords extends LocationData {
  lat: number
  lng: number
}

interface Props {
  imageData: ImageDataWithoutLocation[]
}

const ImagesWithoutLocation: FC<Props> = ({imageData}) => {
  const [filesWithoutLocation, setFilesWithoutLocation] = useState<ImageDataWithoutLocation[]>(imageData)
  const [userEnteredLocation, setUserEnteredLocation] = useState<string>('')
  const [locationDataForUserConfirmation, setLocationDataForUserConfirmation] = useState<LocationDataWithCoords>()
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout>()

  const user = getAuth().currentUser
  if (!user) {
    throw new Error('User not logged in')
  }


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
  
  const saveImageToFirestoreWithUserAddedLocation = async (data: ImageDataForSavingToFirestore) => {
    console.log('location submitted')
    await setOrUpdateImageForLocationInFirestore(data)
    setFilesWithoutLocation(files => files.slice(1))
    setLocationDataForUserConfirmation(undefined)
  }

  return (
    <div>
      {filesWithoutLocation.length > 0 && (
        <>
          <p>The files(s) below do not have a location.</p>
          <img
            key={filesWithoutLocation[0].thumbnailUrl}
            src={filesWithoutLocation[0].thumbnailUrl}
            alt={filesWithoutLocation[0].filename}
            style={{
              transform: `rotate(${filesWithoutLocation[0].rotation}deg)`,
              height: '200px'
            }}
          />
          <input
            type='text'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserEnteredLocation(e.currentTarget.value)}
          />
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

export default ImagesWithoutLocation
