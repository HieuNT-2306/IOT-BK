"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ lat, lng, text }: { lat: number; lng: number; text: string }) => (
  <div>{text}</div>
);
const Page = () => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCB9yG-Z6HFGVoPjM6x2W5lr0DZs16BpsE" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
};

export default Page;
