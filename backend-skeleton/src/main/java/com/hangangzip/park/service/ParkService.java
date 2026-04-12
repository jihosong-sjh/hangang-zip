package com.hangangzip.park.service;

import com.hangangzip.park.dto.ParkListResponse;
import com.hangangzip.park.dto.ParkResponse;

public interface ParkService {
    ParkListResponse getParks(String tag);

    ParkResponse getPark(String id);
}
