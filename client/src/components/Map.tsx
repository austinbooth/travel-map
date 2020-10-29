import React from "react";
import MapGL, { Marker, Popup } from "react-map-gl";
import { MAPBOX_TOKEN } from "../token";
import redPin from "../images/red-pin.png";

const visited = [
  {
    name: "Prague",
    latitude: 50.0755,
    longitude: 14.4378,
    images: [
      {
        src:
          "https://firebasestorage.googleapis.com/v0/b/travel-map-6fc3a.appspot.com/o/color_wheel_4_background.svg?alt=media&token=5e3ac8c6-fa5f-424c-a7d7-4de0c387b3ef",
        alt: "Image alt text",
      },
    ],
  },
  {
    name: "Berlin",
    latitude: 52.52,
    longitude: 13.405,
    images: [
      {
        src:
          "https://firebasestorage.googleapis.com/v0/b/travel-map-6fc3a.appspot.com/o/color_wheel_4_background.svg?alt=media&token=5e3ac8c6-fa5f-424c-a7d7-4de0c387b3ef",
        alt: "Image alt text",
      },
    ],
  },
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
  popupInfo: string | null;
  setPopupInfo: (location: string | null) => void;
}

const Map: React.FC<MapProps> = (props) => {
  const pinData = visited.map((pin) => (
    <Marker
      key={pin.name}
      longitude={pin.longitude}
      latitude={pin.latitude}
      offsetTop={-25}
      offsetLeft={-15}
    >
      <div className="pin" onClick={() => props.setPopupInfo(pin.name)}>
        <img src={redPin} alt={"pin"} />
      </div>
    </Marker>
  ));

  const popUp = (find: string) => {
    const info = visited.filter((location) => location.name === find)[0];
    console.log(info.name);
    return (
      <Popup
        tipSize={5}
        anchor="top"
        latitude={info.latitude}
        longitude={info.longitude}
        closeOnClick={false}
        onClose={() => props.setPopupInfo(null)}
      >
        {info.name}
        <img src={info.images[0].src} alt={info.images[0].alt}></img>
      </Popup>
    );
  };

  return (
    <div className="map-container">
      <MapGL
        {...props.viewport}
        onViewportChange={(viewport) => props.setViewport(viewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {pinData}
        {props.popupInfo && popUp(props.popupInfo)}
      </MapGL>
    </div>
  );
};

export default Map;
