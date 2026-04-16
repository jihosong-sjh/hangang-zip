export type ParkTag =
  | "running"
  | "picnic"
  | "quiet"
  | "night"
  | "family";

export type AmenityType =
  | "parking"
  | "restroom"
  | "convenience_store"
  | "cafe"
  | "rental_bike"
  | "sports_facility"
  | "playground";

export type ParkScoreKey = "running" | "picnic" | "quiet" | "night" | "family";

export type ParkScores = Record<ParkScoreKey, number>;

export type ParkAccessPointType = "entrance" | "station" | "parking" | "plaza";

export type DeliveryZoneSourceType = "official" | "community_verified" | "unverified";

export type DeliveryZoneVerificationStatus = "verified" | "needs_review" | "rejected";

export type DeliveryZoneCoordinateSource = "official" | "geocoded" | "manual";

export type DeliveryZoneDisplayPolicy = "public" | "limited" | "ops_only";

export type DeliveryZoneEvidenceSourceType =
  | "official"
  | "community_verified"
  | "unverified";

export type ZoneReviewStatus = "approved" | "pending" | "rejected";

export type ParkAccessPoint = {
  id: number;
  type: ParkAccessPointType | string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  note: string | null;
};

export type DeliveryZone = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  address: string | null;
  sourceType: DeliveryZoneSourceType;
  verificationStatus: DeliveryZoneVerificationStatus;
  sourceLabel: string;
  sourceUrl: string;
  sourceCheckedAt: string;
  coordinateSource: DeliveryZoneCoordinateSource;
  displayPolicy: DeliveryZoneDisplayPolicy;
  confidenceScore: number;
};

export type DeliveryZoneEvidence = {
  id: number;
  sourceType: DeliveryZoneEvidenceSourceType;
  sourceLabel: string;
  sourceUrl: string;
  sourceExcerpt: string | null;
  checkedAt: string;
  evidenceScore: number;
  primary: boolean;
};

export type ZoneReview = {
  id: number;
  reviewStatus: ZoneReviewStatus;
  reviewNote: string | null;
  reviewedBy: string;
  reviewedAt: string;
  resultConfidenceScore: number | null;
};

export type DeliveryZoneDetail = DeliveryZone & {
  parkId: string;
  parkName: string;
  official: boolean;
  lastReviewedAt: string | null;
  evidences: DeliveryZoneEvidence[];
  reviews: ZoneReview[];
};

export type NearbyRestaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  categoryName: string;
  distance: number;
  phone: string | null;
  placeUrl: string;
};

export type Park = {
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  primaryTag: ParkTag;
  tags: ParkTag[];
  description: string;
  scores: ParkScores;
  amenities: AmenityType[];
  recommendation: string;
  deliveryZones: DeliveryZone[];
  accessPoints: ParkAccessPoint[];
};
