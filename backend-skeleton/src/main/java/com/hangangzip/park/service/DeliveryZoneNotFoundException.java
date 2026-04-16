package com.hangangzip.park.service;

public class DeliveryZoneNotFoundException extends RuntimeException {

    public DeliveryZoneNotFoundException(String zoneId) {
        super("Delivery zone not found: " + zoneId);
    }
}
