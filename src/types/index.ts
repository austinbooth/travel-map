import { Timestamp } from 'firebase/firestore'

type Uid = string // maybe refine in future

export interface User {
  name: string
  uid: Uid
}

export interface MediaData {
  uid: string
  imageUri: string
  thumbnailUri : string
  rotation: number
  datetime: Timestamp
  latitude: number
  longitude: number
  place: string
  country: string
}

export interface ImageData {
  uid: string
  imageUri: string
  thumbnailUri : string
  rotation: number
  datetime: Timestamp
}
export interface MediaDataProcessed {
  latitude: number
  longitude: number
  place: string
  country: string
  images: ImageData[]
}
