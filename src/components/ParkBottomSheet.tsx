import { amenityLabels, parkScoreLabels, parkTagLabels } from "../constants/parkLabels";
import { getParkRecommendationLabels } from "../lib/getParkRecommendationLabels";
import type { Park, ParkScoreKey } from "../types/park";
import { DetailSection } from "./common/DetailSection";
import { ScoreMeter } from "./common/ScoreMeter";
import { TagPill } from "./common/TagPill";

type ParkBottomSheetProps = {
  park: Park | null;
  parkName?: string | null;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
};

export function ParkBottomSheet({
  park,
  parkName,
  isLoading = false,
  error = null,
  onClose,
}: ParkBottomSheetProps) {
  if (isLoading) {
    return (
      <aside className="bottom-sheet" aria-label="공원 상세 불러오는 중">
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <div>
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
          <div>
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

  return (
    <aside className="bottom-sheet" aria-label={`${park.name} 상세`}>
      <div className="bottom-sheet__handle" />
      <div className="bottom-sheet__header">
        <div>
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
