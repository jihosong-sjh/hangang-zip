package com.hangangzip.park.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DeliveryZoneRestaurantsResponse(
    String zoneId,
    boolean stale,
    LocalDateTime cachedAt,
    List<NearbyRestaurantResponse> items,
    int count
) {

    public DeliveryZoneRestaurantsResponse {
        items = List.copyOf(items);
    }

    public DeliveryZoneRestaurantsResponse(
        String zoneId,
        boolean stale,
        LocalDateTime cachedAt,
        List<NearbyRestaurantResponse> items
    ) {
        this(zoneId, stale, cachedAt, items, items.size());
    }
}
