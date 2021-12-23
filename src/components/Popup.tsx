import { FC, useEffect, useState } from 'react'
import { getDownloadUrlFromUri } from '../firestoreUtils'
import { Popup } from 'react-map-gl'
import { MediaData } from '../types'
import { DateTime } from 'luxon'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'

const boxStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

interface Props {
  uid: string
  data: MediaData[]
  setPopupInfo: (uid: string | null) => void
}

const PopUp: FC<Props> = ({uid, data, setPopupInfo}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()
  const [imageUrl, setImageUrl] = useState<string>()
  const [info, setInfo] = useState<MediaData>()
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  useEffect(() => {
    void (async () => {
      const info = data.find((location) => location.uid === uid)
      if (!info) {
        return <div>Location not found</div>
      }
      console.log(info.place)
      setInfo(info)
      const thumbnailUrl = await getDownloadUrlFromUri(info.thumbnailUri)
      if (thumbnailUrl) {
        setThumbnailUrl(thumbnailUrl)
      }
      const imageUrl = await getDownloadUrlFromUri(info.imageUri)
      if (imageUrl) {
        setImageUrl(imageUrl)
      }
    })()
  },[])
  if (!info) {
    return <p>Loading...</p>
  }
  return (
    <Popup
      tipSize={5}
      anchor="top"
      latitude={info.latitude}
      longitude={info.longitude}
      closeOnClick={false}
      onClose={() => setPopupInfo(null)}
    >
      <div onClick={handleOpenModal} className='popup'>
        <p className='popup-place-heading'>{info.place}</p>
        <p className='popup-info'>{DateTime.fromJSDate(info.datetime.toDate()).toFormat('dd LLL yyyy')}</p>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={info.place}
            style={{
              transform: `rotate(${info.rotation}deg)`,
              height: '50px'
            }}
          />)}
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box sx={boxStyle}>
          <p className='popup-place-heading'>{info.place}</p>
          <p className='popup-info'>{DateTime.fromJSDate(info.datetime.toDate()).toFormat('dd LLL yyyy')}</p>
          <img
            src={imageUrl}
            alt={info.place}
            style={{
              maxHeight: '200px'
            }}
          />
        </Box>
      </Modal>
    </Popup>
  )
}

export default PopUp
