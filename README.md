# Hangang ZIP

서울 한강공원 11개를 지도에서 탐색하고, 공원별 배달존과 근처 맛집을 확인하는 MVP 웹앱이다.

현재 상태:
- 프론트: React + TypeScript + Vite
- 지도: Kakao Maps JavaScript SDK
- 백엔드: Spring Boot + `dev(H2)` / `prod(MySQL)` 프로파일 분리
- 데이터: 실제 한강공원 기준 서비스용 초안 데이터 11개
  - 좌표는 공식 페이지의 대표 공원/시설 정보를 바탕으로 지도 서비스에서 보정한 대표 위치
  - 배달존은 `공식 확인 / 검토 필요 후보` 메타데이터를 함께 가진 검수용 초안 데이터

## 프로젝트 구성
```text
.
├── src/                  # 프론트엔드
├── backend-skeleton/     # Spring Boot 백엔드
├── docs/
│   ├── README.md
│   ├── 01-product/
│   ├── 02-architecture/
│   ├── 03-execution/
│   ├── 90-operations/
│   └── 91-data/
└── .env.example
```

## 프론트 실행
의존성 설치:

```bash
npm install
```

`.env.local` 생성:

```env
VITE_PARK_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:8081
VITE_KAKAO_MAP_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

개발 서버 실행:

```bash
npm run dev
```

API 모드 개발 서버 실행:

```bash
npm run dev:api
```

프로덕션 빌드:

```bash
VITE_PARK_DATA_SOURCE=api VITE_API_BASE_URL=https://hangang.jihosong.com VITE_KAKAO_MAP_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY npm run build
```

로컬 확인용 정적 빌드:

```bash
npm run build:local
```

## 실행 모드
### Mock 모드
- `VITE_PARK_DATA_SOURCE=mock`
- 프론트 로컬 데이터(`src/data/parks.ts`) 사용
- `VITE_KAKAO_MAP_JS_KEY` 필요
- UI 개발과 레이아웃 점검에 적합
- 배포 빌드에는 사용하지 않음

### API 모드
- `VITE_PARK_DATA_SOURCE=api`
- `VITE_API_BASE_URL`에 실제 백엔드 주소 지정
- `VITE_KAKAO_MAP_JS_KEY`에 카카오 JavaScript 키 지정
- Spring Boot 백엔드 필요
- 가장 빠른 실행 명령: `npm run dev:api`

자세한 내용:
- [docs/90-operations/frontend-run-modes.md](docs/90-operations/frontend-run-modes.md)

## 백엔드 실행
백엔드는 `dev(H2)`와 `prod(MySQL)`를 모두 지원한다.

```bash
cd backend-skeleton
./scripts/run-dev-local.sh
```

로컬 `prod(MySQL)` 실행:

```bash
docker compose -f backend-skeleton/docker-compose.mysql.yml up -d
cd backend-skeleton
./scripts/run-prod-local.sh
```

기본 주소:
- API: `http://localhost:8081`
- H2 Console: `http://localhost:8081/h2-console`

주요 API:
- `GET /api/parks`
- `GET /api/parks/{id}`
- `GET /api/parks?tag=running`

자세한 백엔드 구조:
- [backend-skeleton/README.md](backend-skeleton/README.md)

## 현재 데이터 상태
현재 프론트와 백엔드가 보여주는 데이터는 실제 한강공원을 기준으로 정리한 서비스용 초안 데이터다.
좌표는 공식 한강공원 안내 페이지의 공원명·대표 시설 정보를 기준으로 지도 서비스에서 보정한 대표 위치다.
배달존은 공식 확인된 지점과 공식 주소/웹 자료를 바탕으로 검토 중인 후보 지점을 함께 포함한다.
근처 맛집은 카카오맵 장소 검색 결과를 보여주며, 실제 배달 가능 여부를 보장하지 않는다.

즉:
- API는 실제로 동작함
- 데이터 내용은 수동 큐레이션 기반이며 공식 검증 완료 운영 데이터는 아님

## 배포 전 확인
배포 전에는 아래를 확인해야 한다.

- 실제 운영 기준으로 좌표/시설/점수 재검수
- 프론트 API base URL 확정
- 백엔드 DB를 `dev(H2)`에서 `prod(MySQL)`로 전환
- CORS origin을 실제 배포 도메인으로 변경
- 운영용 환경변수 정리

체크리스트:
- [docs/90-operations/deployment-checklist.md](docs/90-operations/deployment-checklist.md)

EC2 한 대 배포 가이드:
- [docs/90-operations/aws-ec2-single-server-deploy.md](docs/90-operations/aws-ec2-single-server-deploy.md)

배포 템플릿 파일:
- `deploy/nginx/hangang-zip.conf`
- `deploy/systemd/hangang-backend.service`
- `deploy/env/backend.env.example`
- `deploy/scripts/deploy-frontend.sh`
- `deploy/scripts/deploy-backend.sh`
- `deploy/scripts/install-server-files.sh`

GitHub Actions 배포 가이드:
- [docs/90-operations/github-actions-deploy.md](docs/90-operations/github-actions-deploy.md)
