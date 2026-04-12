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
  "recommendation": "처음 한강공원을 고를 때 가장 실패 확률이 낮은 선택"
}
```
