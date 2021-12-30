import { Timestamp } from 'firebase/firestore'

export type Uid = string // maybe refine in future

export interface User {
  name: string
  uid: Uid
}

export interface ImageData {
  imageUri: string
  thumbnailUri : string
  rotation: number
  datetime: Timestamp
  latitude: number
  longitude: number
  geo_data: Record<string, string | number>
}
export interface MediaData {
  uid: Uid
  user: Uid
  latitude: number
  longitude: number
  place: string
  country: string
  images: ImageData[]
}

export interface ImageDataForSavingToFirestore {
  userUid: string
  place_full: string
  imageData: ImageData
  place: string
  country: string
}
