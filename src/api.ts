import axios from "axios";
import { OPENCAGE_TOKEN } from "./token";

export const getLatLngFromName = (
  placename: string
): Promise<{ lat: number; lng: number }> => {
  const api_url = "https://api.opencagedata.com/geocode/v1/json";
  const request_url = `${api_url}?key=${OPENCAGE_TOKEN}&q=${placename}`;

  return axios
    .get(request_url)
    .then((res) => res.data.results[0].geometry)
    .then((coords) => coords);
};
