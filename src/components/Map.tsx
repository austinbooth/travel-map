import { FC, SyntheticEvent } from "react"
import MapGL, { Marker } from "react-map-gl"
import redPin from "../images/red-pin.png"
import greenPin from "../images/green-pin.png"
import PopUp from "./Popup"
import { auth } from '../firebaseSingleton'
import { Viewport } from "../types"
import useMedia from './MediaContext'

// Following 6 lines from https://stackoverflow.com/questions/65434964/mapbox-blank-map-react-map-gl-reactjs:
import mapboxgl from 'mapbox-gl'
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default 

interface MapProps {
  viewport: {
    width: number
    height: number
    latitude: number
    longitude: number
    zoom: number
  }
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>
  popupInfo: string | null
  setPopupInfo: React.Dispatch<React.SetStateAction<string | null>>
}

const Map: FC<MapProps> = ({viewport, setViewport, popupInfo, setPopupInfo}) => {
  const result = useMedia()
  if (result.state === 'Error') {
    return <p>There was an error, please try again.</p>
  }
  if (result.state === 'Loading') {
    return <p>Loading...</p>
  }
  const { data } = result
  
  const pinData = data.map((pin) => (
    <Marker
      key={pin.uid}
      longitude={pin.longitude}
      latitude={pin.latitude}
      offsetTop={-25}
      offsetLeft={-15}
    >
      <div className="pin" id={pin.uid} onClick={(e: SyntheticEvent) => {
        if (e.currentTarget.id !== popupInfo) {
          setPopupInfo(null)
          setTimeout(() => setPopupInfo(pin.uid), 0)
          // if another pin is clicked when a popup is already open, this allows the popup to be closed and the new one to open
          setViewport((current) => ({...current, latitude: pin.latitude, longitude: pin.longitude, zoom: Math.max(current.zoom, 16)}))
        }
      }}>
        <img src={pin.user === auth.currentUser?.uid ? redPin : greenPin} alt={"pin"} />
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
        {popupInfo && <PopUp uid={popupInfo} data={data} setPopupInfo={setPopupInfo} />}
      </MapGL>
    </div>
  )
}

export default Map
