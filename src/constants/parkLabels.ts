import type { AmenityType, ParkScoreKey, ParkTag } from "../types/park";

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
