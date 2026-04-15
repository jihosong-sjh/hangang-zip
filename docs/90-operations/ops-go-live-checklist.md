# Ops Go-Live Checklist

이 문서는 배포 직후 smoke test와 운영 설정을 빠르게 점검하기 위한 체크리스트다.

## 1. GitHub Actions Secrets
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`
- `PROD_APP_ORIGIN`
- `KAKAO_MAP_JS_KEY`

## 2. Kakao Developers
- 앱 생성 또는 운영용 앱 선택
- JavaScript 키 확인
- 플랫폼 설정에서 아래 도메인 등록
- `http://localhost:5173`
- `https://hangang.jihosong.com`

## 3. Frontend Build Inputs
- `VITE_PARK_DATA_SOURCE=api`
- `VITE_API_BASE_URL=https://hangang.jihosong.com`
- `VITE_KAKAO_MAP_JS_KEY=<운영 JavaScript 키>`

## 4. Backend Runtime Checks
- `SPRING_PROFILES_ACTIVE=prod`
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `APP_CORS_ALLOWED_ORIGIN=https://hangang.jihosong.com`
- `KAKAO_LOCAL_REST_API_KEY=<운영 REST API 키>`
- `KAKAO_LOCAL_SUCCESS_TTL=10m`, `KAKAO_LOCAL_EMPTY_TTL=3m`, `KAKAO_LOCAL_STALE_TTL=1h`
- Flyway migration 적용 여부 확인

## 5. Smoke Test
- 메인 페이지 접속
- 지도 로드 성공
- 공원 선택 시 상세 바텀시트 노출
- 배달존 선택 시 지도 포커스 이동
- `/parks/:parkSlug`에서 맛집 섹션 미노출 확인
- `/delivery-zones/:zoneId`에서 근처 맛집 목록 노출
- 카카오맵 상세 링크 이동
- `GET /api/parks`
- `GET /api/parks/yeouido`
- `GET /api/delivery-zones/yeouido-mulbit-plaza`
- `GET /api/delivery-zones/yeouido-mulbit-plaza/restaurants`

## 6. Failure Clues
- 지도가 비면 `VITE_KAKAO_MAP_JS_KEY`와 허용 도메인 먼저 확인
- 맛집 검색이 실패하면 백엔드 `KAKAO_LOCAL_REST_API_KEY`, provider 502 로그, stale cache 존재 여부를 먼저 확인
- 공원 상세에 배달존이 비면 `V3__add_delivery_zones.sql` 적용 여부 확인
