package com.hangangzip.park.service;

import com.hangangzip.park.domain.AmenityType;
import com.hangangzip.park.domain.ParkEntity;
import com.hangangzip.park.domain.ParkTag;
import com.hangangzip.park.dto.ParkResponse;
import com.hangangzip.park.dto.ParkScoresResponse;
import java.util.Comparator;
import java.util.List;

public final class ParkMapper {

    private ParkMapper() {
    }

    public static ParkResponse toResponse(ParkEntity park) {
        return new ParkResponse(
            park.getId(),
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
            park.getRecommendation()
        );
    }

    private static String toClientValue(ParkTag tag) {
        return tag.name().toLowerCase();
    }

    private static String toClientValue(AmenityType amenityType) {
        return amenityType.name().toLowerCase();
    }
}
