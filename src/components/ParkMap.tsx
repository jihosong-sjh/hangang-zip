import { useEffect, useRef, useState } from "react";
import { parkTagLabels } from "../constants/parkLabels";
import { loadKakaoMaps, type KakaoMapsSdk } from "../lib/loadKakaoMaps";
import type { DeliveryZone, MapLayer, NearbyRestaurant, Park } from "../types/park";

type ParkMapProps = {
  parks: Park[];
  selectedParkId: string | null;
  selectedPark: Park | null;
  selectedDeliveryZoneId: string | null;
  nearbyRestaurants: NearbyRestaurant[];
  visibleLayers: Record<MapLayer, boolean>;
  onSelectPark: (park: Park) => void;
  onSelectDeliveryZone: (deliveryZone: DeliveryZone) => void;
  onToggleLayer: (layer: MapLayer) => void;
};

const defaultCenter = { latitude: 37.5287, longitude: 126.98 };

const layerLabels: Record<MapLayer, string> = {
  parks: "공원",
  deliveryZones: "배달존",
  restaurants: "맛집",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createMarkerImage(kakao: KakaoMapsSdk, fillColor: string, size: number, strokeColor = "#f7fbf8") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${(size - 6) / 2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3" />
    </svg>
  `;

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    new kakao.maps.Size(size, size),
    {
      offset: new kakao.maps.Point(size / 2, size / 2),
    },
  );
}

function buildRestaurantOverlay(restaurant: NearbyRestaurant) {
  const title = escapeHtml(restaurant.name);
  const category = escapeHtml(restaurant.categoryName);
  const address = escapeHtml(restaurant.address);
  const phone = restaurant.phone ? escapeHtml(restaurant.phone) : "전화번호 없음";

  return `
    <section class="map-info-card">
      <strong>${title}</strong>
      <span>${Math.round(restaurant.distance)}m · ${category}</span>
      <p>${address}</p>
      <p>${phone}</p>
      <a href="${restaurant.placeUrl}" target="_blank" rel="noreferrer">카카오맵에서 보기</a>
    </section>
  `;
}

export function ParkMap({
  parks,
  selectedParkId,
  selectedPark,
  selectedDeliveryZoneId,
  nearbyRestaurants,
  visibleLayers,
  onSelectPark,
  onSelectDeliveryZone,
  onToggleLayer,
}: ParkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const kakaoRef = useRef<KakaoMapsSdk | null>(null);
  const infoWindowRef = useRef<any>(null);
  const renderedObjectsRef = useRef<any[]>([]);
  const selectParkRef = useRef(onSelectPark);
  const selectDeliveryZoneRef = useRef(onSelectDeliveryZone);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mapError, setMapError] = useState<string | null>(null);

  const selectedDeliveryZone =
    selectedPark?.deliveryZones.find((zone) => zone.id === selectedDeliveryZoneId) ?? null;

  useEffect(() => {
    selectParkRef.current = onSelectPark;
  }, [onSelectPark]);

  useEffect(() => {
    selectDeliveryZoneRef.current = onSelectDeliveryZone;
  }, [onSelectDeliveryZone]);

  useEffect(() => {
    let isCancelled = false;

    loadKakaoMaps()
      .then((kakao) => {
        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        kakaoRef.current = kakao;
        mapRef.current = new kakao.maps.Map(mapContainerRef.current, {
          center: new kakao.maps.LatLng(defaultCenter.latitude, defaultCenter.longitude),
          level: 8,
        });
        infoWindowRef.current = new kakao.maps.InfoWindow({
          removable: true,
          zIndex: 5,
        });
        setMapStatus("ready");
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setMapStatus("error");
        setMapError(
          error instanceof Error ? error.message : "카카오맵을 불러오는 중 오류가 발생했습니다.",
        );
      });

    return () => {
      isCancelled = true;
      renderedObjectsRef.current.forEach((object) => object.setMap?.(null));
      renderedObjectsRef.current = [];
      infoWindowRef.current?.close?.();
      infoWindowRef.current = null;
      mapRef.current = null;
      kakaoRef.current = null;
    };
  }, []);

  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;

    if (!kakao || !map) {
      return;
    }

    renderedObjectsRef.current.forEach((object) => object.setMap?.(null));
    renderedObjectsRef.current = [];
    infoWindowRef.current?.close?.();

    const bounds = new kakao.maps.LatLngBounds();
    let hasBounds = false;

    const addBoundsPoint = (latitude: number, longitude: number) => {
      bounds.extend(new kakao.maps.LatLng(latitude, longitude));
      hasBounds = true;
    };

    if (!selectedPark && parks.length > 0) {
      parks.forEach((park) => {
        addBoundsPoint(park.latitude, park.longitude);
      });
    }

    if (visibleLayers.parks) {
      parks.forEach((park) => {
        const isSelected = park.id === selectedParkId;
        const marker = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(park.latitude, park.longitude),
          title: park.name,
          image: createMarkerImage(kakao, isSelected ? "#d96c2f" : "#2d6a4f", 24),
          zIndex: isSelected ? 3 : 1,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          selectParkRef.current(park);
        });

        renderedObjectsRef.current.push(marker);

        if (isSelected) {
          const overlay = new kakao.maps.CustomOverlay({
            map,
            position: new kakao.maps.LatLng(park.latitude, park.longitude),
            yAnchor: 1.9,
            content: `<div class="map-badge map-badge--park">${escapeHtml(park.name)}</div>`,
          });
          renderedObjectsRef.current.push(overlay);
        }
      });
    }

    if (selectedPark) {
      addBoundsPoint(selectedPark.latitude, selectedPark.longitude);
    }

    if (visibleLayers.deliveryZones && selectedPark) {
      selectedPark.deliveryZones.forEach((deliveryZone) => {
        const isSelected = deliveryZone.id === selectedDeliveryZoneId;
        const marker = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(deliveryZone.latitude, deliveryZone.longitude),
          title: deliveryZone.name,
          image: createMarkerImage(kakao, isSelected ? "#a33b17" : "#f08b49", 20),
          zIndex: isSelected ? 4 : 2,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          selectDeliveryZoneRef.current(deliveryZone);
        });

        renderedObjectsRef.current.push(marker);
        addBoundsPoint(deliveryZone.latitude, deliveryZone.longitude);

        if (isSelected) {
          const overlay = new kakao.maps.CustomOverlay({
            map,
            position: new kakao.maps.LatLng(deliveryZone.latitude, deliveryZone.longitude),
            yAnchor: 1.8,
            content: `<div class="map-badge map-badge--delivery">${escapeHtml(deliveryZone.name)}</div>`,
          });
          renderedObjectsRef.current.push(overlay);
        }
      });
    }

    if (visibleLayers.restaurants) {
      nearbyRestaurants.forEach((restaurant) => {
        const marker = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude),
          title: restaurant.name,
          image: createMarkerImage(kakao, "#2459a6", 16),
          zIndex: 1,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          infoWindowRef.current?.setContent(buildRestaurantOverlay(restaurant));
          infoWindowRef.current?.open(map, marker);
        });

        renderedObjectsRef.current.push(marker);
        addBoundsPoint(restaurant.latitude, restaurant.longitude);
      });
    }

    if (!selectedPark) {
      if (hasBounds) {
        map.setBounds(bounds, 60, 40, 60, 40);
      }
      return;
    }

    if (visibleLayers.restaurants && nearbyRestaurants.length > 0 && hasBounds) {
      map.setBounds(bounds, 80, 50, 80, 50);
      return;
    }

    const focusLatitude = selectedDeliveryZone?.latitude ?? selectedPark.latitude;
    const focusLongitude = selectedDeliveryZone?.longitude ?? selectedPark.longitude;

    map.setLevel(selectedDeliveryZone ? 5 : 6);
    map.panTo(new kakao.maps.LatLng(focusLatitude, focusLongitude));
  }, [
    nearbyRestaurants,
    parks,
    selectedDeliveryZone,
    selectedDeliveryZoneId,
    selectedPark,
    selectedParkId,
    visibleLayers,
  ]);

  return (
    <section className="park-map" aria-label="한강공원 지도">
      <div className="park-map__header">
        <div className="park-map__title-group">
          <p className="eyebrow">Hangang Map</p>
          <h1>한강공원 배달존과 근처 맛집</h1>
        </div>
        <p className="park-map__summary">
          공원을 선택하면 배달존과 주변 음식점을 카카오맵 기준으로 함께 탐색할 수 있습니다.
        </p>
      </div>

      <div className="park-map__controls" role="group" aria-label="지도 레이어">
        {(Object.keys(layerLabels) as MapLayer[]).map((layer) => (
          <button
            key={layer}
            type="button"
            className={`chip ${visibleLayers[layer] ? "chip--active" : ""}`}
            onClick={() => onToggleLayer(layer)}
            aria-pressed={visibleLayers[layer]}
          >
            {layerLabels[layer]}
          </button>
        ))}
      </div>

      <div className="park-map__canvas">
        <div ref={mapContainerRef} className="park-map__map" aria-label="카카오맵" />

        {mapStatus === "loading" ? (
          <div className="park-map__status" aria-live="polite">
            <h2>지도를 불러오는 중입니다.</h2>
            <p>카카오맵 SDK와 장소 데이터를 준비하고 있습니다.</p>
          </div>
        ) : null}

        {mapStatus === "error" ? (
          <div className="park-map__status park-map__status--error" role="alert">
            <h2>지도를 불러오지 못했습니다.</h2>
            <p>{mapError}</p>
          </div>
        ) : null}
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
                  <span className="park-card__tag">{parkTagLabels[park.primaryTag]}</span>
                </div>
                <p className="park-card__description">{park.description}</p>
                <div className="park-card__meta">
                  <span>배달존 {park.deliveryZones.length}곳</span>
                  <span>맛집은 선택 시 실시간 조회</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
