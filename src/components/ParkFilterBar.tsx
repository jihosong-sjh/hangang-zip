import { useEffect, useState } from "react";
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
  const tags = Object.keys(parkTagLabels) as ParkTag[];
  const [isHiddenOnMobile, setIsHiddenOnMobile] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (!isMobile) {
        setIsHiddenOnMobile(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY < 24) {
        setIsHiddenOnMobile(false);
        lastScrollY = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY;

      if (delta > 8) {
        setIsHiddenOnMobile(true);
      } else if (delta < -8) {
        setIsHiddenOnMobile(false);
      }

      lastScrollY = currentScrollY;
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsHiddenOnMobile(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      className={`filter-bar ${isHiddenOnMobile ? "filter-bar--hidden" : ""}`}
      aria-label="공원 필터"
    >
      <div className="filter-bar__mobile">
        <label className="filter-bar__select-wrap">
          <span className="filter-bar__select-label">활동 필터</span>
          <select
            className="filter-bar__select"
            value={selectedTag ?? ""}
            onChange={(event) => {
              const value = event.target.value as ParkTag | "";
              if (value === "") {
                onReset();
                return;
              }
              onSelectTag(value);
            }}
            aria-label="활동 필터 선택"
          >
            <option value="">전체 활동</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {parkTagLabels[tag]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="filter-bar__reset-icon"
          onClick={onReset}
          aria-label="필터 초기화"
          title="필터 초기화"
          disabled={!selectedTag}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.2 5.8A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.76-4.24L13 11h7V4z" />
          </svg>
        </button>
      </div>

      <div className="filter-bar__desktop">
        <div className="filter-bar__chips">
          {tags.map((tag) => {
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
      </div>
    </section>
  );
}
