import { parks as mockParks } from "../data/parks";
import type { Park, ParkTag } from "../types/park";

type ParkDataSource = "mock" | "api";

const envDataSource = import.meta.env.VITE_PARK_DATA_SOURCE;
const parkDataSource = ((envDataSource ?? (import.meta.env.DEV ? "mock" : "api")) as ParkDataSource);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8081" : undefined);

if (import.meta.env.PROD) {
  if (parkDataSource !== "api") {
    throw new Error("운영 환경에서는 VITE_PARK_DATA_SOURCE=api 가 필요합니다.");
  }

  if (!apiBaseUrl) {
    throw new Error("운영 환경에서는 VITE_API_BASE_URL 이 필요합니다.");
  }
}

export function getParkDataSource(): ParkDataSource {
  return parkDataSource;
}

export async function getParks(
  selectedTag: ParkTag | null,
  signal?: AbortSignal,
): Promise<Park[]> {
  if (parkDataSource === "mock") {
    return Promise.resolve(selectedTag ? mockParks.filter((park) => park.primaryTag === selectedTag) : mockParks);
  }

  const params = new URLSearchParams();

  if (selectedTag) {
    params.set("tag", selectedTag);
  }

  const query = params.toString();
  const response = await fetch(`${apiBaseUrl}/api/parks${query ? `?${query}` : ""}`, { signal });

  if (!response.ok) {
    throw new Error(`공원 목록을 불러오지 못했습니다. (${response.status})`);
  }

  const payload = (await response.json()) as { items: Park[] };
  return payload.items;
}

export async function getPark(id: string, signal?: AbortSignal): Promise<Park> {
  if (parkDataSource === "mock") {
    const park = mockParks.find((item) => item.id === id);

    if (!park) {
      throw new Error(`공원 상세를 찾을 수 없습니다. (${id})`);
    }

    return Promise.resolve(park);
  }

  const response = await fetch(`${apiBaseUrl}/api/parks/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`공원 상세를 불러오지 못했습니다. (${response.status})`);
  }

  return (await response.json()) as Park;
}
