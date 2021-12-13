import { FC, useEffect, useState } from 'react'
import { getDownloadUrlFromUri } from '../firestoreUtils'
import { Popup } from 'react-map-gl'
import { MediaData } from '../types'

interface Props {
  uid: string
  data: MediaData[]
  setPopupInfo: (uid: string | null) => void
}

const PopUp: FC<Props> = ({uid, data, setPopupInfo}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()
  const [info, setInfo] = useState<MediaData>()
  useEffect(() => {
    void (async () => {
      const info = data.find((location) => location.uid === uid)
      if (!info) {
        return <div>Location not found</div>
      }
      console.log(info.city)
      setInfo(info)
      const thumbnailUrl = await getDownloadUrlFromUri(info.thumbnailUri)
      if (thumbnailUrl) {
        setThumbnailUrl(thumbnailUrl)
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
      <div onClick={()=>console.log('clicked!')} className='popup'>
        <p className='popup-place-heading'>{info.city}</p>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={info.city}
            style={{
              transform: `rotate(${info.rotation}deg)`,
              height: '50px'
            }}
          />)}
      </div>
    </Popup>
  )
}

export default PopUp
