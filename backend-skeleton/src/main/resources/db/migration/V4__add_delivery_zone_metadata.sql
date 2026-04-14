ALTER TABLE park_delivery_zones ADD COLUMN address VARCHAR(255);
ALTER TABLE park_delivery_zones ADD COLUMN source_type VARCHAR(30) NOT NULL DEFAULT 'unverified';
ALTER TABLE park_delivery_zones ADD COLUMN verification_status VARCHAR(30) NOT NULL DEFAULT 'needs_review';
ALTER TABLE park_delivery_zones ADD COLUMN source_label VARCHAR(100) NOT NULL DEFAULT '서비스 초안 데이터';
ALTER TABLE park_delivery_zones ADD COLUMN source_url VARCHAR(500) NOT NULL DEFAULT 'https://hangang.seoul.go.kr/www/park/list.do?mid=426';
ALTER TABLE park_delivery_zones ADD COLUMN source_checked_at DATE NOT NULL DEFAULT '2026-04-14';
ALTER TABLE park_delivery_zones ADD COLUMN coordinate_source VARCHAR(30) NOT NULL DEFAULT 'manual';
ALTER TABLE park_delivery_zones ADD COLUMN display_policy VARCHAR(30) NOT NULL DEFAULT 'public';

UPDATE park_delivery_zones
SET
    name = '습지생태 입구 배달 후보',
    description = '공식 배달존 공개 자료는 없고, 공원 대표 주소와 내부 동선을 바탕으로 잡은 수령 후보 지점이다.',
    address = '서울 강서구 양천로27길 279-23',
    source_label = '미래한강본부 강서 소개',
    source_url = 'https://hangang.seoul.go.kr/www/contents/675.do?mid=482'
WHERE park_id = 'gangseo';

UPDATE park_delivery_zones
SET
    name = '선유교 남단 배달 후보',
    description = '공식 배달존 공개 자료는 없고, 공원 대표 주소와 선유교 인근 동선을 바탕으로 잡은 수령 후보 지점이다.',
    address = '서울 영등포구 노들로 221',
    source_label = '미래한강본부 양화 소개',
    source_url = 'https://hangang.seoul.go.kr/www/contents/678.do?mid=486'
WHERE park_id = 'yanghwa';

UPDATE park_delivery_zones
SET
    name = '망원2주차장 근처 배달 후보',
    description = '웹 후기에서 망원2주차장 근처와 잔디광장 인근을 배달 수령 지점으로 안내한 후보다.',
    address = '서울 마포구 합정동 205-5',
    source_label = '웹 검색: 한강공원 밤 산책 코스 추천',
    source_url = 'https://ggujundab.tistory.com/entry/%ED%95%9C%EA%B0%95%EA%B3%B5%EC%9B%90-%EB%B0%A4-%EC%82%B0%EC%B1%85-%EC%BD%94%EC%8A%A4-%EC%B6%94%EC%B2%9C-%EB%B0%98%ED%8F%AC%C2%B7%EB%9A%9D%EC%84%AC%C2%B7%EB%A7%9D%EC%9B%90-%EC%A3%BC%EC%B0%A8-%EB%B0%B0%EB%8B%AC-%EC%9D%8C%EC%8B%9D-%EA%BF%80%ED%8C%81'
WHERE park_id = 'mangwon';

UPDATE park_delivery_zones
SET
    name = '난지캠핑장 입구 배달 후보',
    description = '웹 후기에서 난지캠핑장 입구와 인조잔디축구장 앞을 배달 수령 지점으로 추천한 후보다.',
    address = '서울 마포구 한강난지로 162',
    source_label = '웹 검색: 난지천공원 완전정복',
    source_url = 'https://workman24.tistory.com/entry/%F0%9F%8F%95%EF%B8%8F-%EC%83%81%EC%95%94-%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B3%B5%EC%9B%90-%EB%82%9C%EC%A7%80%EC%B2%9C%EA%B3%B5%EC%9B%90-%EC%99%84%EC%A0%84%EC%A0%95%EB%B3%B5-%ED%85%90%ED%8A%B8-%EA%B2%B9%EB%B2%9A%EA%BD%83-%ED%8F%AC%ED%86%A0%EC%A1%B4-%EB%B0%B0%EB%8B%AC%EC%A1%B4%EA%B9%8C%EC%A7%80-%EC%B4%9D%EC%A0%95%EB%A6%AC'
WHERE park_id = 'nanji';

UPDATE park_delivery_zones
SET
    name = '반포2주차장 근처 배달 후보',
    description = '서로 다른 웹 출처들이 반포2주차장 근처, 달빛광장 인근, 잠수교 로터리 부근을 배달 수령 지점으로 반복 안내한 후보다.',
    address = '서울 서초구 반포동 115-5',
    source_type = 'community_verified',
    source_label = '웹 교차검증: 여행톡톡·By_lee',
    source_url = 'https://ggujundab.tistory.com/entry/%ED%95%9C%EA%B0%95%EA%B3%B5%EC%9B%90-%EB%B0%A4-%EC%82%B0%EC%B1%85-%EC%BD%94%EC%8A%A4-%EC%B6%94%EC%B2%9C-%EB%B0%98%ED%8F%AC%C2%B7%EB%9A%9D%EC%84%AC%C2%B7%EB%A7%9D%EC%9B%90-%EC%A3%BC%EC%B0%A8-%EB%B0%B0%EB%8B%AC-%EC%9D%8C%EC%8B%9D-%EA%BF%80%ED%8C%81'
WHERE park_id = 'banpo';

UPDATE park_delivery_zones
SET
    name = '한강대교 북단 배달 후보',
    description = '공식 배달존 공개 자료는 없고, 공원 대표 주소와 한강대교 북단 접근 동선을 바탕으로 잡은 수령 후보 지점이다.',
    address = '서울 용산구 이촌로72길 62',
    source_label = '미래한강본부 이촌 소개',
    source_url = 'https://hangang.seoul.go.kr/www/contents/660.do?mid=622'
WHERE park_id = 'ichon';

UPDATE park_delivery_zones
SET
    name = '신사나들목 배달 후보',
    description = '웹 글과 매거진 기사에서 잠원한강공원 배달존 존재는 반복 언급되지만 정확한 수령 좌표는 확인되지 않아 신사나들목 접근 후보로 남겨둔 지점이다.',
    address = '서울 서초구 잠원로 221-124',
    source_label = '웹 검색: 코스모폴리탄·키자드',
    source_url = 'https://www.cosmopolitan.co.kr/article/54601'
WHERE park_id = 'jamwon';

UPDATE park_delivery_zones
SET
    name = '자연학습장 입구 배달 후보',
    description = '공식 배달존 공개 자료는 없고, 공원 대표 주소와 자연학습장 동선을 바탕으로 잡은 수령 후보 지점이다.',
    address = '서울 송파구 한가람로 65',
    source_label = '미래한강본부 잠실 소개',
    source_url = 'https://hangang.seoul.go.kr/www/contents/651.do?mid=444'
WHERE park_id = 'jamsil';

UPDATE park_delivery_zones
SET
    name = '생태공원 입구 배달 후보',
    description = '공식 배달존 공개 자료는 없고, 공원 대표 주소와 생태공원 접근 동선을 바탕으로 잡은 수령 후보 지점이다.',
    address = '서울 강동구 선사로 83-106',
    source_label = '미래한강본부 광나루 소개',
    source_url = 'https://hangang.seoul.go.kr/www/contents/645.do?mid=622'
WHERE park_id = 'gwangnaru';

DELETE FROM park_delivery_zones WHERE zone_id IN ('yeouido-event-plaza', 'ttukseom-jabeolle');

INSERT INTO park_delivery_zones (
    park_id,
    zone_id,
    name,
    latitude,
    longitude,
    description,
    address,
    source_type,
    verification_status,
    source_label,
    source_url,
    source_checked_at,
    coordinate_source,
    display_policy
) VALUES
    (
        'yeouido',
        'yeouido-parking-2',
        '제2주차장 앞',
        37.5272000,
        126.9329000,
        '미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 공원 내 대표 위치를 기준으로 수동 보정했다.',
        NULL,
        'official',
        'verified',
        '미래한강본부 FAQ',
        'https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590',
        '2026-04-14',
        'manual',
        'public'
    ),
    (
        'yeouido',
        'yeouido-nadeulmok',
        '여의도 나들목 앞',
        37.5264000,
        126.9347000,
        '미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 공원 접근 동선을 기준으로 수동 보정했다.',
        NULL,
        'official',
        'verified',
        '미래한강본부 FAQ',
        'https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590',
        '2026-04-14',
        'manual',
        'public'
    ),
    (
        'yeouido',
        'yeouido-mulbit-plaza',
        '물빛광장 진입구 옆',
        37.5281000,
        126.9336000,
        '미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 물빛광장 진입부를 기준으로 수동 보정했다.',
        NULL,
        'official',
        'verified',
        '미래한강본부 FAQ',
        'https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590',
        '2026-04-14',
        'manual',
        'public'
    ),
    (
        'ttukseom',
        'ttukseom-nadeulmok',
        '뚝섬 나들목 앞',
        37.5293000,
        127.0675000,
        '미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 나들목 접근 동선을 기준으로 수동 보정했다.',
        NULL,
        'official',
        'verified',
        '미래한강본부 FAQ',
        'https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590',
        '2026-04-14',
        'manual',
        'public'
    ),
    (
        'ttukseom',
        'ttukseom-information-center',
        '뚝섬 안내센터 앞',
        37.5311000,
        127.0678000,
        '미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 안내센터 인근 기준으로 수동 보정했다.',
        NULL,
        'official',
        'verified',
        '미래한강본부 FAQ',
        'https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590',
        '2026-04-14',
        'manual',
        'public'
    );
