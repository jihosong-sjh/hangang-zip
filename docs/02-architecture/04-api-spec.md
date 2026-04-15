# API Specification

## 문서 목적
이 문서는 `Hangang ZIP vNext`와 `ops.jihosong.com`이 공통으로 사용할 API 구조를 정의한다.

## 설계 원칙
- 초기 전환 단계에서는 기존 `/api/parks` 계열 응답을 최대한 유지한다.
- 신규 기능은 `delivery-zones`, `collections`, `ops` 리소스로 분리한다.
- 공개 API와 운영 API를 구분한다.
- 저신뢰 데이터는 API에서도 visibility 정책으로 제한한다.

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

### `GET /api/parks`
공원 목록 조회

쿼리 파라미터:
- `tag`
- `officialDeliveryOnly`
- `q`
- `sort`

응답 필드:
- 기존 `Park` 구조 유지
- `deliveryZones`는 public visibility 요약 정보만 포함

### `GET /api/parks/{parkSlug}`
공원 상세 조회

응답 필드:
- 공원 기본 정보
- 태그/점수/편의시설
- public/limited 배달존 목록
- 접근 포인트 요약
- 관련 컬렉션

예시:
```json
{
  "id": "yeouido",
  "slug": "yeouido",
  "name": "여의도한강공원",
  "deliveryZones": [
    {
      "id": "yeouido-mulbit-plaza",
      "name": "물빛광장 진입구 옆",
      "sourceType": "official",
      "verificationStatus": "verified",
      "visibility": "public",
      "confidenceScore": 95
    }
  ]
}
```

### `GET /api/delivery-zones`
배달존 목록 조회

쿼리 파라미터:
- `parkSlug`
- `visibility`
- `officialOnly`

응답 목적:
- 공원 상세 내 배달존 리스트
- 운영 화면이 아닌 일반 공개 리스트

### `GET /api/delivery-zones/{zoneId}`
배달존 상세 조회

응답 필드:
- 기본 정보
- address
- landmark
- walkwayNote
- source metadata
- confidence score
- coordinate source
- access point linkage

예시:
```json
{
  "id": "yeouido-mulbit-plaza",
  "parkId": "yeouido",
  "name": "물빛광장 진입구 옆",
  "latitude": 37.5281,
  "longitude": 126.9336,
  "sourceType": "official",
  "verificationStatus": "verified",
  "visibility": "public",
  "confidenceScore": 95,
  "coordinateSource": "manual",
  "landmarkName": "물빛광장 진입부",
  "landmarkNote": "진입구 우측 안내 표지 근처에서 기사와 만나기 쉬움",
  "walkwayNote": "잔디광장 안쪽으로 들어가기 전에 수령 권장",
  "sourceLabel": "미래한강본부 FAQ",
  "sourceUrl": "https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590",
  "lastVerifiedAt": "2026-04-14"
}
```

### `GET /api/delivery-zones/{zoneId}/restaurants`
배달존 기준 주변 맛집 조회

쿼리 파라미터:
- `category`
- `radius`
- `size`
- `sort`

정책:
- public zone만 허용
- 백엔드 캐시 사용 권장

### `GET /api/collections/{slug}`
컬렉션 상세 조회

용도:
- `delivery-friendly`
- `night-view`
- `family-picnic`

## User Input API

### `POST /api/zone-reports`
사용자 현장 제보 등록

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

### `GET /api/ops/zones`
검수용 전체 배달존 목록 조회

쿼리 파라미터:
- `parkId`
- `verificationStatus`
- `visibility`
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
- `visibility`
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
- `GET /api/parks/{id|slug}`

### 신규 프론트 전환 범위
- 배달존 클릭 시 `GET /api/delivery-zones/{zoneId}`
- 맛집 조회 시 `GET /api/delivery-zones/{zoneId}/restaurants`

## 비기능 요구사항
- `GET /api/parks`와 `GET /api/parks/{parkSlug}`는 캐시 친화적으로 유지
- `restaurants` 응답은 provider rate limit을 고려해 TTL 캐시 적용
- visibility가 `ops_only`인 지점은 public API에 절대 노출하지 않음
- 운영 변경 이력은 review 엔티티로 남김

## 권장 구현 순서
1. 기존 parks API 호환 유지
2. delivery zone 상세 API 추가
3. restaurant 조회를 zone 기반 API로 이관
4. ops CRUD API 추가
5. collections API 추가
