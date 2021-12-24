import { DateTime } from "luxon"
import { groupBy, omit } from "lodash"
import { MediaData, MediaDataProcessed } from "./types"

export const getDateFromFilename = (filename: string): DateTime => {
  const filenameWithOutExt = filename.slice(0, -4) // need a regex that can take care of multiple file formats
  const filenameDT = DateTime.fromFormat(filenameWithOutExt, 'yyyy-MM-dd HH.mm.ss').toUTC()    
  return filenameDT
}
export const earliestDateTime = (date1: DateTime, date2: DateTime): DateTime => {
  if (date1.invalidReason && date2.invalidReason) {
    throw new Error('Both datetime objects are invalid.')
  }
  if (date1.invalidReason) {
    return date2
  }
  if (date2.invalidReason) {
    return date1
  }
  return date1 <= date2 ? date1 : date2
}

export const groupMedia = (data: MediaData[]) => {
  const grouped = groupBy(data, 'place')
  const processed = Object.keys(grouped)
    .map(locationName => ({ place: locationName, images: grouped[locationName]}))
    .map(location => ({
      ...location,
      latitude: location.images[0].latitude,
      longitude: location.images[0].longitude,
      country: location.images[0].country,
      images: location.images.map(imageData => omit(imageData, ['latitude', 'longitude', 'place', 'country']))
    }))
  return processed
}

export const getDateOrDateRange = (data: MediaDataProcessed) => {
  if (data.images.length === 0) { // should not happen
    return
  }
  if (data.images.length === 1) {
    return DateTime.fromJSDate(data.images[0].datetime.toDate()).toFormat('dd LLL yyyy')
  }
  const allDates = data.images
    .map(image => DateTime.fromJSDate(image.datetime.toDate()))
    .sort((date1, date2) => date1.toMillis() - date2.toMillis())
  
  const earliest = allDates[0]
  const latest = allDates[allDates.length - 1]
  return `${earliest.toFormat('dd LLL yyyy')} - ${latest.toFormat('dd LLL yyyy')}`
}
