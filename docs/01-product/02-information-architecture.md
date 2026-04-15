# Information Architecture

## 문서 목적
이 문서는 `hangang.jihosong.com` 본 서비스와 연계 서비스들의 정보 구조, 라우팅 구조, 서브도메인 역할을 정의한다.

## 서비스 맵

### `hangang.jihosong.com`
- 역할: 실행 서비스
- 목적: 공원 선택, 배달존 탐색, 현장 사용
- 핵심 가치: 정확한 위치와 실제 방문 맥락 제공

### `today.jihosong.com`
- 역할: 발견/유입 허브
- 목적: 오늘 갈 곳 추천, 의도형 진입, 콘텐츠 랜딩
- 핵심 가치: 검색 유입과 재방문 확대

### `ops.jihosong.com`
- 역할: 내부 운영 도구
- 목적: 배달존과 검수 데이터 관리
- 핵심 가치: 공개 데이터 신뢰도 유지

## 권장 사용자 흐름

### Flow A. 공원 미정 사용자
1. `today.jihosong.com`에서 목적 기반 콘텐츠 진입
2. 적합한 공원 추천 카드 확인
3. 공원 상세 CTA로 `hangang.jihosong.com/parks/:parkSlug` 이동
4. 배달존과 맛집 확인

### Flow B. 특정 공원 방문 예정 사용자
1. 검색 또는 공유 링크로 `hangang.jihosong.com/parks/:parkSlug` 진입
2. 배달존 목록 확인
3. 배달존 상세 진입
4. 랜드마크/접근 팁 확인
5. 주변 맛집 선택

### Flow C. 운영 검수자
1. `ops.jihosong.com/zones/pending` 진입
2. evidence와 좌표 검토
3. confidence score 조정
4. `public` 또는 `ops_only` 공개 정책 설정

## `hangang.jihosong.com` 사이트맵

### 핵심 페이지
- `/`
  - 오늘의 추천
  - 활동별 진입
  - 배달 가능한 공원 빠른 진입
- `/parks`
  - 공원 목록
  - 필터: 활동, 가족, 야경, 배달존 신뢰도
- `/parks/:parkSlug`
  - 공원 상세
  - 배달존 목록
  - 접근 포인트
  - 편의시설
  - 추천 방문 포인트
- `/delivery-zones/:zoneId`
  - 배달존 단일 상세
  - 지도
  - 랜드마크
  - 기사에게 전달할 문구
  - 근처 맛집
- `/collections/:slug`
  - 테마 랜딩 페이지
  - 예: `family-picnic`, `night-view`, `delivery-friendly`

### 보조 페이지
- `/about`
- `/faq`
- `/data-policy`

## `today.jihosong.com` 사이트맵
- `/`
  - 오늘의 추천
  - 목적 기반 진입
- `/themes/:slug`
  - 야경, 데이트, 가족, 산책, 러닝
- `/guides/:slug`
  - 준비물, 시간대 추천, 계절별 추천
- `/collections/:slug`
  - 의도형 SEO 랜딩

## `ops.jihosong.com` 사이트맵
- `/`
  - 운영 대시보드
- `/zones`
  - 전체 배달존 목록
- `/zones/pending`
  - 검토 대기 목록
- `/zones/:zoneId`
  - 배달존 검수 상세
- `/parks/:parkId`
  - 공원별 데이터 관리
- `/reports`
  - 사용자 제보 관리

## 내비게이션 원칙

### Public Navigation
- 상단 1차 메뉴는 `공원`, `배달존`, `테마 추천`, `가이드` 정도로 제한한다.
- 지도는 핵심 컴포넌트지만 전체 구조를 지도 중심으로만 만들지 않는다.
- 공원 상세와 배달존 상세는 별도 URL을 가진다.

### Context Navigation
- 공원 상세에서는 배달존과 접근 포인트를 같은 맥락에서 보여준다.
- 배달존 상세에서는 공원으로 돌아가는 링크를 항상 유지한다.
- `today.jihosong.com` 콘텐츠는 반드시 `hangang.jihosong.com` 실행 페이지로 내려가야 한다.

## URL 규칙
- slug는 영문 소문자와 하이픈 사용
- 공원 slug 예시:
  - `yeouido`
  - `ttukseom`
  - `banpo`
- collection slug 예시:
  - `delivery-friendly`
  - `family-picnic`
  - `night-view`

## 콘텐츠 블록 구조

### Park Page
- Hero
- 핵심 태그
- 추천 이유
- 공식 배달존 요약
- 접근 포인트
- 편의시설
- 시간대/분위기 안내
- 관련 컬렉션 링크

### Delivery Zone Page
- 신뢰도 배지
- 지도 위치
- 랜드마크 설명
- 주소/좌표
- 확인일/출처
- 주변 맛집
- 주의사항

### Collection Page
- 주제 설명
- 추천 공원 목록
- 비교 포인트
- 관련 가이드 링크

## 검색/SEO 구조
- 공원별 상세 페이지는 indexable URL로 운영
- 컬렉션 페이지는 의도형 검색 유입용으로 운영
- FAQ, breadcrumb, organization/collection structured data를 우선 고려
- 제목과 설명은 페이지 단위로 개별 설정
- sitemap은 `hangang.jihosong.com`과 `today.jihosong.com` 각각 분리

## 정보 구조 원칙
- 탐색 구조는 `공원 -> 배달존 -> 맛집`의 실행 흐름을 기본으로 한다.
- 성장 구조는 `콘텐츠/추천 -> 공원 상세`의 유입 흐름을 별도로 둔다.
- 운영 구조는 `서비스 UI`와 완전히 분리한다.
- 낮은 신뢰도의 데이터는 URL이 있어도 검색 노출을 제한할 수 있도록 설계한다.
