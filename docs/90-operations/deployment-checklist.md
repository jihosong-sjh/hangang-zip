# Deployment Checklist

이 문서는 운영 배포 직전 확인할 체크 항목을 정리한 문서다.

## 프론트
- `npm run build` 성공
- `VITE_PARK_DATA_SOURCE=api` 기준 동작 확인
- `VITE_API_BASE_URL`가 실제 백엔드 주소를 가리키는지 확인
- `VITE_KAKAO_MAP_JS_KEY`가 운영용 JavaScript 키인지 확인
- Kakao Developers에 배포 도메인이 등록되어 있는지 확인
- 모바일 화면에서 필터, 지도, 바텀시트가 정상 동작하는지 확인
- 카카오맵 SDK와 장소 검색이 배포 환경에서 정상 응답하는지 확인

## 백엔드
- `./gradlew test` 성공
- `GET /api/parks` 응답 확인
- `GET /api/parks/{id}` 응답 확인
- `GET /api/parks?tag=running` 응답 확인
- `dev`와 `prod` 프로파일이 의도대로 분리되는지 확인
- CORS `allowed-origin`을 실제 프론트 도메인으로 조정
- `prod`에서 MySQL 연결 성공 여부 확인
- `prod`에서 Flyway migration이 정상 적용되는지 확인
- `prod`에서 초기 데이터 migration이 의도대로 적용되는지 확인

## 데이터
- 서비스용 초안 데이터가 실제 운영 기준에 맞는지 확인
- 공원명, 좌표, 태그, 점수, 편의시설 재검수
  - 좌표는 대표 안내센터 또는 대표 시설 기준인지 확인
- 추천 문구가 실제 서비스 표현으로 적합한지 검수

## 운영 전환
- `prod` 프로파일에서 MySQL 설정 확인
- Flyway migration이 운영 DB에서도 정상 적용되는지 확인
- 운영 DB에 초기 데이터가 Flyway로 적재되는지 확인
- 운영 데이터와 초기 seed를 계속 함께 둘지 결정
- 로그 레벨이 과도하지 않은지 확인

## 문서
- 실행 방법 문서 최신화
- mock 모드와 api 모드 차이 명시
- 현재 데이터가 서비스용 초안 데이터라는 점 명시
