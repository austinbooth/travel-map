import { FC, createContext, useContext } from 'react'
import { MediaData } from '../types'
import { useQuery } from '@tanstack/react-query'
import { getMediaForAllUsers } from '../util'

type Loading = {
  state: 'Loading'
}

type Error = {
  state: 'Error'
}

type Complete = {
  state: 'Complete'
  data: MediaData[]
}

type MediaResult = Loading | Error | Complete


const MediaContext = createContext<MediaResult | undefined>(undefined)

export const MediaProvider: FC = ({children}) => {
  const { isLoading, isError, data } = useQuery(['getMedia'], getMediaForAllUsers)
  const contextValue: MediaResult =
    isError
    ? { state: 'Error' }
    : isLoading
      ? { state: 'Loading' }
      : {
          state: 'Complete',
          data: data as MediaData[]
        }
  return (
    <MediaContext.Provider value={contextValue}>
      {children}
    </MediaContext.Provider>
  )
}

export default function useMedia() {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error('useMedia context undefined')
  }
  return context
}