import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ParkBottomSheet } from "../components/ParkBottomSheet";
import { ParkFilterBar } from "../components/ParkFilterBar";
import { ParkMap } from "../components/ParkMap";
import { filterParks } from "../lib/filterParks";
import { ApiRequestError, getDeliveryZone, getPark, getParkDataSource, getParks } from "../lib/parkApi";
import { searchNearbyRestaurants } from "../lib/searchNearbyRestaurants";
import type { DeliveryZone, DeliveryZoneDetail, NearbyRestaurant, Park, ParkTag } from "../types/park";

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

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function MapPage() {
  const navigate = useNavigate();
  const { parkSlug, zoneId } = useParams<{ parkSlug?: string; zoneId?: string }>();
  const [selectedTag, setSelectedTag] = useState<ParkTag | null>(null);
  const [allParks, setAllParks] = useState<Park[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParkDetail, setSelectedParkDetail] = useState<Park | null>(null);
  const [isParkDetailLoading, setIsParkDetailLoading] = useState(false);
  const [parkDetailError, setParkDetailError] = useState<string | null>(null);
  const [isParkNotFound, setIsParkNotFound] = useState(false);
  const [selectedDeliveryZoneDetail, setSelectedDeliveryZoneDetail] = useState<DeliveryZoneDetail | null>(
    null,
  );
  const [isDeliveryZoneLoading, setIsDeliveryZoneLoading] = useState(false);
  const [deliveryZoneError, setDeliveryZoneError] = useState<string | null>(null);
  const [isDeliveryZoneNotFound, setIsDeliveryZoneNotFound] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyRestaurant[]>([]);
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);
  const hasBootstrappedRouteRef = useRef(false);
  const dataSource = getParkDataSource();

  const visibleParks = useMemo(() => filterParks(allParks, selectedTag), [allParks, selectedTag]);

  const selectedParkSummary = useMemo(() => {
    if (selectedDeliveryZoneDetail) {
      return allParks.find((park) => park.id === selectedDeliveryZoneDetail.parkId) ?? null;
    }

    if (parkSlug) {
      return allParks.find((park) => park.slug === parkSlug) ?? null;
    }

    return null;
  }, [allParks, parkSlug, selectedDeliveryZoneDetail]);

  const selectedParkId = selectedDeliveryZoneDetail?.parkId ?? selectedParkSummary?.id ?? null;

  const selectedParkDetailMatch = useMemo(
    () => (selectedParkDetail?.id === selectedParkId ? selectedParkDetail : null),
    [selectedParkDetail, selectedParkId],
  );

  const selectedPark = selectedParkDetailMatch ?? selectedParkSummary;
  const selectedDeliveryZoneId = zoneId ?? null;

  const selectedDeliveryZoneSummary = useMemo(() => {
    if (selectedDeliveryZoneDetail?.id === selectedDeliveryZoneId) {
      return selectedDeliveryZoneDetail;
    }

    if (!selectedDeliveryZoneId || !selectedPark) {
      return null;
    }

    return getVisibleDeliveryZones(selectedPark).find((deliveryZone) => deliveryZone.id === selectedDeliveryZoneId) ?? null;
  }, [selectedDeliveryZoneDetail, selectedDeliveryZoneId, selectedPark]);

  const parks = useMemo(() => {
    if (!selectedPark || visibleParks.some((park) => park.id === selectedPark.id)) {
      return visibleParks;
    }

    return [selectedPark, ...visibleParks];
  }, [selectedPark, visibleParks]);

  const activeSearchAnchor = useMemo<SearchAnchor | null>(() => {
    if (selectedDeliveryZoneSummary) {
      return {
        id: selectedDeliveryZoneSummary.id,
        label: selectedDeliveryZoneSummary.name,
        latitude: selectedDeliveryZoneSummary.latitude,
        longitude: selectedDeliveryZoneSummary.longitude,
      };
    }

    if (!selectedPark) {
      return null;
    }

    return {
      id: selectedPark.id,
      label: selectedPark.name,
      latitude: selectedPark.latitude,
      longitude: selectedPark.longitude,
    };
  }, [selectedDeliveryZoneSummary, selectedPark]);

  const isParkSlugNotFound =
    Boolean(parkSlug) && !zoneId && !isLoading && !error && selectedParkSummary === null;

  useEffect(() => {
    if (parkSlug || zoneId) {
      hasBootstrappedRouteRef.current = true;
    }
  }, [parkSlug, zoneId]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getParks(null, controller.signal)
      .then((items) => {
        setAllParks(items);
      })
      .catch((fetchError: unknown) => {
        if (isAbortError(fetchError)) {
          return;
        }

        setAllParks([]);
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
  }, []);

  useEffect(() => {
    if (
      hasBootstrappedRouteRef.current ||
      isLoading ||
      error ||
      parkSlug ||
      zoneId ||
      allParks.length === 0
    ) {
      return;
    }

    hasBootstrappedRouteRef.current = true;
    navigate(`/parks/${allParks[0].slug}`, { replace: true });
  }, [allParks, error, isLoading, navigate, parkSlug, zoneId]);

  useEffect(() => {
    if (!selectedParkId) {
      setSelectedParkDetail(null);
      setIsParkDetailLoading(false);
      setParkDetailError(null);
      setIsParkNotFound(false);
      return;
    }

    const controller = new AbortController();

    setSelectedParkDetail(null);
    setIsParkDetailLoading(true);
    setParkDetailError(null);
    setIsParkNotFound(false);

    getPark(selectedParkId, controller.signal)
      .then((park) => {
        setSelectedParkDetail(park);
      })
      .catch((fetchError: unknown) => {
        if (isAbortError(fetchError)) {
          return;
        }

        setSelectedParkDetail(null);
        setIsParkNotFound(fetchError instanceof ApiRequestError && fetchError.status === 404);
        setParkDetailError(
          fetchError instanceof Error
            ? fetchError.message
            : "공원 상세를 불러오는 중 오류가 발생했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsParkDetailLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedParkId]);

  useEffect(() => {
    if (!zoneId) {
      setSelectedDeliveryZoneDetail(null);
      setIsDeliveryZoneLoading(false);
      setDeliveryZoneError(null);
      setIsDeliveryZoneNotFound(false);
      return;
    }

    const controller = new AbortController();

    setSelectedDeliveryZoneDetail(null);
    setIsDeliveryZoneLoading(true);
    setDeliveryZoneError(null);
    setIsDeliveryZoneNotFound(false);

    getDeliveryZone(zoneId, controller.signal)
      .then((deliveryZone) => {
        setSelectedDeliveryZoneDetail(deliveryZone);
      })
      .catch((fetchError: unknown) => {
        if (isAbortError(fetchError)) {
          return;
        }

        setSelectedDeliveryZoneDetail(null);
        setIsDeliveryZoneNotFound(fetchError instanceof ApiRequestError && fetchError.status === 404);
        setDeliveryZoneError(
          fetchError instanceof Error
            ? fetchError.message
            : "배달존 상세를 불러오는 중 오류가 발생했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsDeliveryZoneLoading(false);
        }
      });

    return () => controller.abort();
  }, [zoneId]);

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
    navigate(`/parks/${park.slug}`);
  };

  const handleSelectDeliveryZone = (deliveryZone: DeliveryZone) => {
    if (selectedDeliveryZoneId === deliveryZone.id) {
      if (selectedPark?.slug) {
        navigate(`/parks/${selectedPark.slug}`);
      }
      return;
    }

    navigate(`/delivery-zones/${deliveryZone.id}`);
  };

  const handleViewPark = () => {
    if (selectedPark?.slug) {
      navigate(`/parks/${selectedPark.slug}`);
    }
  };

  const handleCloseSheet = () => {
    navigate("/");
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
          parkName={selectedParkSummary?.name ?? selectedDeliveryZoneDetail?.parkName ?? null}
          parkSlug={selectedPark?.slug ?? null}
          deliveryZone={selectedDeliveryZoneDetail}
          selectedDeliveryZoneId={selectedDeliveryZoneId}
          nearbyRestaurants={nearbyRestaurants}
          restaurantAnchorLabel={activeSearchAnchor?.label ?? null}
          isParkLoading={Boolean(selectedParkId) && isParkDetailLoading}
          parkError={parkDetailError}
          isParkNotFound={isParkSlugNotFound || isParkNotFound}
          isDeliveryZoneLoading={Boolean(zoneId) && isDeliveryZoneLoading}
          deliveryZoneError={deliveryZoneError}
          isDeliveryZoneNotFound={isDeliveryZoneNotFound}
          isRestaurantLoading={isRestaurantLoading}
          restaurantError={restaurantError}
          onSelectDeliveryZone={handleSelectDeliveryZone}
          onViewPark={handleViewPark}
          onClose={handleCloseSheet}
        />
      ) : null}
    </main>
  );
}
