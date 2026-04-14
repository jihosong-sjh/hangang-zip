import { useEffect, useMemo, useState } from "react";
import { ParkBottomSheet } from "../components/ParkBottomSheet";
import { ParkFilterBar } from "../components/ParkFilterBar";
import { ParkMap } from "../components/ParkMap";
import { searchNearbyRestaurants } from "../lib/searchNearbyRestaurants";
import { getPark, getParkDataSource, getParks } from "../lib/parkApi";
import type { DeliveryZone, NearbyRestaurant, Park, ParkTag } from "../types/park";

type SearchAnchor = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

function getVisibleDeliveryZones(park: Park | null) {
  return park?.deliveryZones.filter(
    (deliveryZone) =>
      deliveryZone.displayPolicy === "public" && deliveryZone.verificationStatus !== "rejected",
  ) ?? [];
}

export function MapPage() {
  const [selectedTag, setSelectedTag] = useState<ParkTag | null>(null);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [selectedDeliveryZoneId, setSelectedDeliveryZoneId] = useState<string | null>(null);
  const [parks, setParks] = useState<Park[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParkDetail, setSelectedParkDetail] = useState<Park | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyRestaurant[]>([]);
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);
  const dataSource = getParkDataSource();

  const selectedParkSummary = useMemo(
    () => parks.find((park) => park.id === selectedParkId) ?? null,
    [parks, selectedParkId],
  );

  const selectedParkDetailMatch = useMemo(
    () => (selectedParkDetail?.id === selectedParkId ? selectedParkDetail : null),
    [selectedParkDetail, selectedParkId],
  );

  const selectedPark = selectedParkDetailMatch ?? selectedParkSummary;

  const activeSearchAnchor = useMemo<SearchAnchor | null>(() => {
    if (selectedDeliveryZoneId && selectedPark) {
      const deliveryZone = getVisibleDeliveryZones(selectedPark).find(
        (zone) => zone.id === selectedDeliveryZoneId,
      );

      if (deliveryZone) {
        return {
          id: deliveryZone.id,
          label: `${deliveryZone.name}`,
          latitude: deliveryZone.latitude,
          longitude: deliveryZone.longitude,
        };
      }
    }

    if (!selectedParkSummary) {
      return null;
    }

    return {
      id: selectedParkSummary.id,
      label: `${selectedParkSummary.name}`,
      latitude: selectedParkSummary.latitude,
      longitude: selectedParkSummary.longitude,
    };
  }, [selectedDeliveryZoneId, selectedPark, selectedParkSummary]);

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
        setSelectedDeliveryZoneId(null);
        setSelectedParkDetail(null);
        setNearbyRestaurants([]);
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
    setSelectedDeliveryZoneId(null);
  }, [selectedParkId]);

  useEffect(() => {
    if (!selectedParkId) {
      setSelectedParkDetail(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return;
    }

    const controller = new AbortController();

    setSelectedParkDetail(null);
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

  useEffect(() => {
    let isCancelled = false;

    if (!activeSearchAnchor) {
      setNearbyRestaurants([]);
      setRestaurantError(null);
      setIsRestaurantLoading(false);
      return;
    }

    setIsRestaurantLoading(true);
    setRestaurantError(null);

    searchNearbyRestaurants({
      latitude: activeSearchAnchor.latitude,
      longitude: activeSearchAnchor.longitude,
    })
      .then((restaurants) => {
        if (!isCancelled) {
          setNearbyRestaurants(restaurants);
        }
      })
      .catch((fetchError: unknown) => {
        if (isCancelled) {
          return;
        }

        setNearbyRestaurants([]);
        setRestaurantError(
          fetchError instanceof Error
            ? fetchError.message
            : "근처 맛집을 불러오는 중 오류가 발생했습니다.",
        );
      })
      .finally(() => {
        if (!isCancelled) {
          setIsRestaurantLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSearchAnchor]);

  const handleSelectTag = (tag: ParkTag) => {
    setSelectedTag((current) => (current === tag ? null : tag));
  };

  const resetFilters = () => {
    setSelectedTag(null);
  };

  const handleSelectPark = (park: Park) => {
    setSelectedParkId(park.id);
  };

  const handleSelectDeliveryZone = (deliveryZone: DeliveryZone) => {
    setSelectedDeliveryZoneId((current) => (current === deliveryZone.id ? null : deliveryZone.id));
  };

  const handleCloseSheet = () => {
    setSelectedParkId(null);
    setSelectedDeliveryZoneId(null);
  };

  return (
    <main className="page-shell">
      <header className="page-shell__header">
        <p className="eyebrow">Hangang ZIP MVP</p>
        <h1>한강공원 배달존 지도</h1>
        <p className="page-shell__intro">
          {dataSource === "mock"
            ? "mock 데이터를 기반으로 공식 배달존과 검토 중인 배달 후보를 함께 보여줍니다."
            : "백엔드 API 데이터를 기반으로 공식 배달존과 검토 중인 배달 후보를 함께 보여줍니다."}
        </p>
        {/* <p className="page-shell__status">
          데이터 소스: <strong>{dataSource === "mock" ? "Mock" : "API"}</strong>
        </p> */}
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
        <ParkMap
          parks={parks}
          selectedParkId={selectedParkId}
          selectedPark={selectedPark}
          selectedDeliveryZoneId={selectedDeliveryZoneId}
          nearbyRestaurants={nearbyRestaurants}
          onSelectPark={handleSelectPark}
          onSelectDeliveryZone={handleSelectDeliveryZone}
        />
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
          selectedDeliveryZoneId={selectedDeliveryZoneId}
          nearbyRestaurants={nearbyRestaurants}
          restaurantAnchorLabel={activeSearchAnchor?.label ?? null}
          isLoading={isDetailLoading}
          error={detailError}
          isRestaurantLoading={isRestaurantLoading}
          restaurantError={restaurantError}
          onSelectDeliveryZone={handleSelectDeliveryZone}
          onClose={handleCloseSheet}
        />
      ) : null}
    </main>
  );
}
