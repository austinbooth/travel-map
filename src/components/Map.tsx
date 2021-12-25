import { FC, SyntheticEvent, useEffect, useState } from "react"
import MapGL, { Marker } from "react-map-gl"
import redPin from "../images/red-pin.png"
import greenPin from "../images/green-pin.png"
import { getAllMediaForUser, getAllUsers } from "../firestoreUtils"
import PopUp from "./Popup"
import { auth } from '../firebaseSingleton'
import { groupMedia } from "../util"
import { MediaData, MediaDataProcessed } from "../types"

// Following 6 lines from https://stackoverflow.com/questions/65434964/mapbox-blank-map-react-map-gl-reactjs:
import mapboxgl from 'mapbox-gl'
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default 

interface Viewport {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

interface MapProps {
  viewport: {
    width: number
    height: number
    latitude: number
    longitude: number
    zoom: number
  }
  setViewport: (viewport: Viewport) => void
  popupInfo: string | null
  setPopupInfo: (uid: string | null) => void
}

const Map: FC<MapProps> = ({viewport, setViewport, popupInfo, setPopupInfo}) => {
  const [data, setData] = useState<MediaDataProcessed[]>()
  useEffect(() => {
    void (async () => {
      const users = await getAllUsers()
      const usersData = await Promise.all(users.map(async(user) => {
        const data = await getAllMediaForUser(user)
        const groupedData = groupMedia(data as MediaData[])
        return groupedData
      }))
      setData(usersData.flat())
    })()
  }, [])
  if (!data) {
    return <p>Loading...</p>
  }
  const pinData = data.map((pin) => (
    <Marker
      key={`${pin.place} ${pin.images[0].user}`}
      longitude={pin.longitude}
      latitude={pin.latitude}
      offsetTop={-25}
      offsetLeft={-15}
    >
      <div className="pin" id={`${pin.place} ${pin.images[0].user}`} onClick={(e: SyntheticEvent) => {
        if (e.currentTarget.id !== popupInfo) {
          setPopupInfo(null)
          setTimeout(() => setPopupInfo(`${pin.place} ${pin.images[0].user}`), 0)
          // if another pin is clicked when a popup is already open, this allows the popup to be closed and the new one to open  
        }
      }}>
        <img src={pin.images.find(image => image.user !== auth.currentUser?.uid) ? greenPin : redPin} alt={"pin"} />
      </div>
    </Marker>
  ))

  return (
    <div className="map-container">
      <MapGL
        {...viewport}
        onViewportChange={(viewport: Viewport) => setViewport(viewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {pinData}
        {popupInfo && <PopUp placeAndUser={popupInfo} data={data} setPopupInfo={setPopupInfo} />}
      </MapGL>
    </div>
  )
}

export default Map
