package com.hangangzip.park.dto;

import java.math.BigDecimal;

public record ParkAccessPointResponse(
    Long id,
    String type,
    String name,
    BigDecimal latitude,
    BigDecimal longitude,
    String address,
    String note
) {
}
