# API Specification

## 문서 목적
이 문서는 현재 코드베이스에 구현된 Public API와, 이후 단계에서 추가할 목표 API를 구분해서 정리한다.

## 설계 원칙
- 초기 전환 단계에서는 기존 `/api/parks` 계열 응답을 최대한 유지한다.
- 신규 기능은 `delivery-zones`, `collections`, `ops` 리소스로 분리한다.
- 공개 API와 운영 API를 구분한다.
- 저신뢰 데이터는 API에서도 `displayPolicy` 정책으로 제한한다.

## 응답 원칙

### 목록 응답
```json
{
  "items": [],
  "count": 0
}
```

### 오류 응답
```json
{
  "code": "ZONE_NOT_FOUND",
  "message": "배달존을 찾을 수 없습니다.",
  "timestamp": "2026-04-15T21:00:00+09:00"
}
```

## Public API

### 현재 구현 기준
- `GET /api/parks`
- `GET /api/parks/{id}`
- `GET /api/delivery-zones/{zoneId}`
- 현재 공원 상세 식별자는 `slug`가 아니라 `id`다.
- 현재 seed 데이터에서는 `id`와 `slug` 값이 같지만, public 응답과 프론트 타입은 `id` 기준으로 맞춰져 있다.
- 배달존 정책 필드명은 `visibility`가 아니라 `displayPolicy`다.

### `GET /api/parks`
공원 목록 조회

현재 지원 쿼리 파라미터:
- `tag`

응답 필드:
- 현재 `ParkResponse` 구조 유지
- `deliveryZones`는 공개 가능한 요약 정보만 포함
- 현재 응답에는 `slug`가 없다
- 현재 응답의 배달존 정책 필드는 `displayPolicy`

### `GET /api/parks/{id}`
공원 상세 조회

응답 필드:
- 공원 기본 정보
- 태그/점수/편의시설
- 공개 가능한 배달존 목록

현재 포함되지 않는 항목:
- `slug`
- 접근 포인트 요약
- 관련 컬렉션

예시:
```json
{
  "id": "yeouido",
  "name": "여의도한강공원",
  "primaryTag": "picnic",
  "deliveryZones": [
    {
      "id": "yeouido-mulbit-plaza",
      "name": "물빛광장 진입구 옆",
      "sourceType": "official",
      "verificationStatus": "verified",
      "displayPolicy": "public"
    }
  ]
}
```

### `GET /api/delivery-zones/{zoneId}`
배달존 상세 조회

응답 필드:
- `id`
- `parkId`
- `parkName`
- `name`
- `latitude`
- `longitude`
- `description`
- `address`
- `sourceType`
- `verificationStatus`
- `displayPolicy`
- `confidenceScore`
- `coordinateSource`
- `official`
- `sourceLabel`
- `sourceUrl`
- `sourceCheckedAt`
- `lastReviewedAt`
- `evidences`
- `reviews`

현재 포함되지 않는 항목:
- `landmarkName`
- `landmarkNote`
- `walkwayNote`
- access point linkage

예시:
```json
{
  "id": "yeouido-mulbit-plaza",
  "parkId": "yeouido",
  "parkName": "여의도한강공원",
  "name": "물빛광장 진입구 옆",
  "latitude": 37.5281,
  "longitude": 126.9336,
  "sourceType": "official",
  "verificationStatus": "verified",
  "displayPolicy": "public",
  "confidenceScore": 95,
  "coordinateSource": "manual",
  "official": true,
  "sourceLabel": "미래한강본부 FAQ",
  "sourceUrl": "https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590",
  "sourceCheckedAt": "2026-04-14",
  "lastReviewedAt": "2026-04-15T00:00:00",
  "evidences": [],
  "reviews": []
}
```

## Public API 목표 확장

### `GET /api/delivery-zones`
배달존 목록 조회

상태:
- 미구현

목표 쿼리 파라미터:
- `parkId`
- `displayPolicy`
- `officialOnly`

### `GET /api/delivery-zones/{zoneId}/restaurants`
배달존 기준 주변 맛집 조회

상태:
- 미구현

목표 쿼리 파라미터:
- `category`
- `radius`
- `size`
- `sort`

정책:
- public zone만 허용
- 백엔드 캐시 사용 권장

### `GET /api/collections/{slug}`
컬렉션 상세 조회

상태:
- 미구현

용도:
- `delivery-friendly`
- `night-view`
- `family-picnic`

## User Input API

### `POST /api/zone-reports`
사용자 현장 제보 등록

상태:
- 미구현

요청 예시:
```json
{
  "zoneId": "banpo-moonlight-plaza",
  "reportType": "hard_to_find",
  "message": "기사분이 달빛광장 진입부를 잘 못 찾았습니다."
}
```

응답:
```json
{
  "id": 101,
  "status": "received"
}
```

## Ops API

운영 API는 세션 또는 토큰 기반 인증을 전제로 한다.

아래 항목은 모두 목표 확장 범위이며 현재 미구현이다.

### `GET /api/ops/zones`
검수용 전체 배달존 목록 조회

쿼리 파라미터:
- `parkId`
- `verificationStatus`
- `displayPolicy`
- `minConfidence`

### `GET /api/ops/zones/{zoneId}`
검수 상세 조회

포함 정보:
- zone 기본 정보
- evidence 목록
- review history
- user report 요약

### `POST /api/ops/zones`
배달존 생성

### `PATCH /api/ops/zones/{zoneId}`
배달존 수정

수정 가능 필드:
- `name`
- `latitude`
- `longitude`
- `displayPolicy`
- `verificationStatus`
- `confidenceScore`
- `landmarkName`
- `landmarkNote`
- `walkwayNote`

### `POST /api/ops/zones/{zoneId}/evidences`
근거 자료 추가

### `POST /api/ops/zones/{zoneId}/reviews`
검수 기록 추가

### `POST /api/ops/zones/{zoneId}/publish`
공개 정책 변경

## 프론트 전환 가이드

### 기존 프론트 유지 범위
- `GET /api/parks`
- `GET /api/parks/{id}`

### 신규 프론트 전환 범위
- 배달존 클릭 시 `GET /api/delivery-zones/{zoneId}`
- 맛집 조회 시 `GET /api/delivery-zones/{zoneId}/restaurants`
- 공원 공유 URL은 프론트 라우팅에서 `/parks/:parkSlug`로 도입하더라도, 현재 백엔드 상세 API 계약은 `id` 기준임

## 비기능 요구사항
- `GET /api/parks`와 `GET /api/parks/{id}`는 캐시 친화적으로 유지
- `restaurants` 응답은 provider rate limit을 고려해 TTL 캐시 적용
- `displayPolicy`가 `ops_only`인 지점은 public API에 절대 노출하지 않음
- 운영 변경 이력은 review 엔티티로 남김

## 권장 구현 순서
1. 기존 parks API 호환 유지
2. delivery zone 상세 API 추가
3. restaurant 조회를 zone 기반 API로 이관
4. ops CRUD API 추가
5. collections API 추가
