import type {
  AmenityType,
  DeliveryZoneCoordinateSource,
  DeliveryZoneSourceType,
  DeliveryZoneVerificationStatus,
  ParkScoreKey,
  ParkTag,
} from "../types/park";

export const parkTagLabels: Record<ParkTag, string> = {
  running: "러닝",
  picnic: "피크닉",
  quiet: "조용함",
  night: "야경",
  family: "가족",
};

export const parkScoreLabels: Record<ParkScoreKey, string> = {
  running: "러닝",
  picnic: "피크닉",
  quiet: "조용함",
  night: "야경",
  family: "가족",
};

export const amenityLabels: Record<AmenityType, string> = {
  parking: "주차장",
  restroom: "화장실",
  convenience_store: "편의점",
  cafe: "카페",
  rental_bike: "자전거 대여",
  sports_facility: "운동 시설",
  playground: "놀이 공간",
};

export const deliveryZoneSourceLabels: Record<DeliveryZoneSourceType, string> = {
  official: "공식 확인",
  community_verified: "교차 검증",
  unverified: "미확정 후보",
};

export const deliveryZoneVerificationLabels: Record<DeliveryZoneVerificationStatus, string> = {
  verified: "검증 완료",
  needs_review: "검토 필요",
  rejected: "제외됨",
};

export const deliveryZoneCoordinateSourceLabels: Record<DeliveryZoneCoordinateSource, string> = {
  official: "공식 좌표",
  geocoded: "지오코딩 좌표",
  manual: "수동 좌표",
};
