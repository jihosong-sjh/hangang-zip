package com.hangangzip.park.controller;

import com.hangangzip.park.dto.DeliveryZoneDetailResponse;
import com.hangangzip.park.service.DeliveryZoneService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/delivery-zones")
public class DeliveryZoneController {

    private final DeliveryZoneService deliveryZoneService;

    public DeliveryZoneController(DeliveryZoneService deliveryZoneService) {
        this.deliveryZoneService = deliveryZoneService;
    }

    @GetMapping("/{zoneId}")
    public DeliveryZoneDetailResponse getDeliveryZone(@PathVariable String zoneId) {
        return deliveryZoneService.getDeliveryZone(zoneId);
    }
}
