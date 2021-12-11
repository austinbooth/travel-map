import { FC, useState, ChangeEvent } from 'react'
import { ref, uploadBytes } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { storage } from '../firebaseSingleton'
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'
import * as exifr from 'exifr'

const Upload: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File>()
  const [uploading, setUploading] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setSelectedFile(file)
    }
  }
  const getDateFromFilename = (filename: string): DateTime => {
    const filenameWithOutExt = filename.slice(0, -4) // need a regex that can take care of multiple file formats
    const filenameDT = DateTime.fromFormat(filenameWithOutExt, 'yyyy-MM-dd HH.mm.ss').toUTC()    
    return filenameDT
  }
  const earliestDateTime = (date1: DateTime, date2: DateTime): DateTime => {
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
  const uploadFile = async () => {
    if (selectedFile) {
      try {
        setUploading(true)
        const user = getAuth().currentUser
        if (!user) {
          throw new Error('User not logged in')
        }
        
        const datetimeFromFilename = getDateFromFilename(selectedFile.name)
        const datetimeFromFile = DateTime.fromMillis(selectedFile.lastModified).toUTC()
        const datetime = earliestDateTime(datetimeFromFilename, datetimeFromFile)

        const dateFolder = `${datetime.day}-${datetime.month}-${datetime.year}`
        const uploadFileName = uuid()
        const firestoreFileRef = ref(storage, `${user.uid}/${dateFolder}/${uploadFileName}`)
        await uploadBytes(firestoreFileRef, selectedFile)
        const imageUri = firestoreFileRef.toString()
        console.log('Uploaded:', imageUri)

        const { latitude, longitude } = await exifr.gps(selectedFile)
        // const place = await getPlaceFromLatLng({lat: latitude, lng: longitude})
        // console.log('PLACE:', place)
        const thumbnail = await exifr.thumbnail(selectedFile)
        const r = await exifr.rotation(selectedFile)

        if (!thumbnail || !r) {
          throw new Error('Could not generate thumbnail or get rotation info')
        }
        const { deg } = r
        const firestoreFileRefThumbnail = ref(storage, `${user.uid}/${dateFolder}/${uploadFileName}-thumb`)
        await uploadBytes(firestoreFileRefThumbnail, thumbnail, {contentType: 'image/jpeg'})
        const thumbnailUri = firestoreFileRef.toString()
        console.log('Uploaded thumbnail:', thumbnailUri)

        const dbEntity = {
          imageUri,
          thumbnailUri,
          rotation: deg,
          datetime: datetime.toMillis(), // convert to firebase datetime
          latitude,
          longitude,
        }


        setImageUploaded(true)
      } catch (err) {
        console.error(err)
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <div>
      <input
        type='file'
        onChange={handleChange}
        disabled={uploading}
        style={{width: 'fit-content'}}
      />
      <button onClick={uploadFile} disabled={uploading}>Upload</button>
      {imageUploaded && (
        <p>Your image has been uploaded.</p>
      )}
    </div>
  )
}

export default Upload
