# GitHub Actions 배포 가이드

이 문서는 GitHub Actions 기반 CI/CD 설정과 운영 전제 조건을 정리한 문서다.

이 프로젝트는 아래 브랜치 전략을 기준으로 CI/CD를 나눈다.

- `dev`
  - 개발 통합 브랜치
  - push/PR 시 테스트와 빌드만 수행
- `main`
  - 운영 배포 브랜치
  - push 시 테스트 후 EC2 자동 배포

## 워크플로 파일

- [dev-ci.yml](../../.github/workflows/dev-ci.yml)
- [main-deploy.yml](../../.github/workflows/main-deploy.yml)

## 동작 방식

### dev
- 프론트 `npm ci`
- 프론트 `npm run build:local`
- 백엔드 `./gradlew test`

### main
- 프론트 운영 빌드
- 백엔드 테스트
- 백엔드 `bootJar`
- SSH로 EC2 접속
- 프론트 정적 파일 업로드
- 백엔드 jar 업로드
- `hangang-backend` 재시작

## 필요한 GitHub Secrets

리포지토리 `Settings -> Secrets and variables -> Actions`에 아래 값을 등록한다.

- `EC2_HOST`
  - 예: `12.34.56.78`
- `EC2_USER`
  - 예: `ubuntu`
- `EC2_SSH_KEY`
  - EC2 접속용 private key 전체 내용
- `PROD_APP_ORIGIN`
  - 예: `https://hangang.jihosong.com`
- `KAKAO_MAP_JS_KEY`
  - Kakao Developers JavaScript 키

## 전제 조건

EC2에는 아래가 이미 준비돼 있어야 한다.

- nginx 설정 적용
- `hangang-backend` systemd 서비스 등록
- `/var/www/hangang-zip`
- `/home/ubuntu/apps/hangang-zip/backend`
- `/home/ubuntu/apps/hangang-zip/backend/.env`

관련 템플릿:
- [deploy/nginx/hangang-zip.conf](../../deploy/nginx/hangang-zip.conf)
- [deploy/systemd/hangang-backend.service](../../deploy/systemd/hangang-backend.service)
- [deploy/env/backend.env.example](../../deploy/env/backend.env.example)

## 추천 운영 방식

1. 기능 개발은 `feature/*`
2. `dev`로 머지
3. `dev`에서 테스트 통과 확인
4. `main`으로 머지
5. `main` push 후 자동 배포 확인

## 주의

- `main` 배포 전에 EC2 `.env`가 올바른지 먼저 확인해야 한다.
- 프론트 운영 빌드는 `PROD_APP_ORIGIN`과 `KAKAO_MAP_JS_KEY`를 사용하므로 둘 다 비어 있으면 안 된다.
- `KAKAO_MAP_JS_KEY`를 발급한 Kakao Developers 앱에 운영 도메인을 JavaScript 허용 도메인으로 등록해야 한다.
- `main` 배포 워크플로는 EC2 서버 상태를 직접 바꾸므로 `main` 브랜치 보호를 권장한다.
