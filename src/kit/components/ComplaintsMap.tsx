import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  HeatmapLayer,
  InfoWindow,
} from "@react-google-maps/api";
import { useAppSelector } from "../../hooks/hooks";
import {
  decodeSpecialization,
  decodeStatus,
} from "../../store/slice/complaints.slice";

const categoryColors = {
  medicine: "#FF6B6B",
  ecology: "#4ECDC4",
  police: "#45B7D1",
  transport: "#96CEB4",
  housing: "#FECA57",
  social: "#A8E6CF",
  government: "#FFB6B9",
  corruption: "#957DAD",
  education: "#E84A5F",
};

const statusColors = {
  new: "#FF6B6B",
  in_progress: "#FFA726",
  waiting: "#FFD93D",
  rejected: "#EF5350",
  completed: "#66BB6A",
};

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

interface Complaint {
  id: number;
  complaint: string;
  address: string;
  category: keyof typeof categoryColors;
  status: keyof typeof statusColors;
  seriousnessScore: number;
  createdAt: string;
  updatedAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface ComplaintWithCoords extends Complaint {
  coordinates: {
    lat: number;
    lng: number;
  };
}
const center = {
  lat: 41.7,
  lng: 74.5698,
};

const libraries: "visualization"[] = ["visualization"];

const ComplaintsMap = () => {
  const complaints = useAppSelector((state) => state.complaint.complaints);
  const [, setMap] = useState<google.maps.Map | null>(null);
  const [viewMode, setViewMode] = useState<"markers" | "heatmap">("markers");
  const [complaintsWithCoords, setComplaintsWithCoords] = useState<
    ComplaintWithCoords[]
  >([]);
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintWithCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    minScore: 4,
    showAllScores: false,
  });

  const geocodeAddress = useCallback(
    async (address: string): Promise<{ lat: number; lng: number } | null> => {
      try {
        return new Promise((resolve, reject) => {
          if (!window.google || !window.google.maps) {
            reject(new Error("Google Maps API не загружен"));
            return;
          }

          const geocoder = new window.google.maps.Geocoder();
          const searchAddress = address.includes("Кыргызстан")
            ? address
            : `${address}, Кыргызстан`;

          geocoder.geocode({ address: searchAddress }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const location = results[0].geometry.location;
              resolve({
                lat: location.lat(),
                lng: location.lng(),
              });
            } else {
              resolve(null);
            }
          });
        });
      } catch (error) {
        console.error("Ошибка геокодирования:", error);
        return null;
      }
    },
    []
  );

  const geocodeComplaints = useCallback(async () => {
    if (!window.google || !window.google.maps) {
      setError("Google Maps API не загружен");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const complaintsWithCoordinates: ComplaintWithCoords[] = [];
    const processedComplaints = new Map();

    for (let i = 0; i < complaints.length; i++) {
      const complaint = complaints[i];

      try {
        const uniqueKey = `${complaint.address}-${complaint.complaint}`;

        if (processedComplaints.has(uniqueKey)) {
          const existingComplaint = processedComplaints.get(uniqueKey);
          if (
            complaint.updatedAt &&
            existingComplaint.updatedAt &&
            new Date(complaint.updatedAt) >
              new Date(existingComplaint.updatedAt)
          ) {
            processedComplaints.set(uniqueKey, complaint);
          }
          continue;
        }

        processedComplaints.set(uniqueKey, complaint);

        const coordinates = await geocodeAddress(complaint.address);

        if (coordinates && complaint.id) {
          complaintsWithCoordinates.push({
            ...complaint,
            id: complaint.id,
            coordinates,
          } as ComplaintWithCoords);
        }

        setGeocodingProgress(Math.round(((i + 1) / complaints.length) * 100));
      } catch (err) {
        console.error(`Ошибка геокодирования для ${complaint.address}:`, err);
      }
    }

    setComplaintsWithCoords(complaintsWithCoordinates);
    setLoading(false);
  }, [complaints, geocodeAddress]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      geocodeComplaints();
    },
    [geocodeComplaints]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    return () => {
      setMap(null);
      setComplaintsWithCoords([]);
      setSelectedComplaint(null);
    };
  }, []);

  const getFilteredComplaints = useCallback(() => {
    const reverseStatusMapping = {
      новая: "new",
      "в обработке": "in_progress",
      "ожидает уточнения": "waiting",
      отклонена: "rejected",
      завершена: "completed",
    } as const;
    console.log("Current filters:", filters);
    const filtered = complaintsWithCoords.filter((complaint) => {
      const categoryMatch =
        filters.category === "all" || complaint.category === filters.category;

      const complaintStatus =
        reverseStatusMapping[
          complaint.status as keyof typeof reverseStatusMapping
        ] || complaint.status;
      const statusMatch =
        filters.status === "all" || complaintStatus === filters.status;

      const scoreMatch =
        filters.showAllScores || complaint.seriousnessScore >= filters.minScore;

      console.log("Complaint:", {
        id: complaint.id,
        status: complaint.status,
        complaintStatus,
        filterStatus: filters.status,
        statusMatch,
      });

      return categoryMatch && statusMatch && scoreMatch;
    });

    console.log("Filtered complaints:", filtered.length);
    return filtered;
  }, [complaintsWithCoords, filters]);
  useEffect(() => {
    setSelectedComplaint(null);
  }, [filters]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold mb-2">Ошибка загрузки карты</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Карта жалоб</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="all">Все категории</option>
              {Object.keys(categoryColors).map((key) => (
                <option key={key} value={key}>
                  {decodeSpecialization(key)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="all">Все статусы</option>
              {[
                { value: "new", label: "новая" },
                { value: "in_progress", label: "в обработке" },
                { value: "waiting", label: "ожидает уточнения" },
                { value: "rejected", label: "отклонена" },
                { value: "completed", label: "завершена" },
              ].map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Минимальная достоверность
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minScore}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minScore: parseInt(e.target.value),
                    showAllScores: false,
                  }))
                }
                className="flex-grow"
              />
              <span className="text-sm w-8">{filters.minScore}</span>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showAllScores}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    showAllScores: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <span className="text-sm text-gray-700">Показать все жалобы</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setViewMode("markers")}
            className={`px-4 py-2 rounded ${
              viewMode === "markers"
                ? "bg-purple text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Маркеры
          </button>
          <button
            onClick={() => setViewMode("heatmap")}
            className={`px-4 py-2 rounded ${
              viewMode === "heatmap"
                ? "bg-purple text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Тепловая карта
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Обработка адресов... {geocodingProgress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${geocodingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        loadingElement={
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-600">Загрузка Google Maps...</div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
            gestureHandling: "greedy",
            scrollwheel: true,
            zoomControl: true,
            fullscreenControl: true,
          }}
        >
          {!loading &&
            viewMode === "markers" &&
            getFilteredComplaints().map((complaint) => (
              <Marker
                key={`${complaint.id}-${complaint.status}-${complaint.updatedAt}`}
                position={complaint.coordinates}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" fill="${
                                          categoryColors[complaint.category] ||
                                          "#999"
                                        }" stroke="white" stroke-width="2"/>
                                        <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${
                                          complaint.seriousnessScore
                                        }</text>
                                    </svg>
                                `)}`,
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16),
                }}
                onClick={() => setSelectedComplaint(complaint)}
              />
            ))}

          {!loading && viewMode === "heatmap" && window.google && (
            <HeatmapLayer
              data={getFilteredComplaints().map((complaint) => ({
                location: new window.google.maps.LatLng(
                  complaint.coordinates.lat,
                  complaint.coordinates.lng
                ),
                weight: complaint.seriousnessScore / 10,
              }))}
              options={{
                radius: 20,
                opacity: 0.7,
                maxIntensity: 10,
              }}
            />
          )}

          {selectedComplaint && (
            <InfoWindow
              position={selectedComplaint.coordinates}
              onCloseClick={() => setSelectedComplaint(null)}
            >
              <div className="max-w-sm p-2">
                <h3 className="font-semibold text-lg mb-2">
                  Жалоба #{selectedComplaint.id}
                </h3>
                <p className="text-gray-700 mb-2 text-sm">
                  {selectedComplaint.complaint}
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Адрес:</strong> {selectedComplaint.address}
                  </p>
                  <p>
                    <strong>Категория:</strong>
                    <span
                      className="ml-1 px-2 py-1 rounded text-white"
                      style={{
                        backgroundColor:
                          categoryColors[selectedComplaint.category],
                      }}
                    >
                      {decodeSpecialization(selectedComplaint.category)}
                    </span>
                  </p>
                  <p>
                    <strong>Статус:</strong>
                    <span
                      className="ml-1 px-2 py-1 rounded text-white"
                      style={{
                        backgroundColor: statusColors[selectedComplaint.status],
                      }}
                    >
                      {decodeStatus(selectedComplaint.status)}
                    </span>
                  </p>
                  <p>
                    <strong>Достоверность:</strong>{" "}
                    <span
                      className={`${
                        selectedComplaint.seriousnessScore >= 4
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {selectedComplaint.seriousnessScore}/10
                      {selectedComplaint.seriousnessScore < 4 && (
                        <span className="ml-1">(сомнительная)</span>
                      )}
                    </span>
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {selectedComplaint.createdAt
                      ? new Date(
                          selectedComplaint.createdAt
                        ).toLocaleDateString("ru-RU")
                      : "Дата не указана"}
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {!loading && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Отображается жалоб:</strong>{" "}
            {getFilteredComplaints().length} из {complaintsWithCoords.length}
          </p>
          <p>
            <strong>Инструкция:</strong>
          </p>
          <ul className="list-disc list-inside mt-1">
            <li>Нажмите на маркер для просмотра деталей жалобы</li>
            <li>
              Используйте переключатель для смены между маркерами и тепловой
              картой
            </li>
            <li>Размер и цвет маркеров зависят от категории</li>
            <li>
              Число внутри маркера показывает уровень достоверности жалобы
            </li>
            <li>
              Тепловая карта показывает концентрацию жалоб с учетом их
              достоверности
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComplaintsMap;
