package com.hangangzip.park.controller;

import com.hangangzip.park.dto.ParkListResponse;
import com.hangangzip.park.dto.ParkResponse;
import com.hangangzip.park.service.ParkService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parks")
public class ParkController {

    private final ParkService parkService;

    public ParkController(ParkService parkService) {
        this.parkService = parkService;
    }

    @GetMapping
    public ParkListResponse getParks(@RequestParam(required = false) String tag) {
        return parkService.getParks(tag);
    }

    @GetMapping("/{id}")
    public ParkResponse getPark(@PathVariable String id) {
        return parkService.getPark(id);
    }
}
