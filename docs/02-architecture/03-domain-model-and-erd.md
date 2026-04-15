# Domain Model And ERD

## 문서 목적
이 문서는 현재 공원 내부에 임베디드된 배달존 모델을 운영 가능한 독립 도메인 모델로 확장하기 위한 목표 구조를 정의한다.

## 현재 구조의 한계
- `park_delivery_zones`가 공원 종속 컬렉션이라 운영 속성이 빠르게 늘어나기 어렵다.
- evidence, confidence score, polygon, access point, user report를 자연스럽게 연결하기 어렵다.
- 공개/비공개 정책과 검수 이력을 엔티티 차원에서 관리하기 어렵다.

## 목표 설계 원칙
- 배달존은 공원 내부 필드가 아니라 독립 엔티티다.
- 공개 데이터와 운영 데이터는 같은 엔티티를 공유하되 visibility 정책으로 분리한다.
- 출처와 검수 이력은 별도 테이블로 관리한다.
- 지도 좌표 외에 polygon, landmark, 접근 팁을 지원한다.
- 현재 프론트 호환을 위해 `GET /api/parks` 응답은 한동안 유지할 수 있어야 한다.

## 핵심 엔티티

### Park
- 공원의 기본 정보
- 검색, 추천, 컬렉션 진입의 기본 단위

### DeliveryZone
- 배달 수령 위치의 핵심 엔티티
- 공식/후보/커뮤니티 검증 여부, confidence score, visibility를 포함

### DeliveryZoneEvidence
- 출처 URL, 발췌 문구, evidence type, 확인일 저장

### DeliveryZonePolygon
- 점 좌표 외에 다각형이나 범위형 존을 표현

### ParkAccessPoint
- 나들목, 주차장, 안내센터, 진입구 등 접근 포인트

### RestaurantCache
- 배달존 기준 주변 맛집 캐시

### ZoneReport
- 사용자 현장 제보

### ZoneReview
- 운영 검수 기록

## 권장 필드

### `parks`
- `id`
- `slug`
- `name`
- `latitude`
- `longitude`
- `primary_tag`
- `description`
- `recommendation`
- `status`

### `delivery_zones`
- `id`
- `park_id`
- `slug`
- `name`
- `latitude`
- `longitude`
- `address`
- `landmark_name`
- `landmark_note`
- `walkway_note`
- `source_type`
- `verification_status`
- `visibility`
- `confidence_score`
- `coordinate_source`
- `is_official`
- `last_verified_at`
- `expires_at`

### `delivery_zone_evidences`
- `id`
- `delivery_zone_id`
- `source_type`
- `source_label`
- `source_url`
- `source_excerpt`
- `checked_at`
- `evidence_score`

### `delivery_zone_polygons`
- `id`
- `delivery_zone_id`
- `geojson`
- `version`
- `created_at`

### `park_access_points`
- `id`
- `park_id`
- `name`
- `type`
- `latitude`
- `longitude`
- `address`
- `note`

### `restaurant_cache`
- `id`
- `delivery_zone_id`
- `provider`
- `provider_place_id`
- `name`
- `category_name`
- `latitude`
- `longitude`
- `distance_meters`
- `place_url`
- `updated_at`

### `zone_reports`
- `id`
- `delivery_zone_id`
- `report_type`
- `message`
- `status`
- `created_at`

### `zone_reviews`
- `id`
- `delivery_zone_id`
- `review_status`
- `review_note`
- `reviewed_by`
- `reviewed_at`

## ERD

```mermaid
erDiagram
    PARK ||--o{ DELIVERY_ZONE : contains
    PARK ||--o{ PARK_ACCESS_POINT : has
    DELIVERY_ZONE ||--o{ DELIVERY_ZONE_EVIDENCE : backed_by
    DELIVERY_ZONE ||--o{ DELIVERY_ZONE_POLYGON : defines
    DELIVERY_ZONE ||--o{ RESTAURANT_CACHE : caches
    DELIVERY_ZONE ||--o{ ZONE_REPORT : receives
    DELIVERY_ZONE ||--o{ ZONE_REVIEW : reviewed_in

    PARK {
        string id PK
        string slug
        string name
        decimal latitude
        decimal longitude
        string primary_tag
        string status
    }

    DELIVERY_ZONE {
        string id PK
        string park_id FK
        string slug
        string name
        decimal latitude
        decimal longitude
        string source_type
        string verification_status
        string visibility
        int confidence_score
        string coordinate_source
        boolean is_official
    }

    DELIVERY_ZONE_EVIDENCE {
        long id PK
        string delivery_zone_id FK
        string source_type
        string source_label
        string source_url
        date checked_at
        int evidence_score
    }

    DELIVERY_ZONE_POLYGON {
        long id PK
        string delivery_zone_id FK
        text geojson
        int version
    }

    PARK_ACCESS_POINT {
        long id PK
        string park_id FK
        string type
        string name
        decimal latitude
        decimal longitude
    }

    RESTAURANT_CACHE {
        long id PK
        string delivery_zone_id FK
        string provider
        string provider_place_id
        string name
        int distance_meters
        datetime updated_at
    }

    ZONE_REPORT {
        long id PK
        string delivery_zone_id FK
        string report_type
        string status
        datetime created_at
    }

    ZONE_REVIEW {
        long id PK
        string delivery_zone_id FK
        string review_status
        string reviewed_by
        datetime reviewed_at
    }
```

## enum 권장안

### `source_type`
- `official`
- `community_verified`
- `unverified`

### `verification_status`
- `verified`
- `needs_review`
- `rejected`
- `expired`

### `visibility`
- `public`
- `limited`
- `ops_only`

### `coordinate_source`
- `official`
- `geocoded`
- `manual`
- `community_refined`

## 공개 정책 규칙
- `public`
  - 공식 또는 운영상 공개 가능한 고신뢰 지점
- `limited`
  - 후보지만 공개 가치가 있어 안내는 하되 강한 주의 문구 필요
- `ops_only`
  - 내부 검수 전용

## confidence score 가이드
- `90~100`
  - 공식 문서 또는 공식 지도에서 직접 확인
- `70~89`
  - 독립 출처 2개 이상 교차 검증
- `40~69`
  - 단일 출처 또는 주소/랜드마크 정황만 확인
- `0~39`
  - 내부 초안, 공개 비권장

## 현재 코드베이스 전환 전략

### Step 1. 호환성 유지
- 기존 `parks` 응답의 `deliveryZones` 배열은 유지한다.
- 내부 구현만 독립 테이블 조회로 바꾼다.

### Step 2. 운영 필드 확장
- 현재 CSV의 `evidence_count`, `is_delivery_zone_explicit`, `review_note`를 evidence/review 테이블로 이관한다.

### Step 3. 상세 도메인 추가
- `park_access_points`
- `delivery_zone_polygons`
- `zone_reports`

### Step 4. 공개 정책 강화
- 저신뢰 지점은 `ops_only` 또는 `limited`로 운영한다.

## 권장 마이그레이션 순서
1. `parks`에 `slug`, `status` 추가
2. `delivery_zones` 독립 테이블 생성
3. 기존 `park_delivery_zones` 데이터를 이관
4. evidence/review 테이블 생성 후 CSV 이관
5. API mapper를 새 구조에 맞게 교체
6. 프론트는 점진적으로 `zoneId` 기반 상세 조회 도입
