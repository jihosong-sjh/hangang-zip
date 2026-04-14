# API Response Examples

## `GET /api/parks`

```json
{
  "items": [
    {
      "id": "yeouido",
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
      "recommendation": "처음 한강공원을 고를 때 가장 실패 확률이 낮은 선택"
    }
  ],
  "count": 1
}
```

## `GET /api/parks/yeouido`

```json
{
  "id": "yeouido",
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
      "displayPolicy": "public"
    }
  ]
}
```
