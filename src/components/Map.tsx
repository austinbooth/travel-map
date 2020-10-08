import React from "react";
import MapGL, { Marker } from "react-map-gl";
import { MAPBOX_TOKEN } from "../token";
import redPin from "../images/red-pin.png";

const visited = [
  { name: "Prague", latitude: 50.0755, longitude: 14.4378 },
  { name: "Berlin", latitude: 52.52, longitude: 13.405 },
];

interface Viewport {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
}

interface MapProps {
  viewport: {
    width: number;
    height: number;
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewport: (viewport: Viewport) => void;
}

const Map: React.FC<MapProps> = (props) => {
  const pinData = visited.map((pin) => (
    <Marker key={pin.name} longitude={pin.longitude} latitude={pin.latitude}>
      <div className="pin" onClick={() => console.log(pin.name)}>
        <img src={redPin} alt={"pin"} />
      </div>
    </Marker>
  ));
  return (
    <MapGL
      {...props.viewport}
      onViewportChange={(viewport) => props.setViewport(viewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      {pinData}
    </MapGL>
  );
};

export default Map;
