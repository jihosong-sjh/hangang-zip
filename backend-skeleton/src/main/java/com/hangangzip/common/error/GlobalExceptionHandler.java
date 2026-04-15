package com.hangangzip.common.error;

import com.hangangzip.park.service.ParkNotFoundException;
import com.hangangzip.park.service.DeliveryZoneNotFoundException;
import com.hangangzip.park.service.RestaurantProviderUnavailableException;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ParkNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleParkNotFound(ParkNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiErrorResponse("PARK_NOT_FOUND", exception.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(DeliveryZoneNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleDeliveryZoneNotFound(DeliveryZoneNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiErrorResponse("ZONE_NOT_FOUND", exception.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(RestaurantProviderUnavailableException.class)
    public ResponseEntity<ApiErrorResponse> handleRestaurantProviderUnavailable(
        RestaurantProviderUnavailableException exception
    ) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
            .body(new ApiErrorResponse("RESTAURANT_PROVIDER_UNAVAILABLE", exception.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
            .body(new ApiErrorResponse("INVALID_REQUEST", exception.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        return ResponseEntity.badRequest()
            .body(new ApiErrorResponse("VALIDATION_ERROR", "Request validation failed", LocalDateTime.now()));
    }
}
