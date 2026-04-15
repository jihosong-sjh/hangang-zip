package com.hangangzip.park.dto;

import java.math.BigDecimal;
import java.util.List;

public record ParkResponse(
    String id,
    String slug,
    String name,
    BigDecimal latitude,
    BigDecimal longitude,
    String primaryTag,
    List<String> tags,
    String description,
    ParkScoresResponse scores,
    List<String> amenities,
    String recommendation,
    List<ParkDeliveryZoneResponse> deliveryZones,
    List<ParkAccessPointResponse> accessPoints
) {
}
