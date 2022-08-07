import { FC, useState } from 'react'
import { getDownloadUrlFromUri, setPlaceInFirestore } from '../firestoreUtils'
import { Popup } from 'react-map-gl'
import { MediaData, Uid } from '../types'
import { SxProps } from '@mui/system'
import { compact } from 'lodash'
import { getDateOrDateRange } from '../util'
import ThumbnailImage from './ThumbnailImage'
import getAuthUser from '../services/getAuthUser'
import Button from '@mui/material/Button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PopupModal from './PopupModal'

const boxStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

interface Props {
  uid: Uid
  data: MediaData[]
  setPopupInfo: (uid: string | null) => void
}

const PopUp: FC<Props> = ({uid, data, setPopupInfo}) => {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState<'gallery' | 'edit-location'>('gallery')

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => {
    setModalContent('gallery')
    setOpenModal(false)
  }

  const user = getAuthUser()
  const [editLocation, setEditLocation] = useState('')

  const info = data.find((location) => location.uid === uid)
  if (!info) {
    throw new Error('Location not found')
  }
  const thumbnailData = useQuery([`thumb-${info.uid}`], async () => getDownloadUrlFromUri(info.images[0].thumbnailUri))
  const imageData = useQuery([`images-${info.uid}`], async () => compact(await Promise.all(info.images.map(image => getDownloadUrlFromUri(image.imageUri)))))
  // const update = (newLocation: string) => setPlaceInFirestore(user.uid, info?.uid, newLocation)
  const mutation = useMutation((newLocation: string) => setPlaceInFirestore(user.uid, info?.uid, newLocation), {
    onMutate: async (newLocation: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['getMedia'])

      // Snapshot the previous value
      const previous = (queryClient.getQueryData(['getMedia']) as MediaData[]).find((location) => location.uid === uid)
      if (previous === undefined) {
        throw new Error('Could not find old values')
      }
      // Optimistically update to the new value
      queryClient.setQueryData(['getMedia'], () => {
        return [{...previous, place: newLocation}]
      })
      // Return a context object with the snapshotted value
      return { previous }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newLocation, context) => {
      if (context === undefined) {
        throw new Error('Context not set')
      }
      queryClient.setQueryData(['getMedia'], context.previous)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(['getMedia'])
    },
  })

  if (thumbnailData.isLoading || imageData.isLoading) {
    return <p>Loading...</p>
  }
  if (thumbnailData.error || imageData.isError) {
    return <p>Error</p>
  }

  const thumbnailUrl = thumbnailData.data
  const imageUrls = imageData.data

  const editable = info.user === user.uid

  const setPlace = async () => {
    if (info && editLocation) {
      console.log('--->', editLocation)
      mutation.mutate(editLocation)      
      setEditLocation('')
      handleCloseModal()
    }
  }

  const dateOrDateRange = getDateOrDateRange(info)
  return (
    <Popup
      tipSize={5}
      anchor="top"
      latitude={info.latitude}
      longitude={info.longitude}
      closeOnClick={true}
      onClose={() => setPopupInfo(null)}
    >
      <div onClick={handleOpenModal} className='popup'>
        <p className='popup-place-heading'>{info.place}</p>
        {editable && <Button variant='contained' onClick={() => setModalContent('edit-location')}>Edit location displayed</Button>}
        <p className='popup-info'>{dateOrDateRange}</p>
        {thumbnailUrl && (
          <ThumbnailImage
            url={thumbnailUrl}
            alt={info.place}
            rotation={info.images[0].rotation}
            height={50}
          />
        )}
      </div>
      <PopupModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        modalContent={modalContent}
        info={info}
        dateOrDateRange={dateOrDateRange}
        imageUrls={imageUrls}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        setPlace={setPlace}
      />
    </Popup>
  )
}

export default PopUp
