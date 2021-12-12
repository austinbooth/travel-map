import { useState, useEffect } from "react"
import {
  Routes,
  Route,
  Navigate
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
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    console.log('Running auth useEffect again...')
    auth.onAuthStateChanged((newFirebaseUser) => {
      setLoading(true)
      if (newFirebaseUser?.displayName && newFirebaseUser.uid) {
        setUser({name: newFirebaseUser?.displayName, uid: newFirebaseUser?.uid})
      }
      setLoading(false)
      console.log('Logged in', newFirebaseUser?.displayName)
    })
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <Routes>
      <Route path='/'      element={<Home />}   />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='upload' element={user ? <Upload /> : <Navigate to='/signin' replace />} />
    </Routes>
  )
}

export default App
