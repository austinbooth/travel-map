import React, { useRef } from "react";
import * as api from "../api";

interface LocationFormProps {
  setCoords: (latitude: number, longitude: number) => void;
}

const LocationForm: React.FC<LocationFormProps> = (props) => {
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const location = locationInputRef.current!.value;
    api
      .getLatLngFromName(location)
      .then(({ lat, lng }) => props.setCoords(lat, lng));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="location"
          name="location"
          ref={locationInputRef}
        ></input>
        <button type="submit">Find</button>
      </form>
    </div>
  );
};

export default LocationForm;
