package com.hangangzip.park.service;

import com.hangangzip.park.domain.ParkEntity;
import com.hangangzip.park.domain.ParkTag;
import com.hangangzip.park.dto.ParkListResponse;
import com.hangangzip.park.dto.ParkResponse;
import com.hangangzip.park.repository.ParkRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ParkServiceImpl implements ParkService {

    private final ParkRepository parkRepository;

    public ParkServiceImpl(ParkRepository parkRepository) {
        this.parkRepository = parkRepository;
    }

    @Override
    public ParkListResponse getParks(String tag) {
        ParkTag parkTag = parseTag(tag);
        List<ParkResponse> items = parkRepository.findAllByOptionalTag(parkTag).stream()
            .map(ParkMapper::toResponse)
            .toList();

        return new ParkListResponse(items, items.size());
    }

    @Override
    public ParkResponse getPark(String id) {
        ParkEntity park = parkRepository.findById(id)
            .orElseThrow(() -> new ParkNotFoundException(id));

        return ParkMapper.toResponse(park);
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
}
