import React from "react";
import MapGL from "react-map-gl";
import { MAPBOX_TOKEN } from "../token";

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
  return (
    <MapGL
      {...props.viewport}
      onViewportChange={(viewport) => props.setViewport(viewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    />
  );
};

export default Map;
