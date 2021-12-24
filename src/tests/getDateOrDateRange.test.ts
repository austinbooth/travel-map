import { getDateOrDateRange } from '../util'
import {
  processedData, s1Timestamp, g1Timestamp, g2Timestamp,
  n2Timestamp_latest, n3Timestamp_earliest,
  l1Timestamp
} from './testData'
import { DateTime } from 'luxon'

describe('getDateOrDateRange fn', () => {
  test('Returns the date when there is only one image', () => {
    const result = getDateOrDateRange(processedData[0])
    expect(result).toEqual(DateTime.fromJSDate(s1Timestamp.toDate()).toFormat('dd LLL yyyy'))
  })
  test('Returns the correct date range when there are two images', () => {
    const result = getDateOrDateRange(processedData[1])
    const g1TimestampString = DateTime.fromJSDate(g1Timestamp.toDate()).toFormat('dd LLL yyyy')
    const g2TimestampString = DateTime.fromJSDate(g2Timestamp.toDate()).toFormat('dd LLL yyyy')
    expect(result).toBe(`${g1TimestampString} - ${g2TimestampString}`)
  })
  test('Returns the correct date range when there are more than two images', () => {
    const result = getDateOrDateRange(processedData[2])
    const n2Timestamp_latest_string = DateTime.fromJSDate(n2Timestamp_latest.toDate()).toFormat('dd LLL yyyy')
    const n3Timestamp_earliest_string = DateTime.fromJSDate(n3Timestamp_earliest.toDate()).toFormat('dd LLL yyyy')
    expect(result).toBe(`${n3Timestamp_earliest_string} - ${n2Timestamp_latest_string}`)
  })
  test('Only return one date when all the images have the same date', () => {
    const result = getDateOrDateRange(processedData[3])
    const l1TimestampString = DateTime.fromJSDate(l1Timestamp.toDate()).toFormat('dd LLL yyyy')
    expect(result).toEqual(l1TimestampString)
  })
})
