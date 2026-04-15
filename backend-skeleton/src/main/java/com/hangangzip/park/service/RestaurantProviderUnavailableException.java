package com.hangangzip.park.service;

public class RestaurantProviderUnavailableException extends RuntimeException {

    public RestaurantProviderUnavailableException(String message) {
        super(message);
    }

    public RestaurantProviderUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
