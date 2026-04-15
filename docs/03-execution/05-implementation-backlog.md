# Implementation Backlog

## 문서 목적
이 문서는 현재 코드베이스를 기준으로 실제 구현 순서를 정리한 실행 백로그다.

## 구현 원칙
- 데이터 신뢰도를 올리는 작업을 UI 확장보다 먼저 한다.
- 기존 서비스 동작을 깨지 않는 thin slice부터 구현한다.
- `hangang.jihosong.com` 단독 확장보다 운영 도구와 데이터 구조를 먼저 만든다.

## Phase 0. 문서와 기준선 고정

### P0-1. 문서 구조 정리
- 완료 기준:
  - `docs` 읽기 순서와 폴더 구조 정리
  - 제품/설계/실행 문서 확정

### P0-2. 현재 데이터 분류 기준 고정
- 작업:
  - 공식/후보/비공개 정의
  - confidence score 기준표 확정
- 완료 기준:
  - 운영자가 같은 기준으로 검수 가능

## Phase 1. 도메인 모델 재구성

### P1-1. DB 스키마 확장
- `parks.slug`, `parks.status`
- `delivery_zones`
- `delivery_zone_evidences`
- `zone_reviews`
- `park_access_points`

완료 기준:
- 기존 seed 데이터 이관 가능
- 기존 `parks` API 응답 유지 가능

### P1-2. seed/migration 재작성
- 기존 `park_delivery_zones`를 독립 테이블로 이관
- 검수 CSV의 근거 데이터를 evidence/review에 반영

완료 기준:
- dev/prod 모두 마이그레이션 성공
- 여의도/뚝섬 공식 지점이 confidence score와 함께 조회됨

### P1-3. 백엔드 조회 레이어 교체
- repository/service/mapper를 새 스키마 기준으로 교체
- public visibility만 프론트 응답으로 노출

완료 기준:
- 현재 프론트 화면이 깨지지 않음
- `./gradlew test` 통과

## Phase 2. `hangang.jihosong.com` vNext

### P2-1. 라우팅 도입
- React Router 도입
- `/parks/:parkSlug`
- `/delivery-zones/:zoneId`
- 상태:
  - 완료
- 구현 메모:
  - `MapPage` 단일 UX를 유지한 채 URL을 상태의 기준값으로 사용
  - 직접 진입, 새로고침, 뒤로가기/앞으로가기 복원 동작 확인

완료 기준:
- 공원/배달존 공유 URL 가능

### P2-2. 공원 상세 페이지화
- 단일 맵 화면을 유지하되 park detail route 추가
- 공원별 설명, 접근 포인트, 배달존 섹션 분리
- 상태:
  - 완료
- 구현 메모:
  - `parkSlug -> parkId` 해석은 `GET /api/parks` 응답의 `slug`를 기준으로 단일화
  - public park detail 응답에 `slug`, `accessPoints`를 추가하고 `GET /api/parks/{id}` 호환 유지

완료 기준:
- 공원별 개별 landing 가능

### P2-3. 배달존 상세 페이지화
- 배달존 상세 API 연결
- source, 확인일, landmark, walkway note 노출
- 상태:
  - 완료
- 구현 메모:
  - `/delivery-zones/:zoneId` 진입 시 zone detail을 먼저 불러오고 `parkId`로 공원 상세를 이어서 로드
  - evidence/review 메타데이터로 공식 지점과 후보 지점 차이를 바텀시트에서 분명히 표시

완료 기준:
- 후보 지점과 공식 지점 차이가 명확하게 드러남

### P2-4. 맛집 조회 로직 교체
- 공원 중심 검색을 기본값에서 제거
- 배달존 선택 기반 검색으로 변경
- 백엔드 경유 캐시 도입

완료 기준:
- “배달존 기준 근처 맛집”이 일관되게 제공됨

### P2-5. 공개 정책 UI 반영
- `public`, `limited`, `ops_only` 표현
- low-confidence 경고문

완료 기준:
- 사용자 혼동 감소

## Phase 3. 운영 도구

### P3-1. `ops.jihosong.com` 스캐폴딩
- 인증
- zone list
- pending review list

### P3-2. zone 검수 화면
- 좌표 수정
- evidence 추가
- review note 작성
- visibility 변경

### P3-3. user report 처리
- 신고/제보 리스트
- 상태 변경

완료 기준:
- 공개 서비스 데이터가 문서가 아니라 운영 UI에서 관리됨

## Phase 4. 성장 구조

### P4-1. SEO 기초
- title/description
- OG
- sitemap
- canonical
- breadcrumb

### P4-2. 컬렉션 페이지
- `delivery-friendly`
- `family-picnic`
- `night-view`

### P4-3. `today.jihosong.com` 오픈
- 테마별 추천
- 공원 추천에서 실행 서비스로 이동

완료 기준:
- 검색 유입과 공유 유입이 서비스 밖에서 만들어짐

## 가장 먼저 구현할 thin slice
이번 저장소에서 바로 시작할 1차 구현은 아래가 적절하다.

1. DB 스키마에 `delivery_zones` 독립 테이블 도입
2. 기존 `/api/parks` 응답은 유지
3. `GET /api/delivery-zones/{zoneId}` 추가
4. 프론트에 `/parks/:parkSlug`, `/delivery-zones/:zoneId` 라우트 추가
5. 배달존 상세에서만 맛집 조회

이 5개가 끝나면:
- 구조는 앞으로 확장 가능해지고
- 사용자 경험은 즉시 개선되며
- 운영 도구를 붙일 수 있는 기반이 생긴다.

## 우선순위 요약

### Must
- 스키마 분리
- visibility/confidence 모델 도입
- 공원/배달존 URL 도입
- zone 기준 맛집 조회

### Should
- ops 검수 화면
- access point 모델
- 컬렉션 페이지

### Later
- user account
- 저장/즐겨찾기
- 고급 개인화 추천

## 완료 정의
- 문서가 코드보다 뒤처지지 않는다.
- low-confidence 데이터는 무조건 공개되지 않는다.
- 공원/배달존 페이지가 독립 URL을 가진다.
- 운영자가 CSV 없이 검수 가능하다.
- 프론트 빌드와 백엔드 테스트가 기본 기준으로 유지된다.
