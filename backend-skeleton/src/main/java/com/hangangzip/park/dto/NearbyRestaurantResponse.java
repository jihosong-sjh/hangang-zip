package com.hangangzip.park.dto;

public record NearbyRestaurantResponse(
    String id,
    String name,
    double latitude,
    double longitude,
    String address,
    String categoryName,
    int distance,
    String phone,
    String placeUrl
) {
}
