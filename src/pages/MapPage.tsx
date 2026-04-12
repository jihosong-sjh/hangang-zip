import { useEffect, useMemo, useState } from "react";
import { ParkBottomSheet } from "../components/ParkBottomSheet";
import { ParkFilterBar } from "../components/ParkFilterBar";
import { ParkMap } from "../components/ParkMap";
import { getPark, getParkDataSource, getParks } from "../lib/parkApi";
import type { Park, ParkTag } from "../types/park";

export function MapPage() {
  const [selectedTag, setSelectedTag] = useState<ParkTag | null>(null);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [parks, setParks] = useState<Park[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParkDetail, setSelectedParkDetail] = useState<Park | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const dataSource = getParkDataSource();

  const selectedParkSummary = useMemo(
    () => parks.find((park) => park.id === selectedParkId) ?? null,
    [parks, selectedParkId],
  );

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getParks(selectedTag, controller.signal)
      .then((items) => {
        setParks(items);
        setSelectedParkId((current) => {
          if (current && items.some((park) => park.id === current)) {
            return current;
          }

          return items[0]?.id ?? null;
        });
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setParks([]);
        setSelectedParkId(null);
        setSelectedParkDetail(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "공원 데이터를 불러오는 중 오류가 발생했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedTag]);

  useEffect(() => {
    if (selectedParkId && !parks.some((park) => park.id === selectedParkId)) {
      setSelectedParkId(null);
    }
  }, [parks, selectedParkId]);

  useEffect(() => {
    if (!selectedParkId) {
      setSelectedParkDetail(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return;
    }

    const controller = new AbortController();

    setIsDetailLoading(true);
    setDetailError(null);

    getPark(selectedParkId, controller.signal)
      .then((park) => {
        setSelectedParkDetail(park);
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setSelectedParkDetail(null);
        setDetailError(
          fetchError instanceof Error
            ? fetchError.message
            : "공원 상세를 불러오는 중 오류가 발생했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsDetailLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedParkId]);

  const handleSelectTag = (tag: ParkTag) => {
    setSelectedTag((current) => (current === tag ? null : tag));
  };

  const resetFilters = () => {
    setSelectedTag(null);
  };

  const handleSelectPark = (park: Park) => {
    setSelectedParkId(park.id);
  };

  const handleCloseSheet = () => {
    setSelectedParkId(null);
  };

  return (
    <main className="page-shell">
      <header className="page-shell__header">
        <p className="eyebrow">Hangang ZIP MVP</p>
        <h1>한강공원 탐색 앱</h1>
        <p className="page-shell__intro">
          {dataSource === "mock"
            ? "mock 데이터를 기반으로 한강공원 11개 위치를 지도에서 확인하고, 마커를 눌러 상세 정보를 볼 수 있습니다."
            : "백엔드 API 데이터를 기반으로 한강공원 위치를 지도에서 확인하고, 마커를 눌러 상세 정보를 볼 수 있습니다."}
        </p>
        <p className="page-shell__status">
          데이터 소스: <strong>{dataSource === "mock" ? "Mock" : "API"}</strong>
        </p>
      </header>

      <ParkFilterBar
        selectedTag={selectedTag}
        onSelectTag={handleSelectTag}
        onReset={resetFilters}
      />

      {error ? (
        <section className="error-state" role="alert">
          <h2>데이터를 불러오지 못했습니다.</h2>
          <p>{error}</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="loading-state" aria-live="polite">
          <h2>공원 데이터를 불러오는 중입니다.</h2>
          <p>잠시만 기다려주세요.</p>
        </section>
      ) : (
        <ParkMap parks={parks} selectedParkId={selectedParkId} onSelectPark={handleSelectPark} />
      )}

      {!isLoading && !error && parks.length === 0 ? (
        <section className="empty-state">
          <h2>조건에 맞는 공원이 없습니다.</h2>
          <p>필터를 일부 해제하고 다시 확인해보세요.</p>
        </section>
      ) : null}

      {!isLoading && !error ? (
        <ParkBottomSheet
          park={selectedParkDetail}
          parkName={selectedParkSummary?.name ?? null}
          isLoading={isDetailLoading}
          error={detailError}
          onClose={handleCloseSheet}
        />
      ) : null}
    </main>
  );
}
