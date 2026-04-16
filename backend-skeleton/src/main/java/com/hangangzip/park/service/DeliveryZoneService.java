package com.hangangzip.park.service;

import com.hangangzip.park.dto.DeliveryZoneDetailResponse;
import com.hangangzip.park.dto.DeliveryZoneRestaurantsResponse;

public interface DeliveryZoneService {

    DeliveryZoneDetailResponse getDeliveryZone(String zoneId);

    DeliveryZoneRestaurantsResponse getDeliveryZoneRestaurants(String zoneId);
}
