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
- `GET /api/delivery-zones/{zoneId}/restaurants`
- 공원 상세 API 식별자는 여전히 `id`다.
- 프론트 라우트 `/parks/:parkSlug`는 `GET /api/parks` 응답의 `slug`로 `id`를 해석한 뒤 `GET /api/parks/{id}`를 호출한다.
- 배달존 정책 필드명은 `visibility`가 아니라 `displayPolicy`다.

### 공개 정책 규칙
- `displayPolicy = public`
  - 사용자 화면에 일반 공개
- `displayPolicy = limited`
  - 사용자 화면에 공개되지만 경고형 배지와 low-confidence 안내 문구를 함께 노출
- `displayPolicy = ops_only`
  - public API와 사용자 화면에서 숨김
- `verificationStatus = rejected`
  - `displayPolicy`와 무관하게 public API와 사용자 화면에서 숨김
- low-confidence 경고 기준
  - `displayPolicy = limited` 또는 `confidenceScore < 70`

### `GET /api/parks`
공원 목록 조회

현재 지원 쿼리 파라미터:
- `tag`

응답 필드:
- 현재 `ParkResponse` 구조 유지
- `slug` 포함
- `deliveryZones`는 공개 가능한 요약 정보만 포함
- 각 `deliveryZones` 항목에는 `displayPolicy`, `confidenceScore`가 포함된다.
- `accessPoints` 필드는 존재하지만 목록 응답에서는 빈 배열로 유지
- 현재 응답의 배달존 정책 필드는 `displayPolicy`

### `GET /api/parks/{id}`
공원 상세 조회

응답 필드:
- 공원 기본 정보
- `slug`
- 태그/점수/편의시설
- `accessPoints`
- 공개 가능한 배달존 목록

현재 포함되지 않는 항목:
- 관련 컬렉션

예시:
```json
{
  "id": "gangseo",
  "slug": "gangseo",
  "name": "강서한강공원",
  "primaryTag": "quiet",
  "accessPoints": [
    {
      "id": 1,
      "type": "entrance",
      "name": "강서습지생태공원 입구",
      "address": "서울 강서구 양천로27길 279-23"
    }
  ],
  "deliveryZones": [
    {
      "id": "gangseo-eco-gate",
      "name": "습지생태 입구 배달 후보",
      "sourceType": "unverified",
      "verificationStatus": "needs_review",
      "displayPolicy": "limited",
      "confidenceScore": 45
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

프론트 사용 방식:
- `/delivery-zones/:zoneId` 직접 진입 시 먼저 이 API를 호출한다.
- 응답의 `parkId`로 같은 공원의 `GET /api/parks/{id}`를 이어서 호출해 지도 컨텍스트와 바텀시트 공원 정보를 복원한다.

현재 포함되지 않는 항목:
- `landmarkName`
- `landmarkNote`
- `walkwayNote`
- access point linkage

예시:
```json
{
  "id": "gangseo-eco-gate",
  "parkId": "gangseo",
  "parkName": "강서한강공원",
  "name": "습지생태 입구 배달 후보",
  "latitude": 37.5792,
  "longitude": 126.8211,
  "sourceType": "unverified",
  "verificationStatus": "needs_review",
  "displayPolicy": "limited",
  "confidenceScore": 45,
  "coordinateSource": "manual",
  "official": false,
  "sourceLabel": "미래한강본부 강서 소개",
  "sourceUrl": "https://hangang.seoul.go.kr/www/contents/675.do?mid=482",
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
- 구현됨

현재 쿼리 파라미터:
- 없음

정책:
- `public` 또는 `limited`인 공개 zone만 허용
- 좌표 anchor는 요청 zone의 `latitude`, `longitude`를 사용
- 프론트 `/parks/:parkSlug`에서는 호출하지 않고 `/delivery-zones/:zoneId`에서만 호출
- 프론트는 별도 SDK fallback 없이 이 API 응답만 사용

provider / cache 정책:
- provider: Kakao Local REST API category search (`FD6`, distance sort)
- success 결과 TTL: 10분
- empty 결과 TTL: 3분
- stale fallback 허용: 1시간
- provider 실패 시 stale cache가 있으면 `200 OK` + `"stale": true`
- provider 실패 시 stale cache가 없으면 `502 Bad Gateway`

응답 예시:
```json
{
  "zoneId": "yeouido-mulbit-plaza",
  "stale": false,
  "cachedAt": "2026-04-15T21:00:00",
  "items": [
    {
      "id": "123",
      "name": "한강치킨",
      "latitude": 37.5283,
      "longitude": 126.9338,
      "address": "서울 영등포구 여의동로 330",
      "categoryName": "음식점 > 치킨",
      "distance": 180,
      "phone": "02-000-0000",
      "placeUrl": "https://place.map.kakao.com/123"
    }
  ],
  "count": 1
}
```

오류 예시 (`502`):
```json
{
  "code": "RESTAURANT_PROVIDER_UNAVAILABLE",
  "message": "Kakao Local provider request failed.",
  "timestamp": "2026-04-15T21:00:00"
}
```

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
- 공원 공유 URL은 `/parks/:parkSlug`를 사용하되, 실제 상세 fetch는 `GET /api/parks`의 `slug`를 `id`로 해석한 뒤 `GET /api/parks/{id}`로 연결
- 공원 상세(`/parks/:parkSlug`)에서는 공원 중심 맛집 검색 기본값을 두지 않는다
- 배달존 상세(`/delivery-zones/:zoneId`)에서만 "이 배달존 기준 근처 맛집" 섹션을 노출한다

## 비기능 요구사항
- `GET /api/parks`와 `GET /api/parks/{id}`는 캐시 친화적으로 유지
- `restaurants` 응답은 provider rate limit을 고려해 인메모리 TTL 캐시 적용
- `restaurants` 캐시 정책은 `success=10m`, `empty=3m`, `stale=1h`
- `displayPolicy`가 `ops_only`인 지점은 public API에 절대 노출하지 않음
- 운영 변경 이력은 review 엔티티로 남김

## 권장 구현 순서
1. 기존 parks API 호환 유지
2. delivery zone 상세 API 추가
3. restaurant 조회를 zone 기반 API로 이관
4. ops CRUD API 추가
5. collections API 추가
