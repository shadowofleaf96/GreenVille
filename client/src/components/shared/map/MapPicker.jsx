"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Internal component to handle center changes and map clicks
const MapEvents = ({ onLocationSelect, markerPosition }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  useEffect(() => {
    if (markerPosition) {
      map.flyTo(markerPosition, map.getZoom());
    }
  }, [markerPosition, map]);

  return null;
};

const MapPicker = ({ initialPosition, onLocationSelect, readOnly = false }) => {
  const DEFAULT_CENTER = { lat: 33.5731, lng: -7.5898 };

  const isValidLatLng = (pos) => {
    return (
      pos &&
      typeof pos.lat === "number" &&
      typeof pos.lng === "number" &&
      !isNaN(pos.lat) &&
      !isNaN(pos.lng)
    );
  };

  const [position, setPosition] = useState(() => {
    if (isValidLatLng(initialPosition)) return initialPosition;
    return DEFAULT_CENTER;
  });

  // Sync position if initialPosition changes and is valid
  useEffect(() => {
    if (isValidLatLng(initialPosition)) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handleLocationSelect = (latlng) => {
    if (readOnly) return;
    setPosition(latlng);
    if (onLocationSelect) {
      onLocationSelect({
        latitude: latlng.lat,
        longitude: latlng.lng,
      });
    }
  };

  return (
    <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-gray-100 shadow-inner relative z-0">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapEvents
          onLocationSelect={handleLocationSelect}
          markerPosition={position}
        />
      </MapContainer>
      {!readOnly && (
        <div className="absolute top-4 right-4 z-1000 bg-white rounded-xl p-3 shadow-lg border border-gray-100 px-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Click on map to pin your location
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
