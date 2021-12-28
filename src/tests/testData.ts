import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'
import { MediaData, MediaDataProcessed } from '../types'

export const s1Timestamp = Timestamp.fromDate(DateTime.now().minus({years: 1}).toJSDate())
export const g1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 180}).toJSDate())
export const g2Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 179}).toJSDate())

export const n1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 6}).toJSDate())
export const n2Timestamp_latest = Timestamp.fromDate(DateTime.now().minus({days: 2}).toJSDate())
export const n3Timestamp_earliest = Timestamp.fromDate(DateTime.now().minus({days: 10}).toJSDate())

export const l1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 2}).toJSDate())

export const testData: MediaData[] = [
  {
    uid: 'S1',
    user: 'U1',
    country: "United Kingdom",
    datetime: s1Timestamp,
    imageUri: "gs://sheffield-1",
    latitude: 53.427647,
    longitude: -1.70495,
    place: "Sheffield",
    rotation: 90,
    thumbnailUri: "gs://sheffield-1-thumb"
  },
  {
    uid: 'G1',
    user: 'U1',
    country: "United Kingdom",
    datetime: g1Timestamp,
    imageUri: "gs://golspie-1",
    latitude: 57.981414,
    longitude: -3.942469,
    place: "Golspie",
    rotation: 90,
    thumbnailUri: "gs://golspie-1-thumb"
  },
  {
    uid: 'G2',
    user: 'U1',
    country: "United Kingdom",
    datetime: g2Timestamp,
    imageUri: "gs://golspie-2",
    latitude: 57.98196897,
    longitude: -3.94452397,
    place: "Golspie",
    rotation: 90,
    thumbnailUri: "gs://golspie-2-thumb"
  },
  {
    uid: 'N1',
    user: 'U1',
    country: "United Kingdom",
    datetime: n1Timestamp,
    imageUri: "gs://nottingham-1",
    latitude: 52.9548,
    longitude: -1.1581,
    place: "Nottingham",
    rotation: 90,
    thumbnailUri: "gs://nottingham-1-thumb"
  },
  {
    uid: 'N2',
    user: 'U1',
    country: "United Kingdom",
    datetime: n2Timestamp_latest,
    imageUri: "gs://nottingham-2",
    latitude: 52.9548,
    longitude: -1.1581,
    place: "Nottingham",
    rotation: 90,
    thumbnailUri: "gs://nottingham-2-thumb"
  },
  {
    uid: 'N3',
    user: 'U1',
    country: "United Kingdom",
    datetime: n3Timestamp_earliest,
    imageUri: "gs://nottingham-3",
    latitude: 52.9548,
    longitude: -1.1581,
    place: "Nottingham",
    rotation: 90,
    thumbnailUri: "gs://nottingham-3-thumb"
  },
  {
    uid: 'L1',
    user: 'U1',
    country: "United Kingdom",
    datetime: l1Timestamp,
    imageUri: "gs://london-1",
    latitude: 51.5072,
    longitude: -0.1276,
    place: "London",
    rotation: 90,
    thumbnailUri: "gs://london-1-thumb"
  },
  {
    uid: 'L2',
    user: 'U1',
    country: "United Kingdom",
    datetime: l1Timestamp,
    imageUri: "gs://london-2",
    latitude: 51.5072,
    longitude: -0.1276,
    place: "London",
    rotation: 90,
    thumbnailUri: "gs://london-2-thumb"
  },
]

export const processedData: MediaDataProcessed[] = [
  {
    uid: 'uid0',
    latitude: 53.427647,
    longitude: -1.70495,
    place: "Sheffield",
    country: "United Kingdom",
    user: 'U1',
    images: [
      {
        // uid: 'S1',
        imageUri: "gs://sheffield-1",
        thumbnailUri: "gs://sheffield-1-thumb",
        rotation: 90,
        datetime: s1Timestamp,
        latitude: 53.427647,
        longitude: -1.70495,
        geo_data: {}
      }
    ]
  },
  {
    uid: 'uid1',
    country: "United Kingdom",
    latitude: (57.981414 + 57.98196897) / 2,
    longitude: (-3.942469 + -3.94452397) / 2,
    place: "Golspie",
    user: 'U1',
    images: [
      {
        // uid: 'G1',
        imageUri: "gs://golspie-1",
        thumbnailUri: "gs://golspie-1-thumb",    
        rotation: 90,
        datetime: g1Timestamp,
        latitude: 57.981414,
        longitude: -3.942469,
        geo_data: {}
      },
      {
        // uid: 'G2',
        imageUri: "gs://golspie-2",
        thumbnailUri: "gs://golspie-2-thumb",
        rotation: 90,
        datetime: g2Timestamp,
        latitude: 57.98196897,
        longitude: -3.94452397,
        geo_data: {}
      }
    ]
  },
  {
    uid: 'uid2',
    country: "United Kingdom",
    latitude: 52.9548,
    longitude: -1.1581,
    place: "Nottingham",
    user: 'U1',
    images: [
      {
        // uid: 'N1',
        imageUri: "gs://nottingham-1",
        thumbnailUri: "gs://nottingham-1-thumb",    
        rotation: 90,
        datetime: n1Timestamp,
        latitude: 52.9548,
        longitude: -1.1581,
        geo_data: {}
      },
      {
        // uid: 'N2',
        imageUri: "gs://nottingham-2",
        thumbnailUri: "gs://nottingham-2-thumb",    
        rotation: 90,
        datetime: n2Timestamp_latest,
        latitude: 52.9548,
        longitude: -1.1581,
        geo_data: {}
      },
      {
        // uid: 'N3',
        imageUri: "gs://nottingham-3",
        thumbnailUri: "gs://nottingham-3-thumb",    
        rotation: 90,
        datetime: n3Timestamp_earliest,
        latitude: 52.9548,
        longitude: -1.1581,
        geo_data: {}
      },
    ]
  },
  {
    uid: 'uid3',
    country: "United Kingdom",
    latitude: 51.5072,
    longitude: -0.1276,
    place: "London",
    user: 'U1',
    images: [
      {
        // uid: 'L1',
        imageUri: "gs://london-1",
        thumbnailUri: "gs://london-1-thumb",    
        rotation: 90,
        datetime: l1Timestamp,
        latitude: 51.5072,
        longitude: -0.1276,
        geo_data: {}
      },
      {
        // uid: 'L2',
        imageUri: "gs://london-2",
        thumbnailUri: "gs://london-2-thumb",    
        rotation: 90,
        datetime: l1Timestamp,
        latitude: 51.5072,
        longitude: -0.1276, 
        geo_data: {}
      },
    ]
  }
]
