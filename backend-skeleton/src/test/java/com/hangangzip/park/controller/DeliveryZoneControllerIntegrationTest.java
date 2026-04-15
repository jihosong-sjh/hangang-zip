package com.hangangzip.park.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
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
            .andExpect(jsonPath("$.parkName").value("여의도한강공원"))
            .andExpect(jsonPath("$.name").value("물빛광장 진입구 옆"))
            .andExpect(jsonPath("$.sourceType").value("official"))
            .andExpect(jsonPath("$.verificationStatus").value("verified"))
            .andExpect(jsonPath("$.displayPolicy").value("public"))
            .andExpect(jsonPath("$.confidenceScore").value(95))
            .andExpect(jsonPath("$.official").value(true))
            .andExpect(jsonPath("$.sourceCheckedAt").value("2026-04-14"))
            .andExpect(jsonPath("$.lastReviewedAt", Matchers.notNullValue()))
            .andExpect(jsonPath("$.evidences.length()").value(1))
            .andExpect(jsonPath("$.evidences[0].sourceLabel").value("미래한강본부 FAQ"))
            .andExpect(jsonPath("$.evidences[0].evidenceScore").value(95))
            .andExpect(jsonPath("$.reviews.length()").value(1))
            .andExpect(jsonPath("$.reviews[0].reviewStatus").value("approved"));
    }

    @Test
    void getDeliveryZoneReturnsNotFoundForMissingZone() throws Exception {
        mockMvc.perform(get("/api/delivery-zones/does-not-exist"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("ZONE_NOT_FOUND"));
    }

    @Test
    void getDeliveryZoneReturnsBackfilledCommunityVerifiedZoneDetail() throws Exception {
        mockMvc.perform(get("/api/delivery-zones/banpo-moonlight-plaza"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("banpo-moonlight-plaza"))
            .andExpect(jsonPath("$.parkId").value("banpo"))
            .andExpect(jsonPath("$.sourceType").value("community_verified"))
            .andExpect(jsonPath("$.verificationStatus").value("needs_review"))
            .andExpect(jsonPath("$.confidenceScore").value(75))
            .andExpect(jsonPath("$.official").value(false))
            .andExpect(jsonPath("$.evidences[0].evidenceScore").value(75))
            .andExpect(jsonPath("$.reviews[0].reviewStatus").value("pending"))
            .andExpect(jsonPath("$.reviews[0].reviewedBy").value("system_migration"));
    }
}
