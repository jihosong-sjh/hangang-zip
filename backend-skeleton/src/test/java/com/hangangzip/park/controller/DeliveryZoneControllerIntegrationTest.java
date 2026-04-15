package com.hangangzip.park.controller;

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
class DeliveryZoneControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getDeliveryZoneReturnsVisibleZoneDetail() throws Exception {
        mockMvc.perform(get("/api/delivery-zones/yeouido-mulbit-plaza"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("yeouido-mulbit-plaza"))
            .andExpect(jsonPath("$.parkId").value("yeouido"))
            .andExpect(jsonPath("$.name").value("물빛광장 진입구 옆"))
            .andExpect(jsonPath("$.sourceType").value("official"))
            .andExpect(jsonPath("$.verificationStatus").value("verified"))
            .andExpect(jsonPath("$.displayPolicy").value("public"))
            .andExpect(jsonPath("$.confidenceScore").value(95))
            .andExpect(jsonPath("$.evidences[0].sourceLabel").value("미래한강본부 FAQ"))
            .andExpect(jsonPath("$.reviews[0].reviewStatus").value("approved"));
    }

    @Test
    void getDeliveryZoneReturnsNotFoundForMissingZone() throws Exception {
        mockMvc.perform(get("/api/delivery-zones/does-not-exist"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("ZONE_NOT_FOUND"));
    }
}
