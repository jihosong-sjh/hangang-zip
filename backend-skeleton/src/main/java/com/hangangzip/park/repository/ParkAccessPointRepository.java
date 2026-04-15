package com.hangangzip.park.repository;

import com.hangangzip.park.domain.ParkAccessPointEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkAccessPointRepository extends JpaRepository<ParkAccessPointEntity, Long> {

    List<ParkAccessPointEntity> findAllByParkIdOrderByIdAsc(String parkId);
}
