package com.hangangzip.park.service;

import com.hangangzip.park.domain.AmenityType;
import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.domain.ParkAccessPointEntity;
import com.hangangzip.park.domain.ParkEntity;
import com.hangangzip.park.domain.ParkTag;
import com.hangangzip.park.dto.ParkAccessPointResponse;
import com.hangangzip.park.dto.ParkDeliveryZoneResponse;
import com.hangangzip.park.dto.ParkResponse;
import com.hangangzip.park.dto.ParkScoresResponse;
import java.util.Comparator;
import java.util.List;

public final class ParkMapper {

    private ParkMapper() {
    }

    public static ParkResponse toResponse(
        ParkEntity park,
        List<ParkDeliveryZoneResponse> deliveryZones,
        List<ParkAccessPointResponse> accessPoints
    ) {
        return new ParkResponse(
            park.getId(),
            park.getSlug(),
            park.getName(),
            park.getLatitude(),
            park.getLongitude(),
            toClientValue(park.getPrimaryTag()),
            park.getTags().stream()
                .sorted(Comparator.comparing(Enum::name))
                .map(ParkMapper::toClientValue)
                .toList(),
            park.getDescription(),
            new ParkScoresResponse(
                park.getRunningScore(),
                park.getPicnicScore(),
                park.getQuietScore(),
                park.getNightScore(),
                park.getFamilyScore()
            ),
            park.getAmenities().stream()
                .sorted(Comparator.comparing(Enum::name))
                .map(ParkMapper::toClientValue)
                .toList(),
            park.getRecommendation(),
            deliveryZones,
            accessPoints
        );
    }

    public static ParkAccessPointResponse toAccessPointResponse(ParkAccessPointEntity accessPoint) {
        return new ParkAccessPointResponse(
            accessPoint.getId(),
            accessPoint.getType(),
            accessPoint.getName(),
            accessPoint.getLatitude(),
            accessPoint.getLongitude(),
            accessPoint.getAddress(),
            accessPoint.getNote()
        );
    }

    public static ParkDeliveryZoneResponse toDeliveryZoneResponse(DeliveryZoneEntity deliveryZone) {
        return new ParkDeliveryZoneResponse(
            deliveryZone.getId(),
            deliveryZone.getName(),
            deliveryZone.getLatitude(),
            deliveryZone.getLongitude(),
            deliveryZone.getDescription(),
            deliveryZone.getAddress(),
            deliveryZone.getSourceType(),
            deliveryZone.getVerificationStatus(),
            deliveryZone.getSourceLabel(),
            deliveryZone.getSourceUrl(),
            deliveryZone.getSourceCheckedAt().toString(),
            deliveryZone.getCoordinateSource(),
            deliveryZone.getDisplayPolicy()
        );
    }

    private static String toClientValue(ParkTag tag) {
        return tag.name().toLowerCase();
    }

    private static String toClientValue(AmenityType amenityType) {
        return amenityType.name().toLowerCase();
    }
}
