package com.hangangzip.park.service;

public class ParkNotFoundException extends RuntimeException {

    public ParkNotFoundException(String parkId) {
        super("Park not found: " + parkId);
    }
}
