package com.hangangzip.park.dto;

public record ParkScoresResponse(
    int running,
    int picnic,
    int quiet,
    int night,
    int family
) {
}
