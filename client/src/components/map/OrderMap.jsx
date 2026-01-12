import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import Iconify from "../iconify";
import { Button } from "@/components/ui/button";

// Fix for default marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom icon for current position
const UserIcon = L.divIcon({
  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const SetMapBounds = ({ orderPos, userPos }) => {
  const map = useMap();

  useEffect(() => {
    if (orderPos && userPos) {
      const bounds = L.latLngBounds([orderPos, userPos]);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (orderPos) {
      map.setView(orderPos, 15, { animate: true });
    }
  }, [orderPos, userPos, map]);

  return null;
};

const OrderMap = ({
  orderLocation,
  customerName,
  address,
  height = "400px",
}) => {
  const { t } = useTranslation();
  const [userPosition, setUserPosition] = useState(null);
  const [error, setError] = useState(null);

  const orderPos = orderLocation
    ? [orderLocation.lat, orderLocation.lng]
    : null;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(t("Geolocation is not supported by your browser"));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(t("Please enable location services to see your position"));
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [t]);

  const openGoogleMaps = () => {
    if (orderPos) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${orderPos[0]},${orderPos[1]}`;
      window.open(url, "_blank");
    } else if (address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address,
      )}`;
      window.open(url, "_blank");
    }
  };

  if (!orderPos) {
    return (
      <div
        className="w-full bg-gray-100 rounded-4xl flex flex-col items-center justify-center gap-4 p-8 text-center"
        style={{ height }}
      >
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm">
          <Iconify icon="solar:map-point-broken" width={32} />
        </div>
        <div className="space-y-1">
          <p className="font-black text-xs text-gray-400 uppercase tracking-widest italic">
            {t("Address coordinates not available")}
          </p>
          <p className="text-[10px] text-gray-400 font-medium max-w-[200px]">
            {t("map_no_coords_desc")}
          </p>
        </div>
        <Button
          onClick={openGoogleMaps}
          variant="outline"
          className="rounded-xl border-primary/20 bg-white text-primary font-black uppercase tracking-widest text-[10px] h-10 gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <Iconify icon="logos:google-maps" width={16} />
          {t("Search Address on Map")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className="relative w-full rounded-4xl overflow-hidden shadow-inner border border-gray-100"
      style={{ height }}
    >
      <MapContainer
        center={orderPos}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Order Location Marker */}
        <Marker position={orderPos} icon={DefaultIcon}>
          <Popup className="rounded-2xl overflow-hidden p-0">
            <div className="p-3">
              <p className="font-black text-xs text-primary uppercase tracking-widest mb-1">
                {t("Destination")}
              </p>
              <p className="font-bold text-gray-900 leading-tight mb-1">
                {customerName}
              </p>
              <p className="text-[10px] text-gray-500 line-clamp-2">
                {address}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* User Current Location Marker */}
        {userPosition && (
          <Marker position={userPosition} icon={UserIcon}>
            <Popup>
              <p className="font-bold text-xs">{t("Your Position")}</p>
            </Popup>
          </Marker>
        )}

        <SetMapBounds orderPos={orderPos} userPos={userPosition} />
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white rounded-2xl shadow-lg border-none h-12 w-12 hover:bg-gray-50 text-primary"
          onClick={openGoogleMaps}
        >
          <Iconify icon="logos:google-maps" width={24} />
        </Button>
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 right-4 z-1000 bg-white rounded-2xl p-3 shadow-lg border border-red-100 px-4 flex items-center gap-2">
          <Iconify
            icon="solar:danger-bold-duotone"
            className="text-red-500"
            width={18}
          />
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderMap;
