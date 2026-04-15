package com.hangangzip.park.service;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.dto.NearbyRestaurantResponse;
import java.util.List;

public interface DeliveryZoneRestaurantProvider {

    List<NearbyRestaurantResponse> searchNearbyRestaurants(DeliveryZoneEntity deliveryZone);
}
