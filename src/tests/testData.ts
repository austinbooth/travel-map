import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'
import { MediaData } from '../types'

export const s1Timestamp = Timestamp.fromDate(DateTime.now().minus({years: 1}).toJSDate())
export const g1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 180}).toJSDate())
export const g2Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 179}).toJSDate())

export const n1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 6}).toJSDate())
export const n2Timestamp_latest = Timestamp.fromDate(DateTime.now().minus({days: 2}).toJSDate())
export const n3Timestamp_earliest = Timestamp.fromDate(DateTime.now().minus({days: 10}).toJSDate())

export const l1Timestamp = Timestamp.fromDate(DateTime.now().minus({days: 2}).toJSDate())

export const processedData: MediaData[] = [
  {
    uid: 'uid0',
    latitude: 53.427647,
    longitude: -1.70495,
    place: "Sheffield",
    place_full: '',
    country: "United Kingdom",
    user: 'U1',
    images: [
      {
        imageUri: "gs://sheffield-1",
        thumbnailUri: "gs://sheffield-1-thumb",
        rotation: 90,
        datetime: s1Timestamp,
        latitude: 53.427647,
        longitude: -1.70495,
        geo_data: { components: {}}
      }
    ]
  },
  {
    uid: 'uid1',
    country: "United Kingdom",
    latitude: (57.981414 + 57.98196897) / 2,
    longitude: (-3.942469 + -3.94452397) / 2,
    place: "Golspie",
    place_full: '',
    user: 'U1',
    images: [
      {
        imageUri: "gs://golspie-1",
        thumbnailUri: "gs://golspie-1-thumb",    
        rotation: 90,
        datetime: g1Timestamp,
        latitude: 57.981414,
        longitude: -3.942469,
        geo_data: { components: {}}
      },
      {
        imageUri: "gs://golspie-2",
        thumbnailUri: "gs://golspie-2-thumb",
        rotation: 90,
        datetime: g2Timestamp,
        latitude: 57.98196897,
        longitude: -3.94452397,
        geo_data: { components: {}}
      }
    ]
  },
  {
    uid: 'uid2',
    country: "United Kingdom",
    latitude: 52.9548,
    longitude: -1.1581,
    place: "Nottingham",
    place_full: '',
    user: 'U1',
    images: [
      {
        imageUri: "gs://nottingham-1",
        thumbnailUri: "gs://nottingham-1-thumb",    
        rotation: 90,
        datetime: n1Timestamp,
        latitude: 52.9548,
        longitude: -1.1581,
        geo_data: { components: {}}
      },
      {
        imageUri: "gs://nottingham-2",
        thumbnailUri: "gs://nottingham-2-thumb",    
        rotation: 90,
        datetime: n2Timestamp_latest,
        latitude: 52.9548,
        longitude: -1.1581,
        geo_data: { components: {}}
      },
      {
        imageUri: "gs://nottingham-3",
        thumbnailUri: "gs://nottingham-3-thumb",    
        rotation: 90,
        datetime: n3Timestamp_earliest,
        latitude: 52.9548,
        longitude: -1.1581,
        geo_data: { components: {}}
      },
    ]
  },
  {
    uid: 'uid3',
    country: "United Kingdom",
    latitude: 51.5072,
    longitude: -0.1276,
    place: "London",
    place_full: '',
    user: 'U1',
    images: [
      {
        imageUri: "gs://london-1",
        thumbnailUri: "gs://london-1-thumb",    
        rotation: 90,
        datetime: l1Timestamp,
        latitude: 51.5072,
        longitude: -0.1276,
        geo_data: { components: {}}
      },
      {
        imageUri: "gs://london-2",
        thumbnailUri: "gs://london-2-thumb",    
        rotation: 90,
        datetime: l1Timestamp,
        latitude: 51.5072,
        longitude: -0.1276, 
        geo_data: { components: {}}
      },
    ]
  }
]
