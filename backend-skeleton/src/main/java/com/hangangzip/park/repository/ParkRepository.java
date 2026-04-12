package com.hangangzip.park.repository;

import com.hangangzip.park.domain.ParkEntity;
import com.hangangzip.park.domain.ParkTag;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParkRepository extends JpaRepository<ParkEntity, String> {

    @EntityGraph(attributePaths = {"tags", "amenities"})
    @Query("""
        select distinct p
        from ParkEntity p
        left join p.tags t
        where (:tag is null or t = :tag)
        order by p.name asc
        """)
    List<ParkEntity> findAllByOptionalTag(@Param("tag") ParkTag tag);

    @Override
    @EntityGraph(attributePaths = {"tags", "amenities"})
    java.util.Optional<ParkEntity> findById(String id);
}
