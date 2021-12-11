import { useState, useEffect } from "react"
import {
  Routes,
  Route,
} from "react-router-dom"
import 'mapbox-gl/dist/mapbox-gl.css'
import "./App.css"
import { auth } from './firebaseSingleton'
import Home from "./components/Home"
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import Upload from "./components/Upload"
import { User } from './types'



const App = () => {
  // eslint-disable-next-line
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    auth.onAuthStateChanged((newFirebaseUser) => {
      if (newFirebaseUser?.displayName && newFirebaseUser.uid) {
        setUser({name: newFirebaseUser?.displayName, uid: newFirebaseUser?.uid})
      }
      console.log('Logged in', newFirebaseUser?.displayName)
    })
  }, [])

  return (
    <Routes>
      <Route path='/'      element={<Home />}   />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='upload' element={<Upload />} />
    </Routes>
  )
}

export default App
