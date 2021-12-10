import { useState, useEffect } from "react"
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom"
import 'mapbox-gl/dist/mapbox-gl.css'
import "./App.css"
import LocationForm from "./components/LocationForm"
import Map from "./components/Map"
import { auth } from './firebaseSingleton'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import Upload from "./components/Upload"
import { User } from './types'

interface Viewport {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

const App = () => {
  // eslint-disable-next-line
  const [user, setUser] = useState<User | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
    auth.onAuthStateChanged((newFirebaseUser) => {
      if (newFirebaseUser?.displayName && newFirebaseUser.uid) {
        setUser({name: newFirebaseUser?.displayName, uid: newFirebaseUser?.uid})
      }
      console.log('Logged in', newFirebaseUser?.displayName)
    })
  }, [])

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
      <Routes>
        <Route path='/' element={(
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
        )}>
        </Route>
        <Route path='signin' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='upload' element={<Upload />} />
      </Routes>
  )
}

export default App
