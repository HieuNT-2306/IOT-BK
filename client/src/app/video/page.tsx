'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";
import { Icon, DivIcon, Point, LatLngTuple } from "leaflet";

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const MarkerClusterGroup = dynamic(() => import('react-leaflet-cluster'), { ssr: false });

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38], // size of the icon
});

interface Cluster {
  getChildCount(): number;
}

const createClusterCustomIcon = (cluster: Cluster): DivIcon => {
  return new DivIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: new Point(33, 33, true),
  });
};

interface MarkerData {
  geocode: LatLngTuple;
  popUp: string;
}

const markers: MarkerData[] = [
  { geocode: [48.86, 2.3522], popUp: "Hello, I am pop up 1" },
  { geocode: [48.85, 2.3522], popUp: "Hello, I am pop up 2" },
  { geocode: [48.855, 2.34], popUp: "Hello, I am pop up 3" },
];

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensures rendering only happens on the client
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering during SSR
  }

  return (
    <div>
      <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "50vh", width: "50%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
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
