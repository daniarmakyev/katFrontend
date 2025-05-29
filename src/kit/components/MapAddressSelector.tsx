import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import defaultMarker from "../assets/deafoult-marker.svg";
import userMarker from "../assets/user-marker.svg";

interface MapAddressSelectorProps {
  onAddressSelect: (address: string) => void;
}

const MapAddressSelector: React.FC<MapAddressSelectorProps> = ({
  onAddressSelect,
}) => {
  const [position, setPosition] = useState({
    lat: 42.8746,
    lng: 74.5698,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [markers, setMarkers] = useState<
    {
      default: {
        url: string;
        scaledSize: google.maps.Size;
        anchor: google.maps.Point;
      };
      user: {
        url: string;
        scaledSize: google.maps.Size;
        anchor: google.maps.Point;
      };
    } | null
  >(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestTime = useRef<number>(0);
  const addressCache = useRef<Map<string, string>>(new Map());

  const MIN_REQUEST_INTERVAL = 1100;
  const DEBOUNCE_DELAY = 200;

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
        setMarkers({
      default: {
        url: userMarker,
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 40),
      },
      user: {
        url: defaultMarker,
        scaledSize: new window.google.maps.Size(45, 45),
        anchor: new window.google.maps.Point(22, 45),
      },
    });
  }, []);

  const getCacheKey = (lat: number, lng: number) => {
    const roundedLat = Math.round(lat * 1000) / 1000;
    const roundedLng = Math.round(lng * 1000) / 1000;
    return `${roundedLat},${roundedLng}`;
  };

  const getAddress = useCallback(async (lat: number, lng: number) => {
    const cacheKey = getCacheKey(lat, lng);
    
    if (addressCache.current.has(cacheKey)) {
      return addressCache.current.get(cacheKey)!;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    lastRequestTime.current = Date.now();

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<string>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK" && results?.[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject(new Error("Не удалось получить адрес"));
            }
          }
        );
      });

      addressCache.current.set(cacheKey, result);
      
      if (addressCache.current.size > 50) {
        const firstKey = addressCache.current.keys().next().value;
        if (typeof firstKey === 'string') {
          addressCache.current.delete(firstKey);
        }
      }

      return result;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  }, []);

  const debouncedGetAddress = useCallback(
    (lat: number, lng: number) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setIsLoadingAddress(true);
      setError(null);

      debounceTimer.current = setTimeout(async () => {
        try {
          const address = await getAddress(lat, lng);
          onAddressSelect(address);
          setError(null);
        } catch (err) {
          setError("Не удалось получить адрес. Пожалуйста, введите его вручную.");
          console.error("Error:", err);
          onAddressSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } finally {
          setIsLoadingAddress(false);
        }
      }, DEBOUNCE_DELAY);
    },
    [onAddressSelect, getAddress]
  );

  useEffect(() => {
    const fetchInitialLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (location) => {
            const userPos = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            };
            setUserLocation(userPos);
            if (!initialSetupDone) {
              setPosition(userPos);
              setInitialSetupDone(true);
              if (mapRef.current) {
                mapRef.current.panTo(userPos);
                mapRef.current.setZoom(17);
              }
              debouncedGetAddress(userPos.lat, userPos.lng);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            debouncedGetAddress(position.lat, position.lng);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000,
          }
        );
      }
    };

    fetchInitialLocation();

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [debouncedGetAddress, position, initialSetupDone]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPosition(newPos);
      const geocoder = new google.maps.Geocoder();
      setIsLoadingAddress(true);
      
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          onAddressSelect(address); 
        } else {
          onAddressSelect(`${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`);
        }
        setIsLoadingAddress(false);
      });
    }
  }, [onAddressSelect]);

  return (
    <>
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={{
            height: "400px",
            width: "100%",
            borderRadius: "12px",
            marginTop: "1rem",
          }}
          center={position}
          zoom={16}
          onClick={onMapClick}
          onLoad={onLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {markers && (
            <>
              <Marker position={position} icon={markers.default} />
              {userLocation && <Marker position={userLocation} icon={markers.user} />}
            </>
          )}
        </GoogleMap>
      </LoadScript>

      {isLoadingAddress && (
        <div className="text-blue-500 text-sm mt-4 flex items-center">
          <svg className="animate-spin ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Получение адреса...
        </div>
      )}
      
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </>
  );
};

export default MapAddressSelector;
