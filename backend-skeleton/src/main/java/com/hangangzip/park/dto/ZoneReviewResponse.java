package com.hangangzip.park.dto;

public record ZoneReviewResponse(
    Long id,
    String reviewStatus,
    String reviewNote,
    String reviewedBy,
    String reviewedAt,
    Integer resultConfidenceScore
) {
}
