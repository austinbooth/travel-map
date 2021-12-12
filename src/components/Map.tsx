import { FC, useEffect, useState } from "react"
import MapGL, { Marker, Popup } from "react-map-gl"
import redPin from "../images/red-pin.png"
import { getAllMediaForUser } from "../firestoreUtils"
import { auth } from '../firebaseSingleton'
import { MediaData } from "../types"

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
  const [data, setData] = useState<MediaData[]>()
  useEffect(() => {
    void (async () => {
      if (auth.currentUser?.uid) {
        const data = await getAllMediaForUser(auth.currentUser?.uid)
        console.log('DATA:', data)
        setData(data as MediaData[])
      }
    })()
  }, [])
  if (!data) {
    return <p>Loading...</p>
  }
  const pinData = data.map((pin) => (
    <Marker
      key={pin.uid}
      longitude={pin.longitude}
      latitude={pin.latitude}
      offsetTop={-25}
      offsetLeft={-15}
    >
      <div className="pin" onClick={() => setPopupInfo(pin.uid)}>
        <img src={redPin} alt={"pin"} />
      </div>
    </Marker>
  ))

  const popUp = (uid: string) => {
    const info = data.find((location) => location.uid === uid)
    if (!info) {
      return <div>Location not found</div>
    }
    console.log(info.city)
    return (
      <Popup
        tipSize={5}
        anchor="top"
        latitude={info.latitude}
        longitude={info.longitude}
        closeOnClick={false}
        onClose={() => setPopupInfo(null)}
      >
        <div onClick={()=>console.log('clicked!')}>
          {info.city}
          {/* <img src={info.images[0].src} alt={info.images[0].alt}></img> */}
        </div>
      </Popup>
    )
  }

  return (
    <div className="map-container">
      <MapGL
        {...viewport}
        onViewportChange={(viewport: Viewport) => setViewport(viewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {pinData}
        {popupInfo && popUp(popupInfo)}
      </MapGL>
    </div>
  )
}

export default Map
