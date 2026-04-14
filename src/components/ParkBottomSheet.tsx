import {
  amenityLabels,
  deliveryZoneCoordinateSourceLabels,
  deliveryZoneSourceLabels,
  deliveryZoneVerificationLabels,
  parkScoreLabels,
  parkTagLabels,
} from "../constants/parkLabels";
import { getParkRecommendationLabels } from "../lib/getParkRecommendationLabels";
import type { DeliveryZone, NearbyRestaurant, Park, ParkScoreKey } from "../types/park";
import { DetailSection } from "./common/DetailSection";
import { ScoreMeter } from "./common/ScoreMeter";
import { TagPill } from "./common/TagPill";

type ParkBottomSheetProps = {
  park: Park | null;
  parkName?: string | null;
  selectedDeliveryZoneId: string | null;
  nearbyRestaurants: NearbyRestaurant[];
  restaurantAnchorLabel: string | null;
  isLoading?: boolean;
  error?: string | null;
  isRestaurantLoading?: boolean;
  restaurantError?: string | null;
  onSelectDeliveryZone: (deliveryZone: DeliveryZone) => void;
  onClose: () => void;
};

export function ParkBottomSheet({
  park,
  parkName,
  selectedDeliveryZoneId,
  nearbyRestaurants,
  restaurantAnchorLabel,
  isLoading = false,
  error = null,
  isRestaurantLoading = false,
  restaurantError = null,
  onSelectDeliveryZone,
  onClose,
}: ParkBottomSheetProps) {
  if (isLoading) {
    return (
      <aside className="bottom-sheet" aria-label="공원 상세 불러오는 중">
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__title-group">
            <p className="eyebrow">Selected Park</p>
            <h2>{parkName ?? "공원 상세"}</h2>
          </div>
          <button type="button" className="bottom-sheet__close" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="bottom-sheet__status">
          <h3>상세 정보를 불러오는 중입니다.</h3>
          <p>잠시만 기다려주세요.</p>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="bottom-sheet" aria-label="공원 상세 오류">
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__title-group">
            <p className="eyebrow">Selected Park</p>
            <h2>{parkName ?? "공원 상세"}</h2>
          </div>
          <button type="button" className="bottom-sheet__close" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="bottom-sheet__status bottom-sheet__status--error" role="alert">
          <h3>상세 정보를 불러오지 못했습니다.</h3>
          <p>{error}</p>
        </div>
      </aside>
    );
  }

  if (!park) {
    return (
      <aside className="bottom-sheet bottom-sheet--empty" aria-label="공원 상세">
        <div className="bottom-sheet__handle" />
        <p>공원을 선택하면 상세 정보가 여기에 표시됩니다.</p>
      </aside>
    );
  }

  const recommendationLabels = getParkRecommendationLabels(park);
  const publicDeliveryZones = park.deliveryZones.filter(
    (deliveryZone) =>
      deliveryZone.displayPolicy === "public" && deliveryZone.verificationStatus !== "rejected",
  );

  const getSourceTone = (sourceType: DeliveryZone["sourceType"]) => {
    switch (sourceType) {
      case "official":
        return "success" as const;
      case "community_verified":
        return "warning" as const;
      case "unverified":
        return "warning" as const;
      default:
        return "accent" as const;
    }
  };

  return (
    <aside className="bottom-sheet" aria-label={`${park.name} 상세`}>
      <div className="bottom-sheet__handle" />
      <div className="bottom-sheet__header">
        <div className="bottom-sheet__title-group">
          <p className="eyebrow">Selected Park</p>
          <h2>{park.name}</h2>
        </div>
        <button type="button" className="bottom-sheet__close" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="bottom-sheet__hero">
        <TagPill label={parkTagLabels[park.primaryTag]} tone="accent" />
        <p className="bottom-sheet__description">{park.description}</p>
      </div>

      <DetailSection title="대표 태그">
        <div className="tag-row">
          {park.tags.map((tag) => (
            <TagPill key={tag} label={parkTagLabels[tag]} />
          ))}
        </div>
      </DetailSection>

      <DetailSection title="활동 점수">
        <ul className="score-list">
          {(Object.keys(parkScoreLabels) as ParkScoreKey[]).map((key) => (
            <ScoreMeter key={key} label={parkScoreLabels[key]} score={park.scores[key]} />
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="편의시설">
        <div className="tag-row">
          {park.amenities.map((amenity) => (
            <TagPill key={amenity} label={amenityLabels[amenity]} tone="muted" />
          ))}
        </div>
      </DetailSection>

      <DetailSection title="배달존">
        <ul className="delivery-zone-list">
          {publicDeliveryZones.map((deliveryZone) => {
            const isSelected = deliveryZone.id === selectedDeliveryZoneId;

            return (
              <li key={deliveryZone.id}>
                <article
                  className={`delivery-zone-card ${isSelected ? "delivery-zone-card--selected" : ""}`}
                >
                  <button
                    type="button"
                    className="delivery-zone-card__select"
                    onClick={() => onSelectDeliveryZone(deliveryZone)}
                  >
                    <div className="delivery-zone-card__badges">
                      <TagPill
                        label={deliveryZoneSourceLabels[deliveryZone.sourceType]}
                        tone={getSourceTone(deliveryZone.sourceType)}
                      />
                      <TagPill
                        label={deliveryZoneVerificationLabels[deliveryZone.verificationStatus]}
                        tone="muted"
                      />
                    </div>
                    <strong>{deliveryZone.name}</strong>
                    <p>{deliveryZone.description}</p>
                    <span>
                      {deliveryZone.address ?? "도로명 주소 미공개"}
                    </span>
                    <span>
                      {deliveryZoneCoordinateSourceLabels[deliveryZone.coordinateSource]} ·{" "}
                      {deliveryZone.latitude.toFixed(4)}, {deliveryZone.longitude.toFixed(4)}
                    </span>
                  </button>
                  <div className="delivery-zone-card__meta">
                    <span>{deliveryZone.sourceLabel}</span>
                    <a href={deliveryZone.sourceUrl} target="_blank" rel="noreferrer">
                      출처 보기
                    </a>
                    <span>확인일 {deliveryZone.sourceCheckedAt}</span>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </DetailSection>

      <DetailSection title="근처 맛집">
        {restaurantAnchorLabel ? (
          <p className="section-caption">
            {restaurantAnchorLabel} 기준 거리순 결과입니다. 실제 배달 가능 여부를 보장하지는 않습니다.
          </p>
        ) : null}

        {isRestaurantLoading ? (
          <div className="bottom-sheet__status">
            <h3>근처 맛집을 찾는 중입니다.</h3>
            <p>카카오맵 장소 데이터를 조회하고 있습니다.</p>
          </div>
        ) : null}

        {!isRestaurantLoading && restaurantError ? (
          <div className="bottom-sheet__status bottom-sheet__status--error" role="alert">
            <h3>근처 맛집을 불러오지 못했습니다.</h3>
            <p>{restaurantError}</p>
          </div>
        ) : null}

        {!isRestaurantLoading && !restaurantError && nearbyRestaurants.length === 0 ? (
          <div className="bottom-sheet__status">
            <h3>검색된 맛집이 없습니다.</h3>
            <p>다른 배달존을 선택하거나 지도의 레이어를 다시 켜서 확인해보세요.</p>
          </div>
        ) : null}

        {!isRestaurantLoading && !restaurantError && nearbyRestaurants.length > 0 ? (
          <ul className="restaurant-list">
            {nearbyRestaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <a
                  className="restaurant-card"
                  href={restaurant.placeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="restaurant-card__top">
                    <strong>{restaurant.name}</strong>
                    <span>{Math.round(restaurant.distance)}m</span>
                  </div>
                  <p>{restaurant.categoryName}</p>
                  <p>{restaurant.address}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </DetailSection>

      <DetailSection title="추천 문구">
        <div className="tag-row">
          {recommendationLabels.map((label) => (
            <TagPill key={label} label={label} tone="accent" />
          ))}
        </div>
        <p className="recommendation">{park.recommendation}</p>
      </DetailSection>
    </aside>
  );
}
