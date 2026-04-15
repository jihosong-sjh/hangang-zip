package com.hangangzip.park.service;

import com.hangangzip.park.dto.NearbyRestaurantResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class DeliveryZoneRestaurantCache {

    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public CacheEntry get(String zoneId) {
        return cache.get(zoneId);
    }

    public CacheEntry put(String zoneId, List<NearbyRestaurantResponse> restaurants, LocalDateTime cachedAt) {
        CacheEntry entry = new CacheEntry(restaurants, cachedAt);
        cache.put(zoneId, entry);
        return entry;
    }

    public void clear() {
        cache.clear();
    }

    public record CacheEntry(
        List<NearbyRestaurantResponse> restaurants,
        LocalDateTime cachedAt
    ) {

        public CacheEntry {
            restaurants = List.copyOf(restaurants);
        }

        public boolean isEmpty() {
            return restaurants.isEmpty();
        }
    }
}
