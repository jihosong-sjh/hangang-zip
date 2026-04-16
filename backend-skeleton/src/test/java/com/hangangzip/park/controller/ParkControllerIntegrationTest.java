package com.hangangzip.park.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ParkControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getParksReturnsSeededItems() throws Exception {
        mockMvc.perform(get("/api/parks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(11))
            .andExpect(jsonPath("$.items[*].slug", hasItems("gangseo", "yeouido", "ttukseom")))
            .andExpect(jsonPath("$.items[*].id", hasItems("gangseo", "yeouido", "ttukseom")));
    }

    @Test
    void getParkReturnsSinglePark() throws Exception {
        mockMvc.perform(get("/api/parks/yeouido"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("yeouido"))
            .andExpect(jsonPath("$.slug").value("yeouido"))
            .andExpect(jsonPath("$.primaryTag").value("picnic"))
            .andExpect(jsonPath("$.tags", contains("family", "night", "picnic")))
            .andExpect(jsonPath("$.amenities", contains(
                "cafe",
                "convenience_store",
                "parking",
                "playground",
                "rental_bike",
                "restroom"
            )))
            .andExpect(jsonPath("$.scores.picnic").value(5))
            .andExpect(jsonPath("$.accessPoints.length()").value(1))
            .andExpect(jsonPath("$.accessPoints[0].type").value("station"))
            .andExpect(jsonPath("$.accessPoints[0].name").value("여의나루역 방향 진입로"))
            .andExpect(jsonPath("$.deliveryZones.length()").value(3))
            .andExpect(jsonPath("$.deliveryZones[0].id").value("yeouido-mulbit-plaza"))
            .andExpect(jsonPath("$.deliveryZones[0].sourceType").value("official"))
            .andExpect(jsonPath("$.deliveryZones[0].verificationStatus").value("verified"))
            .andExpect(jsonPath("$.deliveryZones[0].displayPolicy").value("public"))
            .andExpect(jsonPath("$.deliveryZones[0].confidenceScore").value(95));
    }

    @Test
    void getParkIncludesLimitedZoneAndHidesOpsOnlyZone() throws Exception {
        mockMvc.perform(get("/api/parks/gangseo"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.deliveryZones.length()").value(1))
            .andExpect(jsonPath("$.deliveryZones[0].id").value("gangseo-eco-gate"))
            .andExpect(jsonPath("$.deliveryZones[0].displayPolicy").value("limited"))
            .andExpect(jsonPath("$.deliveryZones[0].confidenceScore").value(45));

        mockMvc.perform(get("/api/parks/jamsil"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.deliveryZones.length()").value(0));
    }

    @Test
    void getParksFiltersByTag() throws Exception {
        mockMvc.perform(get("/api/parks").param("tag", "running"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(4))
            .andExpect(jsonPath("$.items[*].id", hasItems("yanghwa", "ichon", "ttukseom", "jamwon")))
            .andExpect(jsonPath("$.items[*].primaryTag", everyItem(is("running"))));
    }

    @Test
    void getParksReturnsBadRequestForUnsupportedTag() throws Exception {
        mockMvc.perform(get("/api/parks").param("tag", "invalid-tag"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
            .andExpect(jsonPath("$.message").value("Unsupported tag: invalid-tag"));
    }

    @Test
    void getParkReturnsNotFoundForMissingPark() throws Exception {
        mockMvc.perform(get("/api/parks/does-not-exist"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("PARK_NOT_FOUND"));
    }
}
