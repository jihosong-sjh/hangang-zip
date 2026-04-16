package com.hangangzip.park.repository;

import com.hangangzip.park.domain.DeliveryZoneEvidenceEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryZoneEvidenceRepository extends JpaRepository<DeliveryZoneEvidenceEntity, Long> {

    List<DeliveryZoneEvidenceEntity> findAllByDeliveryZoneIdOrderByIdAsc(String deliveryZoneId);
}
