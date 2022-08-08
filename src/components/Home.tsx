import { FC, useState } from 'react'
import { useNavigate } from "react-router-dom"
import LocationForm from "./LocationForm"
import Map from "../components/Map"
import { Viewport } from '../types'
import QueryProvider from "./QueryProvider"
import { MediaProvider } from './MediaContext'

const HomeComponent: FC = () => {
  const navigate = useNavigate()
  const [viewport, setViewport] = useState<Viewport>({
    width: 800,
    height: 400,
    latitude: 23,
    longitude: 0,
    zoom: 1,
  })

  const [popupInfo, setPopupInfo] = useState<string | null>(null)

  const setCoords = (latitude: number, longitude: number) => {
    setViewport({ ...viewport, latitude, longitude, zoom: 8 })
  }
  return (
    <div className="App">
      <header>
        <h1>Travel Map</h1>
      </header>
      <LocationForm setCoords={setCoords} />
      <button onClick={() => navigate('/upload')}>Upload</button>
      <Map
        viewport={viewport}
        setViewport={setViewport}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
      />
    </div>
)}

const Home: FC = () => (
  <QueryProvider>
    <MediaProvider>
      <HomeComponent />
    </MediaProvider>
  </QueryProvider>
)

export default Home
