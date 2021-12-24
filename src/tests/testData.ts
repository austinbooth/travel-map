import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'
import { MediaData, MediaDataProcessed } from '../types'

export const s1Timestamp = Timestamp.fromDate(DateTime.now().minus({years: 1}).toJSDate())
export const g1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 180}).toJSDate())
export const g2Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 179}).toJSDate())

export const testData: MediaData[] = [
  {
    uid: 'S1',
    country: "United Kingdom",
    datetime: s1Timestamp,
    imageUri: "gs://sheffield-1",
    latitude: 53.42764722222222,
    longitude: -1.70495,
    place: "Sheffield",
    rotation: 90,
    thumbnailUri: "gs://sheffield-1-thumb"
  },
  {
    uid: 'G1',
    country: "United Kingdom",
    datetime: g1Timestamp,
    imageUri: "gs://golspie-1",
    latitude: 57.981414,
    longitude: -3.9424690000000004,
    place: "Golspie",
    rotation: 90,
    thumbnailUri: "gs://golspie-1-thumb"
  },
  {
    uid: 'G2',
    country: "United Kingdom",
    datetime: g2Timestamp,
    imageUri: "gs://golspie-2",
    latitude: 57.98196897222223,
    longitude: -3.9445239722222225,
    place: "Golspie",
    rotation: 90,
    thumbnailUri: "gs://golspie-2-thumb"
  }
]

export const processedData: MediaDataProcessed[] = [
  {
    latitude: 53.42764722222222,
    longitude: -1.70495,
    place: "Sheffield",
    country: "United Kingdom",
    images: [
      {
        uid: 'S1',
        imageUri: "gs://sheffield-1",
        thumbnailUri: "gs://sheffield-1-thumb",
        rotation: 90,
        datetime: s1Timestamp,
      }
    ]
  },
  {
    country: "United Kingdom",
    latitude: 57.981414,
    longitude: -3.9424690000000004,
    place: "Golspie",
    images: [
      {
        uid: 'G1',
        imageUri: "gs://golspie-1",
        thumbnailUri: "gs://golspie-1-thumb",    
        rotation: 90,
        datetime: g1Timestamp,
      },
      {
        uid: 'G2',
        imageUri: "gs://golspie-2",
        thumbnailUri: "gs://golspie-2-thumb",
        rotation: 90,
        datetime: g2Timestamp,
      }
    ]
  }
]
