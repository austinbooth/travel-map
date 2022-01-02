import { FC, useState, ChangeEvent, useEffect } from 'react'
import { getPlaceFromLatLng, getLatLngFromName } from '../../api'
import { Timestamp as firestoreTimestamp } from 'firebase/firestore'
import { setOrUpdateImageForLocationInFirestore } from '../../firestoreUtils'
import { ImageDataForSavingToFirestore } from '../../types'
import { ImageDataWithoutLocation, LocationData, LocationDataWithCoords } from './uploadTypes'
import ThumbnailImage from '../ThumbnailImage'
import getAuthUser from '../../services/getAuthUser'

interface Props {
  imageData: ImageDataWithoutLocation[]
}

const ImagesWithoutLocation: FC<Props> = ({imageData}) => {
  const [filesWithoutLocation, setFilesWithoutLocation] = useState<ImageDataWithoutLocation[]>(imageData)
  const [userEnteredLocation, setUserEnteredLocation] = useState<string>('')
  const [locationDataForUserConfirmation, setLocationDataForUserConfirmation] = useState<LocationDataWithCoords>()
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout>()
  const [locationError, setLocationError] = useState('')

  const user = getAuthUser()
  useEffect(() => {
    setLocationDataForUserConfirmation(undefined)
    setLocationError('')
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }
    setTimeoutRef(setTimeout(getLocationData, 500))
    // eslint-disable-next-line
  }, [userEnteredLocation])

  const getLocationData = async () => {
    if (userEnteredLocation) {
      try {
        const coords = await getLatLngFromName(userEnteredLocation)
        const locationData: LocationData = await getPlaceFromLatLng(coords)
        setLocationDataForUserConfirmation({...locationData, ...coords})
      } catch (err) {
        console.error(err)
        setLocationError('Could not find location, please check spelling.')
      }
    }
  }
  
  const saveImageToFirestoreWithUserAddedLocation = async () => {
    if (locationDataForUserConfirmation) {
      const dataToSave: ImageDataForSavingToFirestore = {
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
      }
      await setOrUpdateImageForLocationInFirestore(dataToSave)
      setFilesWithoutLocation(files => files.slice(1))
      setLocationDataForUserConfirmation(undefined)
    } else {
      setLocationError('Can not save, missing location data') // should not happen 
    }
  }

  return (
    <div>
      {filesWithoutLocation.length > 0 && (
        <>
          <p>The file below does not have a location.</p>
          <ThumbnailImage
            url={filesWithoutLocation[0].thumbnailUrl}
            alt={filesWithoutLocation[0].filename}
            rotation={filesWithoutLocation[0].rotation}
            height={200}
          />
          <input
            type='text'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserEnteredLocation(e.currentTarget.value)}
          />
          {locationError && <p>{locationError}</p>}
        </>
      )}
      {locationDataForUserConfirmation && (
        <>
          <p>{locationDataForUserConfirmation.place_full}</p>
          <button onClick={saveImageToFirestoreWithUserAddedLocation}>
            Use this location
          </button>
        </>
      )}
    </div>
  )
}

export default ImagesWithoutLocation
