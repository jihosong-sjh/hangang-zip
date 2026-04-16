package com.hangangzip.park.service;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.domain.DeliveryZoneEvidenceEntity;
import com.hangangzip.park.domain.ZoneReviewEntity;
import com.hangangzip.park.dto.DeliveryZoneDetailResponse;
import com.hangangzip.park.dto.DeliveryZoneEvidenceResponse;
import com.hangangzip.park.dto.ZoneReviewResponse;
import java.util.List;

public final class DeliveryZoneMapper {

    private DeliveryZoneMapper() {
    }

    public static DeliveryZoneDetailResponse toDetailResponse(
        DeliveryZoneEntity deliveryZone,
        List<DeliveryZoneEvidenceResponse> evidences,
        List<ZoneReviewResponse> reviews
    ) {
        String lastReviewedAt = reviews.isEmpty() ? null : reviews.get(0).reviewedAt();

        return new DeliveryZoneDetailResponse(
            deliveryZone.getId(),
            deliveryZone.getPark().getId(),
            deliveryZone.getPark().getName(),
            deliveryZone.getName(),
            deliveryZone.getLatitude(),
            deliveryZone.getLongitude(),
            deliveryZone.getDescription(),
            deliveryZone.getAddress(),
            deliveryZone.getSourceType(),
            deliveryZone.getVerificationStatus(),
            deliveryZone.getDisplayPolicy(),
            deliveryZone.getConfidenceScore(),
            deliveryZone.getCoordinateSource(),
            deliveryZone.getIsOfficial(),
            deliveryZone.getSourceLabel(),
            deliveryZone.getSourceUrl(),
            deliveryZone.getSourceCheckedAt().toString(),
            lastReviewedAt,
            evidences,
            reviews
        );
    }

    public static DeliveryZoneEvidenceResponse toEvidenceResponse(DeliveryZoneEvidenceEntity evidence) {
        return new DeliveryZoneEvidenceResponse(
            evidence.getId(),
            evidence.getSourceType(),
            evidence.getSourceLabel(),
            evidence.getSourceUrl(),
            evidence.getSourceExcerpt(),
            evidence.getCheckedAt().toString(),
            evidence.getEvidenceScore(),
            evidence.getIsPrimary()
        );
    }

    public static ZoneReviewResponse toReviewResponse(ZoneReviewEntity review) {
        return new ZoneReviewResponse(
            review.getId(),
            review.getReviewStatus(),
            review.getReviewNote(),
            review.getReviewedBy(),
            review.getReviewedAt().toString(),
            review.getResultConfidenceScore()
        );
    }
}
