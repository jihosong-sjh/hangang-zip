package com.hangangzip.park.dto;

import java.math.BigDecimal;

public record ParkDeliveryZoneResponse(
    String id,
    String name,
    BigDecimal latitude,
    BigDecimal longitude,
    String description,
    String address,
    String sourceType,
    String verificationStatus,
    String sourceLabel,
    String sourceUrl,
    String sourceCheckedAt,
    String coordinateSource,
    String displayPolicy
) {
}
