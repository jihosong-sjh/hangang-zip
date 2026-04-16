package com.hangangzip.park.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hangangzip.park.config.KakaoLocalProperties;
import com.hangangzip.park.domain.DeliveryZoneEntity;
import com.hangangzip.park.dto.DeliveryZoneRestaurantsResponse;
import com.hangangzip.park.dto.NearbyRestaurantResponse;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DeliveryZoneRestaurantLookupServiceTest {

    private static final ZoneId TEST_ZONE = ZoneId.of("Asia/Seoul");

    private final MutableClock clock = new MutableClock(
        Instant.parse("2026-04-15T00:00:00Z"),
        TEST_ZONE
    );

    private DeliveryZoneRestaurantProvider deliveryZoneRestaurantProvider;
    private DeliveryZoneRestaurantLookupService deliveryZoneRestaurantLookupService;

    @BeforeEach
    void setUp() {
        deliveryZoneRestaurantProvider = mock(DeliveryZoneRestaurantProvider.class);
        deliveryZoneRestaurantLookupService = new DeliveryZoneRestaurantLookupService(
            deliveryZoneRestaurantProvider,
            new DeliveryZoneRestaurantCache(),
            createProperties(),
            clock
        );
    }

    @Test
    void returnsFreshSuccessCacheWithinTenMinutes() {
        DeliveryZoneEntity deliveryZone = createDeliveryZone("yeouido-mulbit-plaza");
        NearbyRestaurantResponse restaurant = createRestaurant("place-1");

        when(deliveryZoneRestaurantProvider.searchNearbyRestaurants(deliveryZone))
            .thenReturn(List.of(restaurant));

        DeliveryZoneRestaurantsResponse firstResponse = deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        clock.advance(Duration.ofMinutes(5));

        DeliveryZoneRestaurantsResponse secondResponse = deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        assertThat(firstResponse.stale()).isFalse();
        assertThat(firstResponse.count()).isEqualTo(1);
        assertThat(secondResponse.stale()).isFalse();
        assertThat(secondResponse.items()).containsExactly(restaurant);
        assertThat(secondResponse.cachedAt()).isEqualTo(firstResponse.cachedAt());
        verify(deliveryZoneRestaurantProvider, times(1)).searchNearbyRestaurants(deliveryZone);
    }

    @Test
    void refreshesEmptyCacheAfterThreeMinutes() {
        DeliveryZoneEntity deliveryZone = createDeliveryZone("yeouido-mulbit-plaza");
        NearbyRestaurantResponse restaurant = createRestaurant("place-1");

        when(deliveryZoneRestaurantProvider.searchNearbyRestaurants(deliveryZone))
            .thenReturn(List.of())
            .thenReturn(List.of(restaurant));

        DeliveryZoneRestaurantsResponse firstResponse = deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        clock.advance(Duration.ofMinutes(4));

        DeliveryZoneRestaurantsResponse secondResponse = deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        assertThat(firstResponse.items()).isEmpty();
        assertThat(secondResponse.items()).containsExactly(restaurant);
        assertThat(secondResponse.cachedAt()).isAfter(firstResponse.cachedAt());
        verify(deliveryZoneRestaurantProvider, times(2)).searchNearbyRestaurants(deliveryZone);
    }

    @Test
    void returnsStaleCacheWhenProviderFailsWithinOneHour() {
        DeliveryZoneEntity deliveryZone = createDeliveryZone("yeouido-mulbit-plaza");
        NearbyRestaurantResponse restaurant = createRestaurant("place-1");

        when(deliveryZoneRestaurantProvider.searchNearbyRestaurants(deliveryZone))
            .thenReturn(List.of(restaurant))
            .thenThrow(new RestaurantProviderUnavailableException("provider unavailable"));

        DeliveryZoneRestaurantsResponse firstResponse = deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        clock.advance(Duration.ofMinutes(15));

        DeliveryZoneRestaurantsResponse staleResponse = deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        assertThat(staleResponse.stale()).isTrue();
        assertThat(staleResponse.items()).containsExactly(restaurant);
        assertThat(staleResponse.cachedAt()).isEqualTo(firstResponse.cachedAt());
        verify(deliveryZoneRestaurantProvider, times(2)).searchNearbyRestaurants(deliveryZone);
    }

    @Test
    void throwsWhenProviderFailsAfterStaleWindowExpires() {
        DeliveryZoneEntity deliveryZone = createDeliveryZone("yeouido-mulbit-plaza");
        NearbyRestaurantResponse restaurant = createRestaurant("place-1");

        when(deliveryZoneRestaurantProvider.searchNearbyRestaurants(deliveryZone))
            .thenReturn(List.of(restaurant))
            .thenThrow(new RestaurantProviderUnavailableException("provider unavailable"));

        deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone);

        clock.advance(Duration.ofHours(1).plusMinutes(1));

        assertThatThrownBy(() -> deliveryZoneRestaurantLookupService.getRestaurants(deliveryZone))
            .isInstanceOf(RestaurantProviderUnavailableException.class)
            .hasMessage("provider unavailable");
        verify(deliveryZoneRestaurantProvider, times(2)).searchNearbyRestaurants(deliveryZone);
    }

    private KakaoLocalProperties createProperties() {
        KakaoLocalProperties properties = new KakaoLocalProperties();
        properties.setSuccessTtl(Duration.ofMinutes(10));
        properties.setEmptyTtl(Duration.ofMinutes(3));
        properties.setStaleTtl(Duration.ofHours(1));
        return properties;
    }

    private DeliveryZoneEntity createDeliveryZone(String zoneId) {
        DeliveryZoneEntity deliveryZone = new DeliveryZoneEntity();
        deliveryZone.setId(zoneId);
        deliveryZone.setLatitude(BigDecimal.valueOf(37.5281));
        deliveryZone.setLongitude(BigDecimal.valueOf(126.9336));
        return deliveryZone;
    }

    private NearbyRestaurantResponse createRestaurant(String restaurantId) {
        return new NearbyRestaurantResponse(
            restaurantId,
            "한강치킨",
            37.5283,
            126.9338,
            "서울 영등포구 여의동로 330",
            "음식점 > 치킨",
            180,
            "02-000-0000",
            "https://place.map.kakao.com/" + restaurantId
        );
    }

    private static final class MutableClock extends Clock {

        private Instant currentInstant;
        private final ZoneId zoneId;

        private MutableClock(Instant currentInstant, ZoneId zoneId) {
            this.currentInstant = currentInstant;
            this.zoneId = zoneId;
        }

        @Override
        public ZoneId getZone() {
            return zoneId;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return new MutableClock(currentInstant, zone);
        }

        @Override
        public Instant instant() {
            return currentInstant;
        }

        void advance(Duration duration) {
            currentInstant = currentInstant.plus(duration);
        }
    }
}
