import {
  amenityLabels,
  deliveryZoneCoordinateSourceLabels,
  deliveryZoneSourceLabels,
  deliveryZoneVerificationLabels,
  parkAccessPointTypeLabels,
  parkScoreLabels,
  parkTagLabels,
  zoneReviewStatusLabels,
} from "../constants/parkLabels";
import { getParkRecommendationLabels } from "../lib/getParkRecommendationLabels";
import type {
  DeliveryZone,
  DeliveryZoneDetail,
  NearbyRestaurant,
  Park,
  ParkAccessPoint,
  ParkScoreKey,
  ZoneReview,
} from "../types/park";
import { DetailSection } from "./common/DetailSection";
import { ScoreMeter } from "./common/ScoreMeter";
import { TagPill } from "./common/TagPill";

type ParkBottomSheetProps = {
  park: Park | null;
  parkName?: string | null;
  parkSlug?: string | null;
  deliveryZone: DeliveryZoneDetail | null;
  selectedDeliveryZoneId: string | null;
  nearbyRestaurants: NearbyRestaurant[];
  restaurantAnchorLabel: string | null;
  isParkLoading?: boolean;
  parkError?: string | null;
  isParkNotFound?: boolean;
  isDeliveryZoneLoading?: boolean;
  deliveryZoneError?: string | null;
  isDeliveryZoneNotFound?: boolean;
  isRestaurantLoading?: boolean;
  restaurantError?: string | null;
  onSelectDeliveryZone: (deliveryZone: DeliveryZone) => void;
  onViewPark: () => void;
  onClose: () => void;
};

function getVisibleDeliveryZones(park: Park | null) {
  return park?.deliveryZones.filter(
    (deliveryZone) =>
      deliveryZone.displayPolicy === "public" && deliveryZone.verificationStatus !== "rejected",
  ) ?? [];
}

function getSourceTone(sourceType: DeliveryZone["sourceType"]) {
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
}

function getReviewTone(reviewStatus: ZoneReview["reviewStatus"]) {
  switch (reviewStatus) {
    case "approved":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "rejected":
      return "muted" as const;
    default:
      return "muted" as const;
  }
}

function formatDateTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function renderRestaurantSection(props: {
  nearbyRestaurants: NearbyRestaurant[];
  restaurantAnchorLabel: string | null;
  isRestaurantLoading: boolean;
  restaurantError: string | null;
}) {
  const { nearbyRestaurants, restaurantAnchorLabel, isRestaurantLoading, restaurantError } = props;

  return (
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
          <p>다른 배달존이나 공원 기준으로 다시 확인해보세요.</p>
        </div>
      ) : null}

      {!isRestaurantLoading && !restaurantError && nearbyRestaurants.length > 0 ? (
        <ul className="restaurant-list">
          {nearbyRestaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <a className="restaurant-card" href={restaurant.placeUrl} target="_blank" rel="noreferrer">
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
  );
}

function renderParkAccessPoint(accessPoint: ParkAccessPoint) {
  const pointTypeLabel =
    accessPoint.type in parkAccessPointTypeLabels
      ? parkAccessPointTypeLabels[accessPoint.type as keyof typeof parkAccessPointTypeLabels]
      : accessPoint.type;

  return (
    <li key={accessPoint.id}>
      <article className="detail-card">
        <div className="detail-card__header">
          <strong>{accessPoint.name}</strong>
          <TagPill label={pointTypeLabel} tone="muted" />
        </div>
        {accessPoint.note ? <p>{accessPoint.note}</p> : null}
        {accessPoint.address ? <span>{accessPoint.address}</span> : null}
        <span>
          {accessPoint.latitude.toFixed(4)}, {accessPoint.longitude.toFixed(4)}
        </span>
      </article>
    </li>
  );
}

export function ParkBottomSheet({
  park,
  parkName,
  parkSlug,
  deliveryZone,
  selectedDeliveryZoneId,
  nearbyRestaurants,
  restaurantAnchorLabel,
  isParkLoading = false,
  parkError = null,
  isParkNotFound = false,
  isDeliveryZoneLoading = false,
  deliveryZoneError = null,
  isDeliveryZoneNotFound = false,
  isRestaurantLoading = false,
  restaurantError = null,
  onSelectDeliveryZone,
  onViewPark,
  onClose,
}: ParkBottomSheetProps) {
  if (isDeliveryZoneLoading) {
    return (
      <aside className="bottom-sheet" aria-label="배달존 상세 불러오는 중">
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__title-group">
            <p className="eyebrow">Selected Delivery Zone</p>
            <h2>배달존 상세</h2>
          </div>
          <button type="button" className="bottom-sheet__close" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="bottom-sheet__status">
          <h3>배달존 상세를 불러오는 중입니다.</h3>
          <p>공식 여부와 검수 정보를 확인하고 있습니다.</p>
        </div>
      </aside>
    );
  }

  if (isDeliveryZoneNotFound || deliveryZoneError) {
    return (
      <aside className="bottom-sheet" aria-label="배달존 상세 오류">
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__title-group">
            <p className="eyebrow">Selected Delivery Zone</p>
            <h2>배달존 상세</h2>
          </div>
          <button type="button" className="bottom-sheet__close" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="bottom-sheet__status bottom-sheet__status--error" role="alert">
          <h3>{isDeliveryZoneNotFound ? "배달존을 찾을 수 없습니다." : "배달존 상세를 불러오지 못했습니다."}</h3>
          <p>{deliveryZoneError ?? "존재하지 않거나 공개되지 않은 배달존 주소입니다."}</p>
        </div>
      </aside>
    );
  }

  if (deliveryZone) {
    const reviewedAtLabel = formatDateTime(deliveryZone.lastReviewedAt);
    const zoneSummary = deliveryZone.official
      ? "서울시 공개 안내에 기반한 공식 배달 수령 지점입니다."
      : deliveryZone.sourceType === "community_verified"
        ? "여러 공개 출처가 반복 언급한 후보 지점입니다. 운영 검토가 아직 남아 있습니다."
        : "공식 공개 자료가 없어 단일 출처 기반으로 잡은 후보 지점입니다.";

    return (
      <aside className="bottom-sheet" aria-label={`${deliveryZone.name} 상세`}>
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__title-group">
            <p className="eyebrow">Selected Delivery Zone</p>
            <h2>{deliveryZone.name}</h2>
          </div>
          <button type="button" className="bottom-sheet__close" onClick={onClose}>
            닫기
          </button>
        </div>

        <div className="bottom-sheet__hero">
          <div className="tag-row">
            <TagPill
              label={deliveryZone.official ? "공식 지점" : "후보 지점"}
              tone={deliveryZone.official ? "success" : "warning"}
            />
            <TagPill
              label={deliveryZoneSourceLabels[deliveryZone.sourceType]}
              tone={getSourceTone(deliveryZone.sourceType)}
            />
            <TagPill
              label={deliveryZoneVerificationLabels[deliveryZone.verificationStatus]}
              tone={deliveryZone.official ? "success" : "muted"}
            />
          </div>
          <p className="bottom-sheet__description">{zoneSummary}</p>
          <div className="detail-metrics">
            <div className="detail-metrics__item">
              <span>신뢰도</span>
              <strong>{deliveryZone.confidenceScore}/100</strong>
            </div>
            <div className="detail-metrics__item">
              <span>최근 검토</span>
              <strong>{reviewedAtLabel ?? "검토 기록 없음"}</strong>
            </div>
          </div>
        </div>

        <DetailSection
          title="소속 공원"
          action={
            parkSlug ? (
              <button type="button" className="detail-action" onClick={onViewPark}>
                공원 상세 보기
              </button>
            ) : null
          }
        >
          <div className="detail-card">
            <div className="detail-card__header">
              <strong>{deliveryZone.parkName}</strong>
              <TagPill label={deliveryZone.official ? "공식 안내 연결" : "후보 지점 연결"} tone="muted" />
            </div>
            <p>{deliveryZone.description}</p>
          </div>
        </DetailSection>

        <DetailSection title="지점 정보">
          <div className="detail-card">
            <div className="detail-card__header">
              <strong>{deliveryZone.name}</strong>
              <TagPill label={deliveryZoneCoordinateSourceLabels[deliveryZone.coordinateSource]} tone="muted" />
            </div>
            <p>{deliveryZone.description}</p>
            <span>{deliveryZone.address ?? "도로명 주소 미공개"}</span>
            <span>
              좌표 {deliveryZone.latitude.toFixed(4)}, {deliveryZone.longitude.toFixed(4)}
            </span>
            <span>출처 확인일 {deliveryZone.sourceCheckedAt}</span>
          </div>
        </DetailSection>

        <DetailSection title="근거 자료">
          <ul className="detail-card-list">
            {deliveryZone.evidences.map((evidence) => (
              <li key={evidence.id}>
                <article className="detail-card">
                  <div className="detail-card__header">
                    <strong>{evidence.sourceLabel}</strong>
                    <div className="tag-row">
                      {evidence.primary ? <TagPill label="주요 근거" tone="accent" /> : null}
                      <TagPill label={`${evidence.evidenceScore}/100`} tone="muted" />
                    </div>
                  </div>
                  {evidence.sourceExcerpt ? <p>{evidence.sourceExcerpt}</p> : null}
                  <div className="detail-card__meta">
                    <span>확인일 {evidence.checkedAt}</span>
                    <a href={evidence.sourceUrl} target="_blank" rel="noreferrer">
                      출처 보기
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="검수 이력">
          <ul className="detail-card-list">
            {deliveryZone.reviews.map((review) => (
              <li key={review.id}>
                <article className="detail-card">
                  <div className="detail-card__header">
                    <strong>{review.reviewedBy}</strong>
                    <TagPill label={zoneReviewStatusLabels[review.reviewStatus]} tone={getReviewTone(review.reviewStatus)} />
                  </div>
                  {review.reviewNote ? <p>{review.reviewNote}</p> : null}
                  <div className="detail-card__meta">
                    <span>{formatDateTime(review.reviewedAt) ?? review.reviewedAt}</span>
                    <span>
                      결과 신뢰도 {review.resultConfidenceScore !== null ? `${review.resultConfidenceScore}/100` : "미기록"}
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </DetailSection>

        {renderRestaurantSection({
          nearbyRestaurants,
          restaurantAnchorLabel,
          isRestaurantLoading,
          restaurantError,
        })}
      </aside>
    );
  }

  if (isParkLoading) {
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
          <p>공원 설명과 배달존, 접근 포인트를 준비하고 있습니다.</p>
        </div>
      </aside>
    );
  }

  if (isParkNotFound || parkError) {
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
          <h3>{isParkNotFound ? "공원을 찾을 수 없습니다." : "상세 정보를 불러오지 못했습니다."}</h3>
          <p>{parkError ?? "존재하지 않는 공원 주소입니다."}</p>
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
  const publicDeliveryZones = getVisibleDeliveryZones(park);

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
        <div className="tag-row">
          <TagPill label={parkTagLabels[park.primaryTag]} tone="accent" />
          {recommendationLabels.map((label) => (
            <TagPill key={label} label={label} tone="muted" />
          ))}
        </div>
        <p className="bottom-sheet__description">{park.recommendation}</p>
      </div>

      <DetailSection title="공원 설명">
        <p className="section-copy">{park.description}</p>
        <p className="recommendation">{park.recommendation}</p>
      </DetailSection>

      <DetailSection title="접근 포인트">
        {park.accessPoints.length > 0 ? (
          <ul className="detail-card-list">
            {park.accessPoints.map(renderParkAccessPoint)}
          </ul>
        ) : (
          <div className="bottom-sheet__status">
            <h3>등록된 접근 포인트가 없습니다.</h3>
            <p>추가 데이터 정리 전까지는 공원 설명과 배달존 정보를 우선 확인해 주세요.</p>
          </div>
        )}
      </DetailSection>

      <DetailSection title="배달존">
        <ul className="delivery-zone-list">
          {publicDeliveryZones.map((deliveryZoneItem) => {
            const isSelected = deliveryZoneItem.id === selectedDeliveryZoneId;

            return (
              <li key={deliveryZoneItem.id}>
                <article className={`delivery-zone-card ${isSelected ? "delivery-zone-card--selected" : ""}`}>
                  <button
                    type="button"
                    className="delivery-zone-card__select"
                    onClick={() => onSelectDeliveryZone(deliveryZoneItem)}
                  >
                    <div className="delivery-zone-card__badges">
                      <TagPill
                        label={deliveryZoneItem.sourceType === "official" ? "공식 지점" : "후보 지점"}
                        tone={deliveryZoneItem.sourceType === "official" ? "success" : "warning"}
                      />
                      <TagPill
                        label={deliveryZoneSourceLabels[deliveryZoneItem.sourceType]}
                        tone={getSourceTone(deliveryZoneItem.sourceType)}
                      />
                      <TagPill
                        label={deliveryZoneVerificationLabels[deliveryZoneItem.verificationStatus]}
                        tone="muted"
                      />
                    </div>
                    <strong>{deliveryZoneItem.name}</strong>
                    <p>{deliveryZoneItem.description}</p>
                    <span>{deliveryZoneItem.address ?? "도로명 주소 미공개"}</span>
                    <span>
                      {deliveryZoneCoordinateSourceLabels[deliveryZoneItem.coordinateSource]} ·{" "}
                      {deliveryZoneItem.latitude.toFixed(4)}, {deliveryZoneItem.longitude.toFixed(4)}
                    </span>
                  </button>
                  <div className="delivery-zone-card__meta">
                    <span>{deliveryZoneItem.sourceLabel}</span>
                    <a href={deliveryZoneItem.sourceUrl} target="_blank" rel="noreferrer">
                      출처 보기
                    </a>
                    <span>확인일 {deliveryZoneItem.sourceCheckedAt}</span>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </DetailSection>

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

      {renderRestaurantSection({
        nearbyRestaurants,
        restaurantAnchorLabel,
        isRestaurantLoading,
        restaurantError,
      })}
    </aside>
  );
}
