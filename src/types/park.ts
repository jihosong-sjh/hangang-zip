export type ParkTag =
  | "running"
  | "picnic"
  | "quiet"
  | "night"
  | "family";

export type MapLayer = "parks" | "deliveryZones" | "restaurants";

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

export type DeliveryZone = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
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
};
