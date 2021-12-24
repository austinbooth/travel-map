import { FC, useEffect, useState } from 'react'
import { getDownloadUrlFromUri } from '../firestoreUtils'
import { Popup } from 'react-map-gl'
import { MediaDataProcessed } from '../types'
import { DateTime } from 'luxon'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'
import { compact } from 'lodash'
import { getDateOrDateRange } from '../util'

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
  place: string
  data: MediaDataProcessed[]
  setPopupInfo: (uid: string | null) => void
}

const PopUp: FC<Props> = ({place, data, setPopupInfo}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()
  const [imageUrls, setImageUrls] = useState<string[]>()
  const [info, setInfo] = useState<MediaDataProcessed>()
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  useEffect(() => {
    void (async () => {
      const info = data.find((location) => location.place === place)
      if (!info) {
        return <div>Location not found</div>
      }
      console.log(info.place)
      setInfo(info)
      const thumbnailUrl = await getDownloadUrlFromUri(info.images[0].thumbnailUri)
      if (thumbnailUrl) {
        setThumbnailUrl(thumbnailUrl)
      }
      const imageUrls = compact(await Promise.all(info.images.map(image => getDownloadUrlFromUri(image.imageUri))))
      setImageUrls(imageUrls)
    })()
  },[])
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
      closeOnClick={false}
      onClose={() => setPopupInfo(null)}
    >
      <div onClick={handleOpenModal} className='popup'>
        <p className='popup-place-heading'>{info.place}</p>
        <p className='popup-info'>{dateOrDateRange}</p>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={info.place}
            style={{
              transform: `rotate(${info.images[0].rotation}deg)`,
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
          <p className='popup-info'>{dateOrDateRange}</p>

          {imageUrls && imageUrls.map((imageUrl, idx) => (
            <img
              key={`${info.place}_image_${idx}`}
              src={imageUrl}
              alt={info.place}
              style={{
                maxHeight: '200px'
              }}
            />
          ))}
        </Box>
      </Modal>
    </Popup>
  )
}

export default PopUp
