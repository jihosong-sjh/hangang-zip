package com.hangangzip.park.service;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.dto.DeliveryZoneDetailResponse;
import com.hangangzip.park.dto.DeliveryZoneEvidenceResponse;
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

    public DeliveryZoneServiceImpl(
        DeliveryZoneRepository deliveryZoneRepository,
        DeliveryZoneEvidenceRepository deliveryZoneEvidenceRepository,
        ZoneReviewRepository zoneReviewRepository
    ) {
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.deliveryZoneEvidenceRepository = deliveryZoneEvidenceRepository;
        this.zoneReviewRepository = zoneReviewRepository;
    }

    @Override
    public DeliveryZoneDetailResponse getDeliveryZone(String zoneId) {
        DeliveryZoneEntity deliveryZone = deliveryZoneRepository
            .findByIdAndDisplayPolicyNotAndVerificationStatusNot(
                zoneId,
                DeliveryZonePolicy.OPS_ONLY_DISPLAY_POLICY,
                DeliveryZonePolicy.REJECTED_VERIFICATION_STATUS
            )
            .filter(DeliveryZonePolicy::isVisible)
            .orElseThrow(() -> new DeliveryZoneNotFoundException(zoneId));

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
}
