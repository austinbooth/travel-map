import { Timestamp } from 'firebase/firestore'

export type Uid = string // maybe refine in future

export interface User {
  name: string
  uid: Uid
}

export interface MediaData {
  uid: string
  user: Uid
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
  uid: Uid
  user: Uid
  latitude: number
  longitude: number
  place: string
  country: string
  images: ImageData[]
}
