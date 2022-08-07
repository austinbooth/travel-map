import { FC, ChangeEvent, forwardRef } from 'react'
import { MediaData } from '../types'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'
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

interface PopupModalProps {
  openModal: boolean
  handleCloseModal: () => void
  modalContent: 'gallery' | 'edit-location'
  info: MediaData
  dateOrDateRange: string
  imageUrls: string[]
  editLocation: string
  setEditLocation: React.Dispatch<React.SetStateAction<string>>
  setPlace: () => Promise<void>
}
const PopupModal: FC<PopupModalProps> = ({
  openModal, handleCloseModal, modalContent, info, dateOrDateRange, imageUrls, editLocation, setEditLocation, setPlace,
}) => (
  <Modal
    open={openModal}
    onClose={handleCloseModal}
  >
    {
      modalContent === 'gallery'
        ? <Gallery
            info={info}
            dateOrDateRange={dateOrDateRange}
            imageUrls={imageUrls}
          />
        : <EditLocation
            info={info}
            dateOrDateRange={dateOrDateRange}
            editLocation={editLocation}
            setEditLocation={setEditLocation}
            setPlace={setPlace}
          />
    }
  </Modal>
)

interface GalleryProps {
  info: MediaData
  dateOrDateRange: string
  imageUrls: string[]
}
const Gallery: FC<GalleryProps> = forwardRef(({info, dateOrDateRange, imageUrls}, ref) => {
  return (
    <Box
      sx={{
        ...boxStyle,
        width: info.images.length === 1 ? 230 : info.images.length === 2 ? 320 : 500,
      }}
      ref={ref}
      tabIndex={-1}
    >
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
  )
})

interface EditLocationProps {
  dateOrDateRange: string
  info: MediaData
  editLocation: string
  setEditLocation: React.Dispatch<React.SetStateAction<string>>
  setPlace: () => Promise<void>
}
const EditLocation: FC<EditLocationProps> = forwardRef(({dateOrDateRange, info, editLocation, setEditLocation, setPlace}, ref) => {
  return (
    <Box
      sx={{...boxStyle, width: '90%'}}
      ref={ref}
      tabIndex={-1}
    >
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
})

export default PopupModal
