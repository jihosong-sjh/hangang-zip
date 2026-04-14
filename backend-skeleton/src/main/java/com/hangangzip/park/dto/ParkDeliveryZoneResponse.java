package com.hangangzip.park.dto;

import java.math.BigDecimal;

public record ParkDeliveryZoneResponse(
    String id,
    String name,
    BigDecimal latitude,
    BigDecimal longitude,
    String description
) {
}
