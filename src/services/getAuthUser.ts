import { getAuth } from 'firebase/auth'

const getAuthUser = () => {
  const user = getAuth().currentUser
  if (!user) {
    throw new Error('User not logged in')
  }
  return user
}

export default getAuthUser
