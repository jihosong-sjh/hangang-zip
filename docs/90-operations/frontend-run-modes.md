# Frontend Run Modes

이 문서는 프론트 로컬 실행과 운영 빌드 시점의 모드 차이를 정리한 운영 참고 문서다.

## Overview
The frontend supports two data modes:

- `mock`
  - Uses local data from `src/data/parks.ts`
  - Park and delivery-zone data can be checked without backend
- `api`
  - Loads park data from the Spring Boot backend
  - Requires the backend server to be running

The mode is controlled by Vite environment variables.

## Environment Variables
Create a `.env.local` file in the project root based on `.env.example`.

### Variables
- `VITE_PARK_DATA_SOURCE`
  - `mock` or `api`
- `VITE_API_BASE_URL`
  - Backend base URL
  - Example: `http://localhost:8081`
- `VITE_KAKAO_MAP_JS_KEY`
  - Kakao Maps JavaScript key for map rendering only

## Example: Mock Mode
`.env.local`

```env
VITE_PARK_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:8081
VITE_KAKAO_MAP_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

Run:

```bash
npm run dev
```

Behavior:
- The app reads data from `src/data/parks.ts`
- Filters still work
- Kakao Maps SDK key is still required for the map
- `/parks/:parkSlug`에서는 근처 맛집 조회를 하지 않는다
- `/delivery-zones/:zoneId`의 맛집 목록은 백엔드 `GET /api/delivery-zones/{zoneId}/restaurants`만 사용한다
- 백엔드가 없으면 배달존 상세의 맛집 섹션은 오류 상태로 보인다

## Example: API Mode
`.env.local`

```env
VITE_PARK_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:8081
VITE_KAKAO_MAP_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

Start backend first:

```bash
cd backend-skeleton
./gradlew bootRun --args='--server.port=8081'
```

Then start frontend:

```bash
npm run dev
```

Behavior:
- The app calls:
  - `GET /api/parks`
  - `GET /api/parks/{id}`
  - `GET /api/delivery-zones/{zoneId}`
  - `GET /api/delivery-zones/{zoneId}/restaurants`
- `/parks/:parkSlug`에서는 공원 중심 맛집 기본 검색을 하지 않는다
- 근처 맛집은 배달존 상세에서만 백엔드 API 결과를 사용해 노출된다
- loading/error/empty 상태도 배달존 상세 기준으로 표시된다

## Recommended Local Workflow
### Frontend-only work
Use `mock` mode when:
- adjusting layout
- styling components
- changing basic UI interactions
- 공원 상세와 배달존 카드 UI를 빠르게 확인할 때

### Full integration work
Use `api` mode when:
- testing backend responses
- checking filter requests
- verifying `/delivery-zones/{zoneId}/restaurants`
- preparing for real deployment flow

## Notes
- Restart the Vite dev server after changing `.env.local`
- The current frontend defaults to `mock` mode if `VITE_PARK_DATA_SOURCE` is not set
- The current backend examples use port `8081` to avoid common port conflicts
- Register `http://localhost:5173` and the production domain in Kakao Developers JavaScript domain settings
- Kakao Local REST API key는 프론트가 아니라 백엔드 환경변수(`KAKAO_LOCAL_REST_API_KEY`)로만 관리한다
