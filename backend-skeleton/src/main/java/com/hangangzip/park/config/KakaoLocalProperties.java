package com.hangangzip.park.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.kakao.local")
public class KakaoLocalProperties {

    private String baseUrl = "https://dapi.kakao.com";
    private String restApiKey = "";
    private int restaurantRadius = 1200;
    private int restaurantSize = 12;
    private Duration successTtl = Duration.ofMinutes(10);
    private Duration emptyTtl = Duration.ofMinutes(3);
    private Duration staleTtl = Duration.ofHours(1);

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getRestApiKey() {
        return restApiKey;
    }

    public void setRestApiKey(String restApiKey) {
        this.restApiKey = restApiKey;
    }

    public int getRestaurantRadius() {
        return restaurantRadius;
    }

    public void setRestaurantRadius(int restaurantRadius) {
        this.restaurantRadius = restaurantRadius;
    }

    public int getRestaurantSize() {
        return restaurantSize;
    }

    public void setRestaurantSize(int restaurantSize) {
        this.restaurantSize = restaurantSize;
    }

    public Duration getSuccessTtl() {
        return successTtl;
    }

    public void setSuccessTtl(Duration successTtl) {
        this.successTtl = successTtl;
    }

    public Duration getEmptyTtl() {
        return emptyTtl;
    }

    public void setEmptyTtl(Duration emptyTtl) {
        this.emptyTtl = emptyTtl;
    }

    public Duration getStaleTtl() {
        return staleTtl;
    }

    public void setStaleTtl(Duration staleTtl) {
        this.staleTtl = staleTtl;
    }
}
