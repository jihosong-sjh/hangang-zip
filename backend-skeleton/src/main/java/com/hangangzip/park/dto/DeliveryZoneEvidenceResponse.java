package com.hangangzip.park.dto;

public record DeliveryZoneEvidenceResponse(
    Long id,
    String sourceType,
    String sourceLabel,
    String sourceUrl,
    String sourceExcerpt,
    String checkedAt,
    Integer evidenceScore,
    Boolean primary
) {
}
