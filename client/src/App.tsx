import React, { useState } from "react";
import "./App.css";
import LocationForm from "./components/LocationForm";
import Map from "./components/Map";

interface Viewport {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
}

const App = () => {
  const [viewport, setViewport] = useState<Viewport>({
    width: 800,
    height: 400,
    latitude: 23,
    longitude: 0,
    zoom: 1,
  });

  const [popupInfo, setPopupInfo] = useState<string | null>(null);

  const setCoords = (latitude: number, longitude: number) => {
    setViewport({ ...viewport, latitude, longitude, zoom: 8 });
  };

  return (
    <div className="App">
      <header>
        <h1>Travel Map</h1>
      </header>
      <LocationForm setCoords={setCoords} />
      <Map
        viewport={viewport}
        setViewport={setViewport}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
      />
    </div>
  );
};

export default App;
