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
class ParkControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getParksReturnsSeededItems() throws Exception {
        mockMvc.perform(get("/api/parks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(11))
            .andExpect(jsonPath("$.items[0].id").exists());
    }

    @Test
    void getParkReturnsSinglePark() throws Exception {
        mockMvc.perform(get("/api/parks/yeouido"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("yeouido"))
            .andExpect(jsonPath("$.primaryTag").value("picnic"))
            .andExpect(jsonPath("$.deliveryZones[0].id").value("yeouido-event-plaza"));
    }

    @Test
    void getParksFiltersByTag() throws Exception {
        mockMvc.perform(get("/api/parks").param("tag", "running"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items[0].tags").isArray());
    }
}
