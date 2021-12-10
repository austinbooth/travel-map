import axios from "axios"

interface Coords {
  lat: number
  lng: number
}

export const getLatLngFromName = async (
  placename: string
): Promise<Coords> => {
  const api_url = "https://api.opencagedata.com/geocode/v1/json"
  const request_url = `${api_url}?key=${process.env.REACT_APP_OPENCAGE_KEY}&q=${placename}`

  try {
    const data: Coords = (await axios.get(request_url)).data.results[0].geometry
    return data
  } catch (err) {
    console.error(err)
    throw new Error('Error fetching coordinates.')
  }
}
