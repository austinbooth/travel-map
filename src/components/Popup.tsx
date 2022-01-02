import { FC, useEffect, useState, ChangeEvent } from 'react'
import { getDownloadUrlFromUri, setPlaceInFirestore } from '../firestoreUtils'
import { Popup } from 'react-map-gl'
import { MediaData, Uid } from '../types'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'
import { compact } from 'lodash'
import { getDateOrDateRange } from '../util'
import ThumbnailImage from './ThumbnailImage'
import getAuthUser from '../services/getAuthUser'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'

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
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()
  const [imageUrls, setImageUrls] = useState<string[]>()
  const [info, setInfo] = useState<MediaData>()
  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState<'gallery' | 'edit-location'>('gallery')

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => {
    setModalContent('gallery')
    setOpenModal(false)
  }

  const user = getAuthUser()
  const [editable, setEditable] = useState(false)
  const [editLocation, setEditLocation] = useState('')

  useEffect(() => {
    void (async () => {
      const info = data.find((location) => location.uid === uid)
      if (!info) {
        return <div>Location not found</div>
      }
      console.log(info)
      setInfo(info)
      const thumbnailUrl = await getDownloadUrlFromUri(info.images[0].thumbnailUri)
      if (thumbnailUrl) {
        setThumbnailUrl(thumbnailUrl)
      }
      const imageUrls = compact(await Promise.all(info.images.map(image => getDownloadUrlFromUri(image.imageUri))))
      setImageUrls(imageUrls)

      if (info.user === user.uid) {
        setEditable(true)
      }
      setEditLocation(info.place)
    })()
  },[data, uid])

  const setPlace = async () => {
    if (info && editLocation) {
      await setPlaceInFirestore(user.uid, info?.uid, editLocation)
      const updatedInfo = {...info, place: editLocation}
      setInfo(updatedInfo)
      setEditLocation('')
      handleCloseModal()
    }
  }

  if (!info) {
    return <p>Loading...</p>
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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        { modalContent === 'gallery' ? (
          <Box sx={
            {
              ...boxStyle,
              width: parseInt(`${info.images.length === 1 ? 230 : info.images.length === 2 ? 320 : 500}`)
            }
          }>
            <p className='popup-place-heading'>{`${info.place} ${dateOrDateRange}`}</p>
            
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
              {imageUrls && imageUrls.map((imageUrl, idx) => (
                <img
                  key={`${info.place}_image_${idx}`}
                  src={imageUrl}
                  alt={info.place}
                  style={{
                    maxHeight: '200px',
                    margin: '5px',
                    borderRadius: '5%'
                  }}
                />
              ))}
            </div>
          </Box>
        ) : (
          <Box sx={
            {
              ...boxStyle,
              width: '90%'
            }
          }>
            <p className='popup-place-heading'>{`${info.place_full} ${dateOrDateRange}`}</p>
            {info.images.map(image => <p key={image.imageUri} className='popup-place-heading'>{JSON.stringify(image.geo_data.components)}</p>)}

            <Stack spacing={2} direction="row">
              {
                [
                  ...new Set(info.images.reduce((acc: (string | number)[], curr) => [
                    ...acc,
                    curr.geo_data.components?.city,
                    curr.geo_data.components?.town,
                    curr.geo_data.components?.village,
                    curr.geo_data.components?.hamlet,
                    curr.geo_data.components?.suburb,
                    curr.geo_data.components?.locality,
                  ], []))
                ]
                .filter(Boolean)
                .map((item) => <Button key={item} variant='outlined' onClick={() => setEditLocation('' + item)}>{item}</Button>)
              }
            </Stack>
            
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '32px', gap: 8}}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter location displayed"
                value={editLocation}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditLocation(e.currentTarget.value)}
                // fullWidth
                style={{width: '70%'}}
              />
              <Button variant='contained' onClick={setPlace}>Set location</Button>
            </div>
          </Box>
        )
      }
      </Modal>
    </Popup>
  )
}

export default PopUp
