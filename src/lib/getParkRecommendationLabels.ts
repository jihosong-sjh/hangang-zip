import type { Park, ParkScoreKey } from "../types/park";

export type ParkRecommendationLabel =
  | "러닝하기 좋은 공원"
  | "피크닉하기 좋은 공원"
  | "조용히 쉬기 좋은 공원"
  | "야경 보기 좋은 공원"
  | "가족과 가기 좋은 공원"
  | "가볍게 들르기 좋은 한강공원";

const scorePriority: ParkScoreKey[] = ["running", "picnic", "quiet", "night", "family"];

const recommendationMessages: Record<ParkScoreKey, ParkRecommendationLabel> = {
  running: "러닝하기 좋은 공원",
  picnic: "피크닉하기 좋은 공원",
  quiet: "조용히 쉬기 좋은 공원",
  night: "야경 보기 좋은 공원",
  family: "가족과 가기 좋은 공원",
};

const MIN_RECOMMENDED_SCORE = 4;
const FALLBACK_LABEL: ParkRecommendationLabel = "가볍게 들르기 좋은 한강공원";

type RecommendationCandidate = {
  key: ParkScoreKey;
  score: number;
  priority: number;
  isPrimary: boolean;
};

export function getParkRecommendationLabels(park: Park): ParkRecommendationLabel[] {
  const candidates = scorePriority
    .map<RecommendationCandidate>((key, index) => ({
      key,
      score: park.scores[key],
      priority: index,
      isPrimary: key === park.primaryTag,
    }))
    .filter((candidate) => candidate.score >= MIN_RECOMMENDED_SCORE)
    .sort((left, right) => {
      if (left.isPrimary !== right.isPrimary) {
        return left.isPrimary ? -1 : 1;
      }

      if (left.score !== right.score) {
        return right.score - left.score;
      }

      return left.priority - right.priority;
    });

  const labels = candidates
    .slice(0, 2)
    .map((candidate) => recommendationMessages[candidate.key]);

  return labels.length > 0 ? labels : [FALLBACK_LABEL];
}
