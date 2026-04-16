package com.hangangzip.park.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hangangzip.park.config.KakaoLocalProperties;
import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.dto.NearbyRestaurantResponse;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Component
public class KakaoLocalRestaurantProvider implements DeliveryZoneRestaurantProvider {

    private static final String CATEGORY_GROUP_CODE = "FD6";
    private static final String SORT_BY_DISTANCE = "distance";

    private final RestClient restClient;
    private final KakaoLocalProperties kakaoLocalProperties;

    public KakaoLocalRestaurantProvider(RestClient.Builder restClientBuilder, KakaoLocalProperties kakaoLocalProperties) {
        this.restClient = restClientBuilder.baseUrl(kakaoLocalProperties.getBaseUrl()).build();
        this.kakaoLocalProperties = kakaoLocalProperties;
    }

    @Override
    public List<NearbyRestaurantResponse> searchNearbyRestaurants(DeliveryZoneEntity deliveryZone) {
        if (!StringUtils.hasText(kakaoLocalProperties.getRestApiKey())) {
            throw new RestaurantProviderUnavailableException("Kakao Local REST API key is not configured.");
        }

        try {
            KakaoLocalCategorySearchResponse payload = restClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/v2/local/search/category.json")
                    .queryParam("category_group_code", CATEGORY_GROUP_CODE)
                    .queryParam("x", deliveryZone.getLongitude())
                    .queryParam("y", deliveryZone.getLatitude())
                    .queryParam("radius", kakaoLocalProperties.getRestaurantRadius())
                    .queryParam("size", kakaoLocalProperties.getRestaurantSize())
                    .queryParam("sort", SORT_BY_DISTANCE)
                    .build())
                .header(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoLocalProperties.getRestApiKey())
                .retrieve()
                .body(KakaoLocalCategorySearchResponse.class);

            if (payload == null || payload.documents() == null) {
                return List.of();
            }

            return payload.documents().stream().map(KakaoLocalRestaurantProvider::toResponse).toList();
        } catch (RestClientResponseException exception) {
            throw new RestaurantProviderUnavailableException(
                "Kakao Local provider request failed with status " + exception.getStatusCode().value(),
                exception
            );
        } catch (RestClientException exception) {
            throw new RestaurantProviderUnavailableException("Kakao Local provider request failed.", exception);
        } catch (RuntimeException exception) {
            throw new RestaurantProviderUnavailableException("Kakao Local provider response could not be parsed.", exception);
        }
    }

    private static NearbyRestaurantResponse toResponse(KakaoLocalPlaceDocument document) {
        return new NearbyRestaurantResponse(
            document.id(),
            document.placeName(),
            parseDouble(document.latitude()),
            parseDouble(document.longitude()),
            StringUtils.hasText(document.roadAddressName()) ? document.roadAddressName() : document.addressName(),
            document.categoryName(),
            parseInt(document.distance()),
            StringUtils.hasText(document.phone()) ? document.phone() : null,
            document.placeUrl()
        );
    }

    private static double parseDouble(String value) {
        return Double.parseDouble(value);
    }

    private static int parseInt(String value) {
        return Integer.parseInt(value);
    }

    private record KakaoLocalCategorySearchResponse(List<KakaoLocalPlaceDocument> documents) {
    }

    private record KakaoLocalPlaceDocument(
        String id,
        @JsonProperty("place_name") String placeName,
        String x,
        String y,
        @JsonProperty("address_name") String addressName,
        @JsonProperty("road_address_name") String roadAddressName,
        @JsonProperty("category_name") String categoryName,
        String distance,
        String phone,
        @JsonProperty("place_url") String placeUrl
    ) {
        String latitude() {
            return y;
        }

        String longitude() {
            return x;
        }
    }
}
