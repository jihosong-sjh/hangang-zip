import type { ParkTag } from "../types/park";
import { parkTagLabels } from "../constants/parkLabels";

type ParkFilterBarProps = {
  selectedTag: ParkTag | null;
  onSelectTag: (tag: ParkTag) => void;
  onReset: () => void;
};

export function ParkFilterBar({
  selectedTag,
  onSelectTag,
  onReset,
}: ParkFilterBarProps) {
  return (
    <section className="filter-bar" aria-label="공원 필터">
      <div className="filter-bar__chips">
        {(Object.keys(parkTagLabels) as ParkTag[]).map((tag) => {
          const active = selectedTag === tag;

          return (
            <button
              key={tag}
              type="button"
              className={`chip ${active ? "chip--active" : ""}`}
              onClick={() => onSelectTag(tag)}
              aria-pressed={active}
            >
              {parkTagLabels[tag]}
            </button>
          );
        })}
      </div>
      <button type="button" className="filter-bar__reset" onClick={onReset}>
        초기화
      </button>
    </section>
  );
}
