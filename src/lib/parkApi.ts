import { parks as mockParks } from "../data/parks";
import type { DeliveryZoneDetail, Park, ParkTag } from "../types/park";

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

type ApiErrorPayload = {
  code?: string;
  message?: string;
};

export class ApiRequestError extends Error {
  status: number;
  code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

async function parseErrorResponse(response: Response, fallbackMessage: string) {
  let payload: ApiErrorPayload | null = null;

  try {
    payload = (await response.json()) as ApiErrorPayload;
  } catch {
    payload = null;
  }

  return new ApiRequestError(
    payload?.message ?? `${fallbackMessage} (${response.status})`,
    response.status,
    payload?.code ?? null,
  );
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
    throw await parseErrorResponse(response, "공원 목록을 불러오지 못했습니다.");
  }

  const payload = (await response.json()) as { items: Park[] };
  return payload.items;
}

export async function getPark(id: string, signal?: AbortSignal): Promise<Park> {
  if (parkDataSource === "mock") {
    const park = mockParks.find((item) => item.id === id);

    if (!park) {
      throw new ApiRequestError(`공원 상세를 찾을 수 없습니다. (${id})`, 404, "PARK_NOT_FOUND");
    }

    return Promise.resolve(park);
  }

  const response = await fetch(`${apiBaseUrl}/api/parks/${id}`, { signal });

  if (!response.ok) {
    throw await parseErrorResponse(response, "공원 상세를 불러오지 못했습니다.");
  }

  return (await response.json()) as Park;
}

function buildMockZoneDetail(zoneId: string): DeliveryZoneDetail {
  const park = mockParks.find((item) => item.deliveryZones.some((zone) => zone.id === zoneId));
  const zone = park?.deliveryZones.find((item) => item.id === zoneId);

  if (!park || !zone) {
    throw new ApiRequestError(`배달존 상세를 찾을 수 없습니다. (${zoneId})`, 404, "ZONE_NOT_FOUND");
  }

  const evidenceScore =
    zone.sourceType === "official" ? 95 : zone.sourceType === "community_verified" ? 75 : 45;
  const reviewStatus = zone.verificationStatus === "verified" ? "approved" : "pending";

  return {
    ...zone,
    parkId: park.id,
    parkName: park.name,
    confidenceScore: evidenceScore,
    official: zone.sourceType === "official",
    lastReviewedAt: `${zone.sourceCheckedAt}T00:00:00`,
    evidences: [
      {
        id: 1,
        sourceType: zone.sourceType,
        sourceLabel: zone.sourceLabel,
        sourceUrl: zone.sourceUrl,
        sourceExcerpt: zone.description,
        checkedAt: zone.sourceCheckedAt,
        evidenceScore,
        primary: true,
      },
    ],
    reviews: [
      {
        id: 1,
        reviewStatus,
        reviewNote:
          zone.sourceType === "official"
            ? "공식 안내 페이지 기준으로 확인된 지점"
            : "공개 출처 기반 후보 지점으로 운영 검토가 필요함",
        reviewedBy: zone.sourceType === "official" ? "ops_seed" : "community_seed",
        reviewedAt: `${zone.sourceCheckedAt}T00:00:00`,
        resultConfidenceScore: evidenceScore,
      },
    ],
  };
}

export async function getDeliveryZone(
  zoneId: string,
  signal?: AbortSignal,
): Promise<DeliveryZoneDetail> {
  if (parkDataSource === "mock") {
    return Promise.resolve(buildMockZoneDetail(zoneId));
  }

  const response = await fetch(`${apiBaseUrl}/api/delivery-zones/${zoneId}`, { signal });

  if (!response.ok) {
    throw await parseErrorResponse(response, "배달존 상세를 불러오지 못했습니다.");
  }

  return (await response.json()) as DeliveryZoneDetail;
}
