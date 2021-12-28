import { FC, useEffect, useState } from 'react'
import { getDownloadUrlFromUri } from '../firestoreUtils'
import { Popup } from 'react-map-gl'
import { MediaData, Uid } from '../types'
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
      const thumbnailUrl = await getDownloadUrlFromUri(info.images[0].thumbnailUri)
      if (thumbnailUrl) {
        setThumbnailUrl(thumbnailUrl)
      }
      const imageUrls = compact(await Promise.all(info.images.map(image => getDownloadUrlFromUri(image.imageUri))))
      setImageUrls(imageUrls)
    })()
  },[data, uid])
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
      </Modal>
    </Popup>
  )
}

export default PopUp
