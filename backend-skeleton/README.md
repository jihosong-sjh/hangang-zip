# Backend Skeleton

현재 백엔드는 Spring Boot 기준으로 실행 가능하며 `dev(H2)`와 `prod(MySQL)` 프로파일을 분리해 사용할 수 있다.

포함된 것:
- Gradle wrapper
- Spring Boot 애플리케이션 진입점
- JPA entity / enum
- DTO
- repository / service / controller 계층
- 전역 예외 처리
- Flyway migration
- Flyway 기반 초기 데이터 migration
- API 예시 문서

## 실행
```bash
cd backend-skeleton
./scripts/run-dev-local.sh
```

기본 주소:
- API: `http://localhost:8081`
- H2 Console: `http://localhost:8081/h2-console`

## 프로파일
### dev
- 기본 프로파일
- H2 메모리 DB 사용
- H2 Console 활성화
- Flyway가 스키마와 11개 공원 초기 데이터를 함께 적재
- 로컬 실행은 `./scripts/run-dev-local.sh`
- `KAKAO_LOCAL_REST_API_KEY`가 없으면 맛집 API는 `502`를 반환

### prod
- MySQL 사용
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 환경변수 사용
- `KAKAO_LOCAL_REST_API_KEY` 환경변수 사용
- 로컬 Docker MySQL 검증용 기본 URL은 `allowPublicKeyRetrieval=true` 포함
- H2 Console 비활성화
- Flyway가 스키마와 초기 데이터를 적재
- HikariCP 설정을 환경변수로 조정 가능
- 운영 배포에서는 `SPRING_PROFILES_ACTIVE=prod`를 명시해야 함

#### prod 로컬 검증
1. 예시 환경변수 복사
```bash
cp .env.prod.example .env.prod.local
```

2. 로컬 MySQL 실행
```bash
docker compose -f docker-compose.mysql.yml up -d
```

3. 환경변수 적용 후 부팅
```bash
export $(grep -v '^#' .env.prod.local | xargs)
SPRING_PROFILES_ACTIVE=prod ./gradlew bootRun
```

또는 스크립트 사용:
```bash
./scripts/run-prod-local.sh
```

4. 확인
```bash
curl http://localhost:8081/api/parks
curl http://localhost:8081/api/parks/yeouido
curl "http://localhost:8081/api/parks?tag=running"
curl http://localhost:8081/api/delivery-zones/yeouido-mulbit-plaza
curl http://localhost:8081/api/delivery-zones/yeouido-mulbit-plaza/restaurants
```

참고:
- 현재는 `V2__seed_parks.sql`이 dev/prod 모두에 동일한 11개 공원 초기 데이터를 적재한다.
- 이후 실운영에서 초기 데이터와 운영 데이터 적재를 분리하고 싶으면 profile별 Flyway location 또는 운영 데이터 배포 절차를 별도로 두는 편이 안전하다.

## 현재 구조
```text
src/main/java/com/hangangzip
├── common
│   ├── config
│   └── error
└── park
    ├── config
    ├── controller
    ├── domain
    ├── dto
    ├── repository
    └── service
```

## 현재 동작
- Flyway가 스키마 생성
- JPA가 스키마 validate
- Flyway가 11개 공원 초기 데이터를 적재
- 아래 API가 동작
  - `GET /api/parks`
  - `GET /api/parks/{id}`
  - `GET /api/parks?tag=running`
  - `GET /api/delivery-zones/{zoneId}`
  - `GET /api/delivery-zones/{zoneId}/restaurants`

## 주의
- 현재 데이터는 실제 한강공원 기준의 서비스용 초안 데이터
- 좌표는 공식 한강공원 안내 정보와 지도 서비스 지오코딩을 함께 사용한 대표 위치
- 배달존에는 `sourceType`, `verificationStatus`, `sourceUrl` 등 검수 메타데이터가 포함된다
- 공식 검증 완료 운영 데이터는 아님
- `dev`는 H2, `prod`는 MySQL 전환용 설정이다

## 다음 단계
1. 운영용 데이터 최종 검수
2. MySQL 운영 환경변수 반영
3. 운영 데이터와 초기 seed 분리 여부 결정
4. 프론트 배포 도메인 기준으로 CORS 조정
5. 운영 배포 절차 문서화
