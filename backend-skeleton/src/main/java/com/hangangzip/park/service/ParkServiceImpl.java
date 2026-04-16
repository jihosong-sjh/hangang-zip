package com.hangangzip.park.service;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.domain.ParkEntity;
import com.hangangzip.park.domain.ParkTag;
import com.hangangzip.park.dto.ParkAccessPointResponse;
import com.hangangzip.park.dto.ParkDeliveryZoneResponse;
import com.hangangzip.park.dto.ParkListResponse;
import com.hangangzip.park.dto.ParkResponse;
import com.hangangzip.park.repository.DeliveryZoneRepository;
import com.hangangzip.park.repository.ParkAccessPointRepository;
import com.hangangzip.park.repository.ParkRepository;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ParkServiceImpl implements ParkService {

    private final ParkRepository parkRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final ParkAccessPointRepository parkAccessPointRepository;

    public ParkServiceImpl(
        ParkRepository parkRepository,
        DeliveryZoneRepository deliveryZoneRepository,
        ParkAccessPointRepository parkAccessPointRepository
    ) {
        this.parkRepository = parkRepository;
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.parkAccessPointRepository = parkAccessPointRepository;
    }

    @Override
    public ParkListResponse getParks(String tag) {
        ParkTag parkTag = parseTag(tag);
        List<ParkEntity> parks = parkRepository.findAllByOptionalTag(parkTag);
        Map<String, List<ParkDeliveryZoneResponse>> deliveryZonesByParkId = mapVisibleDeliveryZones(parks);

        List<ParkResponse> items = parks.stream()
            .map((park) -> ParkMapper.toResponse(
                park,
                deliveryZonesByParkId.getOrDefault(park.getId(), Collections.emptyList()),
                Collections.emptyList()
            ))
            .toList();

        return new ParkListResponse(items, items.size());
    }

    @Override
    public ParkResponse getPark(String id) {
        ParkEntity park = parkRepository.findById(id)
            .orElseThrow(() -> new ParkNotFoundException(id));

        List<ParkDeliveryZoneResponse> visibleDeliveryZones = deliveryZoneRepository
            .findAllByParkIdAndDisplayPolicyNotAndVerificationStatusNotOrderByIdAsc(
                park.getId(),
                DeliveryZonePolicy.OPS_ONLY_DISPLAY_POLICY,
                DeliveryZonePolicy.REJECTED_VERIFICATION_STATUS
            )
            .stream()
            .filter(DeliveryZonePolicy::isVisible)
            .map(ParkMapper::toDeliveryZoneResponse)
            .toList();

        List<ParkAccessPointResponse> accessPoints = parkAccessPointRepository
            .findAllByParkIdOrderByIdAsc(park.getId())
            .stream()
            .map(ParkMapper::toAccessPointResponse)
            .toList();

        return ParkMapper.toResponse(park, visibleDeliveryZones, accessPoints);
    }

    private ParkTag parseTag(String tag) {
        if (tag == null || tag.isBlank()) {
            return null;
        }

        try {
            return ParkTag.valueOf(tag.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Unsupported tag: " + tag);
        }
    }

    private Map<String, List<ParkDeliveryZoneResponse>> mapVisibleDeliveryZones(List<ParkEntity> parks) {
        if (parks.isEmpty()) {
            return Collections.emptyMap();
        }

        List<String> parkIds = parks.stream()
            .map(ParkEntity::getId)
            .toList();

        Map<String, List<ParkDeliveryZoneResponse>> deliveryZonesByParkId = new LinkedHashMap<>();

        for (DeliveryZoneEntity deliveryZone : deliveryZoneRepository.findVisibleByParkIds(
            parkIds,
            DeliveryZonePolicy.OPS_ONLY_DISPLAY_POLICY,
            DeliveryZonePolicy.REJECTED_VERIFICATION_STATUS
        )) {
            if (!DeliveryZonePolicy.isVisible(deliveryZone)) {
                continue;
            }

            deliveryZonesByParkId.computeIfAbsent(deliveryZone.getPark().getId(), ignored -> new java.util.ArrayList<>())
                .add(ParkMapper.toDeliveryZoneResponse(deliveryZone));
        }

        return deliveryZonesByParkId;
    }
}
