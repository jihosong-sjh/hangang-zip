# Docs Index

이 디렉터리는 `Hangang ZIP`의 기획, 설계, 실행, 운영 문서를 성격별로 분리해 관리한다.

## 읽는 순서
아래 5개 문서는 이번 서비스 보완/확장 작업의 기본 읽기 순서다.

1. [01-product/01-product-requirements.md](01-product/01-product-requirements.md)
2. [01-product/02-information-architecture.md](01-product/02-information-architecture.md)
3. [02-architecture/03-domain-model-and-erd.md](02-architecture/03-domain-model-and-erd.md)
4. [02-architecture/04-api-spec.md](02-architecture/04-api-spec.md)
5. [03-execution/05-implementation-backlog.md](03-execution/05-implementation-backlog.md)

## 폴더 구조

### `01-product`
- 서비스 목표, 문제 정의, 사용자, 범위
- 정보 구조, 서브도메인 역할, 페이지 구조

### `02-architecture`
- 데이터 모델, ERD, API 명세
- 기존 시스템에서 목표 구조로 전환하는 참고 문서

### `03-execution`
- 구현 순서, 백로그, 마일스톤, 완료 기준

### `90-operations`
- 실행 모드, 배포, 운영 체크리스트, GitHub Actions, EC2 가이드

### `91-data`
- 검수 템플릿, 운영용 CSV/원천 데이터 참고 자료

## 현재 기준 문서
- 제품 요구사항: [01-product/01-product-requirements.md](01-product/01-product-requirements.md)
- 정보 구조: [01-product/02-information-architecture.md](01-product/02-information-architecture.md)
- 도메인 모델: [02-architecture/03-domain-model-and-erd.md](02-architecture/03-domain-model-and-erd.md)
- API 명세: [02-architecture/04-api-spec.md](02-architecture/04-api-spec.md)
- 구현 백로그: [03-execution/05-implementation-backlog.md](03-execution/05-implementation-backlog.md)

## 운영/참고 문서
- 실행 모드: [90-operations/frontend-run-modes.md](90-operations/frontend-run-modes.md)
- 배포 체크리스트: [90-operations/deployment-checklist.md](90-operations/deployment-checklist.md)
- GitHub Actions 배포: [90-operations/github-actions-deploy.md](90-operations/github-actions-deploy.md)
- EC2 단일 서버 배포: [90-operations/aws-ec2-single-server-deploy.md](90-operations/aws-ec2-single-server-deploy.md)
- Go-live 체크리스트: [90-operations/ops-go-live-checklist.md](90-operations/ops-go-live-checklist.md)
- 기존 백엔드 전환 메모: [02-architecture/backend-transition.md](02-architecture/backend-transition.md)
- 배달존 검수 템플릿: [91-data/delivery-zone-review-template.csv](91-data/delivery-zone-review-template.csv)
