"use client"
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Icon, DivIcon, point } from "leaflet";
const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster: any) {
  return new DivIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

// markers
const markers: { geocode: [number, number]; popUp: string }[] = [
  {
    geocode: [10.823000, 106.629600],
    popUp: "Hello, I am pop up 1",
  },
  {
    geocode: [21.005401, 105.846295],
    popUp: "Hello, I am pop up 2",
  },
  {
    geocode: [21.005826, 105.853897],
    popUp: "Hello, I am pop up 3",
  },
];

const Page = () =>  {

  const defaultProps = {
    center: {
      lat: 21.0052578,
      lng: 105.8434198,
    },
    zoom: 13,
  };
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={defaultProps.center} zoom={defaultProps.zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Page;