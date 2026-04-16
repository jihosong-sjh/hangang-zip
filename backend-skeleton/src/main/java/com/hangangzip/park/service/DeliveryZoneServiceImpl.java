package com.hangangzip.park.service;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.dto.DeliveryZoneDetailResponse;
import com.hangangzip.park.dto.DeliveryZoneEvidenceResponse;
import com.hangangzip.park.dto.DeliveryZoneRestaurantsResponse;
import com.hangangzip.park.dto.ZoneReviewResponse;
import com.hangangzip.park.repository.DeliveryZoneEvidenceRepository;
import com.hangangzip.park.repository.DeliveryZoneRepository;
import com.hangangzip.park.repository.ZoneReviewRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DeliveryZoneServiceImpl implements DeliveryZoneService {

    private final DeliveryZoneRepository deliveryZoneRepository;
    private final DeliveryZoneEvidenceRepository deliveryZoneEvidenceRepository;
    private final ZoneReviewRepository zoneReviewRepository;
    private final DeliveryZoneRestaurantLookupService deliveryZoneRestaurantLookupService;

    public DeliveryZoneServiceImpl(
        DeliveryZoneRepository deliveryZoneRepository,
        DeliveryZoneEvidenceRepository deliveryZoneEvidenceRepository,
        ZoneReviewRepository zoneReviewRepository,
        DeliveryZoneRestaurantLookupService deliveryZoneRestaurantLookupService
    ) {
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.deliveryZoneEvidenceRepository = deliveryZoneEvidenceRepository;
        this.zoneReviewRepository = zoneReviewRepository;
        this.deliveryZoneRestaurantLookupService = deliveryZoneRestaurantLookupService;
    }

    @Override
    public DeliveryZoneDetailResponse getDeliveryZone(String zoneId) {
        DeliveryZoneEntity deliveryZone = findVisibleDeliveryZone(zoneId);

        List<DeliveryZoneEvidenceResponse> evidences = deliveryZoneEvidenceRepository
            .findAllByDeliveryZoneIdOrderByIdAsc(zoneId)
            .stream()
            .map(DeliveryZoneMapper::toEvidenceResponse)
            .toList();

        List<ZoneReviewResponse> reviews = zoneReviewRepository
            .findAllByDeliveryZoneIdOrderByReviewedAtDesc(zoneId)
            .stream()
            .map(DeliveryZoneMapper::toReviewResponse)
            .toList();

        return DeliveryZoneMapper.toDetailResponse(deliveryZone, evidences, reviews);
    }

    @Override
    public DeliveryZoneRestaurantsResponse getDeliveryZoneRestaurants(String zoneId) {
        return deliveryZoneRestaurantLookupService.getRestaurants(findVisibleDeliveryZone(zoneId));
    }

    private DeliveryZoneEntity findVisibleDeliveryZone(String zoneId) {
        return deliveryZoneRepository
            .findByIdAndDisplayPolicyNotAndVerificationStatusNot(
                zoneId,
                DeliveryZonePolicy.OPS_ONLY_DISPLAY_POLICY,
                DeliveryZonePolicy.REJECTED_VERIFICATION_STATUS
            )
            .filter(DeliveryZonePolicy::isVisible)
            .orElseThrow(() -> new DeliveryZoneNotFoundException(zoneId));
    }
}
