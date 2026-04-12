import { useEffect } from "react";
import { divIcon, type LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Park } from "../types/park";

type ParkMapProps = {
  parks: Park[];
  selectedParkId: string | null;
  onSelectPark: (park: Park) => void;
};

const defaultCenter: LatLngExpression = [37.5287, 126.98];

function createMarkerIcon(selected: boolean) {
  return divIcon({
    className: "",
    html: `<span class="map-marker ${selected ? "map-marker--selected" : ""}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function MapViewport({ selectedPark }: { selectedPark: Park | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedPark) {
      return;
    }

    map.flyTo([selectedPark.latitude, selectedPark.longitude], 13, {
      duration: 0.4,
    });
  }, [map, selectedPark]);

  return null;
}

export function ParkMap({ parks, selectedParkId, onSelectPark }: ParkMapProps) {
  const selectedPark = parks.find((park) => park.id === selectedParkId) ?? null;

  return (
    <section className="park-map" aria-label="한강공원 지도">
      <div className="park-map__header">
        <div className="park-map__title-group">
          <p className="eyebrow">Hangang Map</p>
          <h1>한강공원 11곳</h1>
        </div>
        <p className="park-map__summary">
          마커를 눌러 공원을 선택하면 상세 바텀시트가 열립니다.
        </p>
      </div>

      <div className="park-map__canvas">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom
          className="park-map__leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewport selectedPark={selectedPark} />
          {parks.map((park) => {
            const isSelected = park.id === selectedParkId;

            return (
              <Marker
                key={park.id}
                position={[park.latitude, park.longitude]}
                icon={createMarkerIcon(isSelected)}
                eventHandlers={{
                  click: () => onSelectPark(park),
                }}
              >
                <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                  {park.name}
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <ul className="park-map__list" aria-label="공원 목록 요약">
        {parks.map((park) => {
          const isSelected = park.id === selectedParkId;

          return (
            <li key={park.id}>
              <button
                type="button"
                className={`park-card ${isSelected ? "park-card--selected" : ""}`}
                onClick={() => onSelectPark(park)}
              >
                <div className="park-card__top">
                  <strong className="park-card__name">{park.name}</strong>
                  <span className="park-card__tag">{park.primaryTag}</span>
                </div>
                <p className="park-card__description">{park.description}</p>
                <div className="park-card__meta">
                  <span>위도 {park.latitude.toFixed(4)}</span>
                  <span>경도 {park.longitude.toFixed(4)}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
