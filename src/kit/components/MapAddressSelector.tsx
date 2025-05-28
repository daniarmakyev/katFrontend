import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import defaultMarker from "../assets/deafoult-marker.svg";
import userMarker from "../assets/user-marker.svg";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapAddressSelectorProps {
  onAddressSelect: (address: string) => void;
}

const MapAddressSelector: React.FC<MapAddressSelectorProps> = ({
  onAddressSelect,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    42.8746, 74.5698,
  ]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markers = useMemo(
    () => ({
      default: L.icon({
        iconUrl: userMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      }),
      user: L.icon({
        iconUrl: defaultMarker,
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        popupAnchor: [0, -45],
      }),
      selected: L.icon({
        iconUrl: userMarker,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
      }),
    }),
    []
  );

  const getAddress = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`,
        {
          headers: {
            "User-Agent": "YourApp/1.0",
            "Accept-Language": "ru",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  };

  const RecenterAutomatically = () => {
    const map = useMap();

    useEffect(() => {
      if (userLocation && !initialSetupDone) {
        map.setView(userLocation, 17);
        setInitialSetupDone(true);
      }
    }, [map]);

    return null;
  };

  useEffect(() => {
    const fetchInitialLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (location) => {
            const userPos: [number, number] = [
              location.coords.latitude,
              location.coords.longitude,
            ];
            setUserLocation(userPos);
            setPosition(userPos);

            const address = await getAddress(userPos[0], userPos[1]);
            onAddressSelect(address);
          },
          async (error) => {
            console.error("Error getting location:", error);
            const address = await getAddress(position[0], position[1]);
            onAddressSelect(address);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    };

    fetchInitialLocation();
  }, [onAddressSelect, position]);

  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        const handleGetAddress = async () => {
          try {
            setError(null);
            const address = await getAddress(e.latlng.lat, e.latlng.lng);
            onAddressSelect(address);
          } catch (err) {
            setError(
              "Не удалось получить адрес. Пожалуйста, введите его вручную."
            );
            console.error("Error:", err);
          }
        };
        handleGetAddress();
      },
    });

    return position ? (
      <Marker position={position} icon={markers.default} />
    ) : null;
  };

  return (
    <>
      <MapContainer
        center={position}
        zoom={16}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
          marginTop: "1rem",
        }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />

        <LocationMarker />
        <RecenterAutomatically />

        {userLocation && <Marker position={userLocation} icon={markers.user} />}
      </MapContainer>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </>
  );
};

export default MapAddressSelector;
