import type { NearbyRestaurant } from "../types/park";
import { loadKakaoMaps } from "./loadKakaoMaps";

function getPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const DEFAULT_RADIUS = getPositiveNumber(import.meta.env.VITE_KAKAO_RESTAURANT_RADIUS, 1200);
const DEFAULT_LIMIT = getPositiveNumber(import.meta.env.VITE_KAKAO_RESTAURANT_LIMIT, 12);

type SearchNearbyRestaurantsParams = {
  latitude: number;
  longitude: number;
  radius?: number;
  size?: number;
};

type KakaoPlaceResult = {
  id: string;
  place_name: string;
  x: string;
  y: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
  distance: string;
  phone: string;
  place_url: string;
};

function normalizeRestaurant(place: KakaoPlaceResult): NearbyRestaurant {
  return {
    id: place.id,
    name: place.place_name,
    latitude: Number(place.y),
    longitude: Number(place.x),
    address: place.road_address_name || place.address_name,
    categoryName: place.category_name,
    distance: Number(place.distance),
    phone: place.phone || null,
    placeUrl: place.place_url,
  };
}

export async function searchNearbyRestaurants({
  latitude,
  longitude,
  radius = DEFAULT_RADIUS,
  size = DEFAULT_LIMIT,
}: SearchNearbyRestaurantsParams): Promise<NearbyRestaurant[]> {
  const kakao = await loadKakaoMaps();

  return new Promise((resolve, reject) => {
    const placesService = new kakao.maps.services.Places();

    placesService.categorySearch(
      "FD6",
      (data: KakaoPlaceResult[], status: string) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve(data.slice(0, size).map(normalizeRestaurant));
          return;
        }

        if (status === kakao.maps.services.Status.ZERO_RESULT) {
          resolve([]);
          return;
        }

        reject(new Error("근처 맛집을 불러오지 못했습니다."));
      },
      {
        x: longitude,
        y: latitude,
        radius,
        size,
        sort: kakao.maps.services.SortBy.DISTANCE,
      },
    );
  });
}
