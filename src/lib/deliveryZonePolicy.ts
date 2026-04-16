import { deliveryZoneDisplayPolicyLabels } from "../constants/parkLabels";
import type {
  DeliveryZoneDisplayPolicy,
  DeliveryZoneVerificationStatus,
  Park,
} from "../types/park";

type VisibleDeliveryZoneLike = {
  displayPolicy: DeliveryZoneDisplayPolicy;
  verificationStatus: DeliveryZoneVerificationStatus;
};

type ScoredDeliveryZoneLike = VisibleDeliveryZoneLike & {
  confidenceScore: number;
};

export const LOW_CONFIDENCE_SCORE_THRESHOLD = 70;

export function isDeliveryZoneVisible<T extends VisibleDeliveryZoneLike>(deliveryZone: T) {
  return (
    deliveryZone.displayPolicy !== "ops_only" &&
    deliveryZone.verificationStatus !== "rejected"
  );
}

export function getVisibleDeliveryZones(park: Park | null) {
  return park?.deliveryZones.filter(isDeliveryZoneVisible) ?? [];
}

export function isDeliveryZoneLowConfidence<T extends ScoredDeliveryZoneLike>(deliveryZone: T) {
  return (
    deliveryZone.displayPolicy === "limited" ||
    deliveryZone.confidenceScore < LOW_CONFIDENCE_SCORE_THRESHOLD
  );
}

export function getDeliveryZoneDisplayPolicyLabel(displayPolicy: DeliveryZoneDisplayPolicy) {
  return deliveryZoneDisplayPolicyLabels[displayPolicy];
}

export function getDeliveryZoneDisplayPolicyTone(displayPolicy: DeliveryZoneDisplayPolicy) {
  switch (displayPolicy) {
    case "public":
      return "success" as const;
    case "limited":
      return "warning" as const;
    case "ops_only":
      return "muted" as const;
    default:
      return "muted" as const;
  }
}

export function getDeliveryZoneWarningMessage<T extends ScoredDeliveryZoneLike>(deliveryZone: T) {
  if (!isDeliveryZoneLowConfidence(deliveryZone)) {
    return null;
  }

  if (deliveryZone.displayPolicy === "limited") {
    return "주의: 운영 검토가 끝나지 않은 공개 후보 지점입니다. 실제 수령 위치와 다를 수 있어 출처와 좌표를 다시 확인해 주세요.";
  }

  return "주의: 신뢰도가 낮은 데이터입니다. 실제 수령 위치와 다를 수 있어 출처와 좌표를 다시 확인해 주세요.";
}
