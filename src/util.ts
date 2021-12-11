import { DateTime } from "luxon" 

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
