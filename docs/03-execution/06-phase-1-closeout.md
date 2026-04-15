# Phase 1 Closeout

## 문서 목적
이 문서는 현재 저장소 기준으로 Phase 1 작업 결과를 마감 정리하기 위한 실행 메모다.
설계 문서의 목표 상태가 아니라, 이미 구현된 범위와 아직 남은 간극을 기준으로 기록한다.

## 현재 상태 메모
- 2026-04-15 기준으로 Phase 2의 `P2-1`, `P2-2`, `P2-3`는 후속 작업에서 완료됐다.
- 따라서 아래의 "미구현" 메모 중 `/parks/:parkSlug`, `/delivery-zones/:zoneId`, `park_access_points` public 연결 관련 내용은 현재 코드와 다를 수 있다.

## 1. 이번 단계에서 바뀐 구조

### 백엔드 도메인 구조
- `park_delivery_zones` 중심 구조에서 `delivery_zones` 독립 테이블 구조로 전환했다.
- `delivery_zone_evidences`, `zone_reviews`, `park_access_points` supporting table을 추가했다.
- Flyway migration으로 기존 seed 데이터를 새 구조로 backfill하도록 정리했다.
- JPA entity/repository/service/mapper 계층을 새 스키마 기준으로 교체했다.

현재 핵심 migration:
- `V6__create_delivery_zone_supporting_tables.sql`
- `V7__backfill_delivery_zones_from_legacy.sql`
- `V8__backfill_delivery_zone_evidences.sql`
- `V9__backfill_zone_review_baseline.sql`

### 공개 API 구조
- 기존 `GET /api/parks`와 `GET /api/parks/{id}` 응답 호환을 유지했다.
- public visibility 기준으로만 공원 목록/상세에 배달존을 노출하도록 정리했다.
- 신규 `GET /api/delivery-zones/{zoneId}` 상세 API를 추가했다.
- zone detail 응답에 evidence/review 메타데이터를 포함하도록 확장했다.

### 프론트 구조
- 프론트는 여전히 `MapPage` 단일 진입 구조다.
- 공원 상세는 별도 route가 아니라 단일 화면 내부 상세 fetch 방식이다.
- 맛집 검색은 공원 또는 선택된 배달존 좌표를 anchor로 사용한다.
- Kakao Maps 기반 UI와 바텀시트 구조는 유지되고, API 모드/Mock 모드 실행 분리가 정리되어 있다.

## 2. 아직 남은 기술 부채

### Phase 2 선행 부채
- React Router가 없어 `/parks/:parkSlug`, `/delivery-zones/:zoneId` 공유 URL이 아직 없다.
- 프론트가 `id` 기준으로 공원 상세를 조회하고 있어 `slug` 중심 URL 구조로 전환되지 않았다.
- 맛집 조회가 아직 프론트 직접 호출 구조이며, zone 기준 백엔드 캐시 계층이 없다.

### 모델/명세 부채
- 문서에서는 `visibility` 용어를 쓰지만 실제 구현 필드는 `displayPolicy`다.
- 문서에는 `slug`, `lastVerifiedAt`, `walkwayNote`, `landmarkName` 같은 목표 필드가 많지만 현재 DB/API에는 일부만 반영됐다.
- `park_access_points` 테이블은 생성됐지만 public API/프론트에서는 아직 활용되지 않는다.
- `delivery_zone_polygons`, `restaurant_cache`, `zone_reports`, ops CRUD는 아직 미구현이다.

### 운영 부채
- 데이터 검수 흐름이 여전히 migration + 문서/CSV 중심이다.
- 운영자가 evidence, review, visibility를 수정할 관리 UI가 없다.
- low-confidence / limited 데이터의 UI 표현 규칙이 아직 약하다.

## 3. Phase 2로 넘어가기 전에 확인할 점

1. Phase 2의 기준을 `라우팅/공유 URL 도입`으로 확정할지 먼저 결정해야 한다.
2. 공원 상세 식별자를 `id` 그대로 유지할지, `slug`를 별도 도입할지 정해야 한다.
3. `displayPolicy`와 `visibility` 중 어떤 용어를 코드/문서 표준으로 삼을지 통일이 필요하다.
4. 맛집 조회를 프론트 직접 호출로 유지할지, `GET /api/delivery-zones/{zoneId}/restaurants`로 옮길지 결정해야 한다.
5. limited/ops_only/rejected 데이터의 사용자 노출 규칙을 UI와 API에서 같은 기준으로 맞춰야 한다.
6. seed data와 운영 데이터의 분리 시점을 Phase 2 전에 할지, Ops Console 이후로 미룰지 정해야 한다.

## 4. docs 중 업데이트가 필요한 문서

### 우선 업데이트
- `docs/01-product/01-product-requirements.md`
  - 현재 Phase 구분이 실제 구현 순서와 어긋난다.
  - 문서상 Phase 1에 들어간 `공원 상세 URL`, `기본 SEO`는 아직 미완료다.
- `docs/02-architecture/04-api-spec.md`
  - `GET /api/parks/{parkSlug}` 대신 현재 구현은 `GET /api/parks/{id}`다.
  - 필드명도 `visibility`가 아니라 `displayPolicy` 기준으로 맞춰야 한다.
  - 문서의 `GET /api/delivery-zones`와 `GET /api/delivery-zones/{zoneId}/restaurants`는 아직 미구현이다.
- `docs/02-architecture/03-domain-model-and-erd.md`
  - 목표 ERD와 현재 구현 ERD를 구분해서 써야 한다.
  - 현재 구현된 테이블과 미구현 테이블을 분리 표기하는 편이 안전하다.

### 선택 업데이트
- `README.md`
  - 현재 저장소 상태를 “Phase 1 완료, Phase 2 일부 미시작” 기준으로 한 줄 정리하면 온보딩이 쉬워진다.
- `backend-skeleton/README.md`
  - 현재 동작 API 목록에 `GET /api/delivery-zones/{zoneId}`를 추가하는 편이 맞다.

## 5. 다음 작업 프롬프트 추천

### 추천 1
`Phase 2 시작. React Router를 도입해서 /parks/:parkSlug, /delivery-zones/:zoneId 라우트를 추가하고, 기존 MapPage UX를 최대한 유지한 채 공원 상세/배달존 상세를 URL 기반으로 진입 가능하게 정리해줘. 문서와 타입 정의도 함께 맞춰줘.`

### 추천 2
`문서 정합성 정리. 현재 코드 기준으로 PRD, API spec, domain model 문서에서 구현 완료/미완료를 분리하고, displayPolicy vs visibility 용어를 하나로 통일해줘. 코드 수정은 문서와 충돌하는 최소 범위만 반영해줘.`

### 추천 3
`맛집 조회를 Phase 2 범위로 옮겨줘. GET /api/delivery-zones/{zoneId}/restaurants API를 추가하고, 프론트의 직접 Kakao 장소 검색을 백엔드 경유 구조로 바꿔줘. 캐시 전략과 실패 시 fallback 정책도 문서화해줘.`

## 검증 메모
- 백엔드: `./gradlew test` 통과
- 프론트: `VITE_PARK_DATA_SOURCE=api VITE_API_BASE_URL=https://example.com VITE_KAKAO_MAP_JS_KEY=dummy npm run build` 통과
