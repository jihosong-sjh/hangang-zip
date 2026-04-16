package com.hangangzip.park.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.domain.ParkEntity;
import com.hangangzip.park.dto.DeliveryZoneEvidenceResponse;
import com.hangangzip.park.dto.ZoneReviewResponse;
import com.hangangzip.park.repository.DeliveryZoneEvidenceRepository;
import com.hangangzip.park.repository.DeliveryZoneRepository;
import com.hangangzip.park.repository.ParkRepository;
import com.hangangzip.park.repository.ZoneReviewRepository;
import com.hangangzip.park.service.DeliveryZoneMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MigrationSeedIntegrationTest {

    @Autowired
    private ParkRepository parkRepository;

    @Autowired
    private DeliveryZoneRepository deliveryZoneRepository;

    @Autowired
    private DeliveryZoneEvidenceRepository deliveryZoneEvidenceRepository;

    @Autowired
    private ZoneReviewRepository zoneReviewRepository;

    @Test
    void flywaySeedsParksAndBackfillsDeliveryZoneTables() {
        assertThat(parkRepository.count()).isEqualTo(11);
        assertThat(deliveryZoneRepository.count()).isEqualTo(14);
        assertThat(deliveryZoneEvidenceRepository.count()).isEqualTo(14);
        assertThat(zoneReviewRepository.count()).isEqualTo(14);

        ParkEntity yeouido = parkRepository.findById("yeouido").orElseThrow();
        assertThat(yeouido.getSlug()).isEqualTo("yeouido");
        assertThat(yeouido.getStatus()).isEqualTo("active");
    }

    @Test
    void migratedOfficialZoneRetainsDerivedConfidenceEvidenceAndReviewData() {
        DeliveryZoneEntity deliveryZone = deliveryZoneRepository.findById("yeouido-mulbit-plaza").orElseThrow();

        assertThat(deliveryZone.getPark().getId()).isEqualTo("yeouido");
        assertThat(deliveryZone.getSourceType()).isEqualTo("official");
        assertThat(deliveryZone.getVerificationStatus()).isEqualTo("verified");
        assertThat(deliveryZone.getConfidenceScore()).isEqualTo(95);
        assertThat(deliveryZone.getIsOfficial()).isTrue();

        List<DeliveryZoneEvidenceResponse> evidences = deliveryZoneEvidenceRepository
            .findAllByDeliveryZoneIdOrderByIdAsc("yeouido-mulbit-plaza")
            .stream()
            .map(DeliveryZoneMapper::toEvidenceResponse)
            .toList();
        assertThat(evidences).singleElement().satisfies((evidence) -> {
            assertThat(evidence.sourceLabel()).isEqualTo("미래한강본부 FAQ");
            assertThat(evidence.evidenceScore()).isEqualTo(95);
            assertThat(evidence.primary()).isTrue();
        });

        List<ZoneReviewResponse> reviews = zoneReviewRepository
            .findAllByDeliveryZoneIdOrderByReviewedAtDesc("yeouido-mulbit-plaza")
            .stream()
            .map(DeliveryZoneMapper::toReviewResponse)
            .toList();
        assertThat(reviews).singleElement().satisfies((review) -> {
            assertThat(review.reviewStatus()).isEqualTo("approved");
            assertThat(review.reviewedBy()).isEqualTo("system_migration");
            assertThat(review.resultConfidenceScore()).isEqualTo(95);
        });
    }

    @Test
    void migratedNonOfficialZoneRemainsVisibleWithPendingReviewBaseline() {
        DeliveryZoneEntity deliveryZone = deliveryZoneRepository.findById("banpo-moonlight-plaza").orElseThrow();

        assertThat(deliveryZone.getSourceType()).isEqualTo("community_verified");
        assertThat(deliveryZone.getVerificationStatus()).isEqualTo("needs_review");
        assertThat(deliveryZone.getConfidenceScore()).isEqualTo(75);
        assertThat(deliveryZone.getIsOfficial()).isFalse();

        List<ZoneReviewResponse> reviews = zoneReviewRepository
            .findAllByDeliveryZoneIdOrderByReviewedAtDesc("banpo-moonlight-plaza")
            .stream()
            .map(DeliveryZoneMapper::toReviewResponse)
            .toList();
        assertThat(reviews).singleElement().satisfies((review) -> {
            assertThat(review.reviewStatus()).isEqualTo("pending");
            assertThat(review.reviewNote()).isEqualTo("Migrated from legacy park_delivery_zones metadata");
            assertThat(review.resultConfidenceScore()).isEqualTo(75);
        });
    }

    @Test
    void seededDisplayPoliciesCoverLimitedAndOpsOnlyUiScenarios() {
        DeliveryZoneEntity limitedZone = deliveryZoneRepository.findById("gangseo-eco-gate").orElseThrow();
        DeliveryZoneEntity opsOnlyZone = deliveryZoneRepository.findById("jamsil-eco-garden-gate").orElseThrow();

        assertThat(limitedZone.getDisplayPolicy()).isEqualTo("limited");
        assertThat(limitedZone.getConfidenceScore()).isEqualTo(45);
        assertThat(opsOnlyZone.getDisplayPolicy()).isEqualTo("ops_only");
        assertThat(opsOnlyZone.getConfidenceScore()).isEqualTo(35);
    }
}
