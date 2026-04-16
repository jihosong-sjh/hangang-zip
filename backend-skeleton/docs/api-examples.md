# API Response Examples

## `GET /api/parks`

```json
{
  "items": [
    {
      "id": "yeouido",
      "slug": "yeouido",
      "name": "여의도한강공원",
      "latitude": 37.5287,
      "longitude": 126.9349,
      "primaryTag": "picnic",
      "tags": ["picnic", "family", "night"],
      "description": "대표적인 한강공원으로 접근성이 좋고 머물 거리도 많다.",
      "scores": {
        "running": 4,
        "picnic": 5,
        "quiet": 2,
        "night": 4,
        "family": 5
      },
      "amenities": ["parking", "restroom", "convenience_store", "cafe", "rental_bike"],
      "recommendation": "처음 한강공원을 고를 때 가장 실패 확률이 낮은 선택",
      "deliveryZones": [],
      "accessPoints": []
    }
  ],
  "count": 1
}
```

## `GET /api/parks/yeouido`

```json
{
  "id": "yeouido",
  "slug": "yeouido",
  "name": "여의도한강공원",
  "latitude": 37.5287,
  "longitude": 126.9349,
  "primaryTag": "picnic",
  "tags": ["picnic", "family", "night"],
  "description": "대표적인 한강공원으로 접근성이 좋고 머물 거리도 많다.",
  "scores": {
    "running": 4,
    "picnic": 5,
    "quiet": 2,
    "night": 4,
    "family": 5
  },
  "amenities": ["parking", "restroom", "convenience_store", "cafe", "rental_bike"],
  "recommendation": "처음 한강공원을 고를 때 가장 실패 확률이 낮은 선택",
  "accessPoints": [
    {
      "id": 5,
      "type": "station",
      "name": "여의나루역 방향 진입로",
      "latitude": 37.5271,
      "longitude": 126.9327,
      "address": "서울 영등포구 여의동로 330",
      "note": "대중교통 접근 시 가장 설명하기 쉬운 대표 진입 포인트"
    }
  ],
  "deliveryZones": [
    {
      "id": "yeouido-mulbit-plaza",
      "name": "물빛광장 진입구 옆",
      "latitude": 37.5281,
      "longitude": 126.9336,
      "description": "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 물빛광장 진입부를 기준으로 수동 보정했다.",
      "address": null,
      "sourceType": "official",
      "verificationStatus": "verified",
      "sourceLabel": "미래한강본부 FAQ",
      "sourceUrl": "https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590",
      "sourceCheckedAt": "2026-04-14",
      "coordinateSource": "manual",
      "displayPolicy": "public",
      "confidenceScore": 95
    }
  ]
}
```

## `GET /api/delivery-zones/yeouido-mulbit-plaza`

```json
{
  "id": "yeouido-mulbit-plaza",
  "parkId": "yeouido",
  "parkName": "여의도한강공원",
  "name": "물빛광장 진입구 옆",
  "latitude": 37.5281,
  "longitude": 126.9336,
  "description": "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 물빛광장 진입부를 기준으로 수동 보정했다.",
  "address": null,
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
  "evidences": [
    {
      "id": 1,
      "sourceType": "official",
      "sourceLabel": "미래한강본부 FAQ",
      "sourceUrl": "https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590",
      "sourceExcerpt": null,
      "checkedAt": "2026-04-14",
      "evidenceScore": 95,
      "primary": true
    }
  ],
  "reviews": [
    {
      "id": 1,
      "reviewStatus": "approved",
      "reviewNote": "Migrated from legacy park_delivery_zones metadata",
      "reviewedBy": "system_migration",
      "reviewedAt": "2026-04-15T00:00:00",
      "resultConfidenceScore": 95
    }
  ]
}
```

## `GET /api/delivery-zones/yeouido-mulbit-plaza/restaurants`

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
