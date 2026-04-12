package com.hangangzip.park.dto;

import java.util.List;

public record ParkListResponse(
    List<ParkResponse> items,
    int count
) {
}
