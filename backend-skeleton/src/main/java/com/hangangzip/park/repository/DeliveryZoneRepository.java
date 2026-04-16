package com.hangangzip.park.repository;

import com.hangangzip.park.domain.DeliveryZoneEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeliveryZoneRepository extends JpaRepository<DeliveryZoneEntity, String> {

    @Override
    @EntityGraph(attributePaths = {"park"})
    Optional<DeliveryZoneEntity> findById(String id);

    @EntityGraph(attributePaths = {"park"})
    List<DeliveryZoneEntity> findAllByParkIdOrderByIdAsc(String parkId);

    @EntityGraph(attributePaths = {"park"})
    @Query("""
        select dz
        from DeliveryZoneEntity dz
        where dz.park.id in :parkIds
          and dz.displayPolicy <> :excludedDisplayPolicy
          and dz.verificationStatus <> :excludedVerificationStatus
        order by dz.park.id asc, dz.id asc
        """)
    List<DeliveryZoneEntity> findVisibleByParkIds(
        @Param("parkIds") List<String> parkIds,
        @Param("excludedDisplayPolicy") String excludedDisplayPolicy,
        @Param("excludedVerificationStatus") String excludedVerificationStatus
    );

    @EntityGraph(attributePaths = {"park"})
    List<DeliveryZoneEntity> findAllByParkIdAndDisplayPolicyNotAndVerificationStatusNotOrderByIdAsc(
        String parkId,
        String displayPolicy,
        String verificationStatus
    );

    @EntityGraph(attributePaths = {"park"})
    Optional<DeliveryZoneEntity> findByIdAndDisplayPolicyNotAndVerificationStatusNot(
        String id,
        String displayPolicy,
        String verificationStatus
    );
}
