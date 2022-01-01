import { DateTime } from "luxon";

export interface ImageDataWithoutLocation {
  datetime: DateTime
  imageUri: string
  thumbnailUri: string
  thumbnailUrl: string
  rotation: number
  filename: string
}

export interface LocationData {
  geo_data: Record<string, string | number>
  place: string
  place_full: string
  country: string
}

export interface LocationDataWithCoords extends LocationData {
  lat: number
  lng: number
}
