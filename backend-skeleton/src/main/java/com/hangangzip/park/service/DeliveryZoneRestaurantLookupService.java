package com.hangangzip.park.service;

import com.hangangzip.park.config.KakaoLocalProperties;
import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.dto.DeliveryZoneRestaurantsResponse;
import com.hangangzip.park.dto.NearbyRestaurantResponse;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DeliveryZoneRestaurantLookupService {

    private final DeliveryZoneRestaurantProvider deliveryZoneRestaurantProvider;
    private final DeliveryZoneRestaurantCache deliveryZoneRestaurantCache;
    private final KakaoLocalProperties kakaoLocalProperties;
    private final Clock clock;

    public DeliveryZoneRestaurantLookupService(
        DeliveryZoneRestaurantProvider deliveryZoneRestaurantProvider,
        DeliveryZoneRestaurantCache deliveryZoneRestaurantCache,
        KakaoLocalProperties kakaoLocalProperties,
        Clock clock
    ) {
        this.deliveryZoneRestaurantProvider = deliveryZoneRestaurantProvider;
        this.deliveryZoneRestaurantCache = deliveryZoneRestaurantCache;
        this.kakaoLocalProperties = kakaoLocalProperties;
        this.clock = clock;
    }

    public DeliveryZoneRestaurantsResponse getRestaurants(DeliveryZoneEntity deliveryZone) {
        LocalDateTime now = LocalDateTime.now(clock);
        DeliveryZoneRestaurantCache.CacheEntry cached = deliveryZoneRestaurantCache.get(deliveryZone.getId());

        if (cached != null && isFresh(cached, now)) {
            return toResponse(deliveryZone.getId(), cached, false);
        }

        try {
            List<NearbyRestaurantResponse> restaurants = deliveryZoneRestaurantProvider.searchNearbyRestaurants(deliveryZone);
            DeliveryZoneRestaurantCache.CacheEntry updated = deliveryZoneRestaurantCache.put(
                deliveryZone.getId(),
                restaurants,
                now
            );
            return toResponse(deliveryZone.getId(), updated, false);
        } catch (RestaurantProviderUnavailableException exception) {
            if (cached != null && canServeStale(cached, now)) {
                return toResponse(deliveryZone.getId(), cached, true);
            }
            throw exception;
        }
    }

    private DeliveryZoneRestaurantsResponse toResponse(
        String zoneId,
        DeliveryZoneRestaurantCache.CacheEntry cacheEntry,
        boolean stale
    ) {
        return new DeliveryZoneRestaurantsResponse(
            zoneId,
            stale,
            cacheEntry.cachedAt(),
            cacheEntry.restaurants()
        );
    }

    private boolean isFresh(DeliveryZoneRestaurantCache.CacheEntry cacheEntry, LocalDateTime now) {
        return !cacheEntry.cachedAt()
            .plus(cacheEntry.isEmpty() ? kakaoLocalProperties.getEmptyTtl() : kakaoLocalProperties.getSuccessTtl())
            .isBefore(now);
    }

    private boolean canServeStale(DeliveryZoneRestaurantCache.CacheEntry cacheEntry, LocalDateTime now) {
        return !cacheEntry.cachedAt().plus(kakaoLocalProperties.getStaleTtl()).isBefore(now);
    }
}
