package com.hangangzip.park.repository;

import com.hangangzip.park.domain.ZoneReviewEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZoneReviewRepository extends JpaRepository<ZoneReviewEntity, Long> {

    List<ZoneReviewEntity> findAllByDeliveryZoneIdOrderByReviewedAtDesc(String deliveryZoneId);
}
