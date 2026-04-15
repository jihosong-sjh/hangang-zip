package com.hangangzip.park.dto;

import java.math.BigDecimal;
import java.util.List;

public record DeliveryZoneDetailResponse(
    String id,
    String parkId,
    String parkName,
    String name,
    BigDecimal latitude,
    BigDecimal longitude,
    String description,
    String address,
    String sourceType,
    String verificationStatus,
    String displayPolicy,
    Integer confidenceScore,
    String coordinateSource,
    Boolean official,
    String sourceLabel,
    String sourceUrl,
    String sourceCheckedAt,
    String lastReviewedAt,
    List<DeliveryZoneEvidenceResponse> evidences,
    List<ZoneReviewResponse> reviews
) {
}
