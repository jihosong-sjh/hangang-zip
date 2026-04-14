import type { DeliveryZone, Park } from "../types/park";

const SOURCE_CHECKED_AT = "2026-04-14";

function createDeliveryZone(deliveryZone: DeliveryZone): DeliveryZone {
  return deliveryZone;
}

function createUnverifiedZone(params: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  address: string;
  sourceLabel: string;
  sourceUrl: string;
}): DeliveryZone {
  return createDeliveryZone({
    ...params,
    sourceType: "unverified",
    verificationStatus: "needs_review",
    sourceCheckedAt: SOURCE_CHECKED_AT,
    coordinateSource: "manual",
    displayPolicy: "public",
  });
}

function createCommunityVerifiedZone(params: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  address: string;
  sourceLabel: string;
  sourceUrl: string;
}): DeliveryZone {
  return createDeliveryZone({
    ...params,
    sourceType: "community_verified",
    verificationStatus: "needs_review",
    sourceCheckedAt: SOURCE_CHECKED_AT,
    coordinateSource: "manual",
    displayPolicy: "public",
  });
}

function createOfficialZone(params: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  address?: string | null;
  sourceLabel: string;
  sourceUrl: string;
}): DeliveryZone {
  return createDeliveryZone({
    ...params,
    address: params.address ?? null,
    sourceType: "official",
    verificationStatus: "verified",
    sourceCheckedAt: SOURCE_CHECKED_AT,
    coordinateSource: "manual",
    displayPolicy: "public",
  });
}

const officialFaqSource = {
  sourceLabel: "미래한강본부 FAQ",
  sourceUrl: "https://hangang.seoul.go.kr/www/bbsPost/7/479/detail.do?mid=590",
};

export const parks: Park[] = [
  {
    id: "gangseo",
    name: "강서한강공원",
    latitude: 37.58,
    longitude: 126.8197,
    primaryTag: "quiet",
    tags: ["quiet", "picnic", "family"],
    description: "강서습지생태공원과 가족피크닉장을 중심으로 자연 관찰과 한적한 휴식을 즐기기 좋은 공원이다.",
    scores: { running: 4, picnic: 4, quiet: 5, night: 2, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "playground", "sports_facility"],
    recommendation: "습지 생태와 피크닉을 함께 즐기기 좋은 한적한 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "gangseo-eco-gate",
        name: "습지생태 입구 배달 후보",
        latitude: 37.5792,
        longitude: 126.8211,
        description: "공식 배달존 공개 자료는 없고, 공원 대표 주소와 내부 동선을 바탕으로 잡은 수령 후보 지점이다.",
        address: "서울 강서구 양천로27길 279-23",
        sourceLabel: "미래한강본부 강서 소개",
        sourceUrl: "https://hangang.seoul.go.kr/www/contents/675.do?mid=482",
      }),
    ],
  },
  {
    id: "yanghwa",
    name: "양화한강공원",
    latitude: 37.5403,
    longitude: 126.8999,
    primaryTag: "running",
    tags: ["running", "picnic", "night"],
    description: "넓은 잔디밭과 장미길, 자전거도로가 이어져 러닝과 산책을 함께 즐기기 좋은 공원이다.",
    scores: { running: 5, picnic: 4, quiet: 3, night: 4, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "rental_bike", "playground", "sports_facility"],
    recommendation: "장미길과 강변 자전거도로를 따라 달리기 좋은 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "yanghwa-seonyu-bridge",
        name: "선유교 남단 배달 후보",
        latitude: 37.5411,
        longitude: 126.9015,
        description: "공식 배달존 공개 자료는 없고, 공원 대표 주소와 선유교 인근 동선을 바탕으로 잡은 수령 후보 지점이다.",
        address: "서울 영등포구 노들로 221",
        sourceLabel: "미래한강본부 양화 소개",
        sourceUrl: "https://hangang.seoul.go.kr/www/contents/678.do?mid=486",
      }),
    ],
  },
  {
    id: "mangwon",
    name: "망원한강공원",
    latitude: 37.5502,
    longitude: 126.9022,
    primaryTag: "picnic",
    tags: ["picnic", "family", "running"],
    description: "넓은 잔디밭과 산책로가 잘 정리되어 있어 도심에서 가볍게 머물며 쉬기 좋은 공원이다.",
    scores: { running: 4, picnic: 5, quiet: 3, night: 3, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "playground"],
    recommendation: "넓은 잔디에서 돗자리 피크닉을 즐기기 좋은 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "mangwon-seongsan-south",
        name: "망원2주차장 근처 배달 후보",
        latitude: 37.551,
        longitude: 126.9038,
        description: "웹 후기에서 망원2주차장 근처와 잔디광장 인근을 배달 수령 지점으로 안내한 후보다.",
        address: "서울 마포구 합정동 205-5",
        sourceLabel: "웹 검색: 한강공원 밤 산책 코스 추천",
        sourceUrl: "https://ggujundab.tistory.com/entry/%ED%95%9C%EA%B0%95%EA%B3%B5%EC%9B%90-%EB%B0%A4-%EC%82%B0%EC%B1%85-%EC%BD%94%EC%8A%A4-%EC%B6%94%EC%B2%9C-%EB%B0%98%ED%8F%AC%C2%B7%EB%9A%9D%EC%84%AC%C2%B7%EB%A7%9D%EC%9B%90-%EC%A3%BC%EC%B0%A8-%EB%B0%B0%EB%8B%AC-%EC%9D%8C%EC%8B%9D-%EA%BF%80%ED%8C%81",
      }),
    ],
  },
  {
    id: "nanji",
    name: "난지한강공원",
    latitude: 37.5664,
    longitude: 126.8769,
    primaryTag: "family",
    tags: ["family", "picnic", "night"],
    description: "거울분수와 물놀이장, 캠핑장과 연결 동선이 좋아 가족 단위로 오래 머물기 좋은 공원이다.",
    scores: { running: 3, picnic: 5, quiet: 3, night: 4, family: 5 },
    amenities: ["parking", "restroom", "convenience_store", "playground", "cafe"],
    recommendation: "거울분수와 넓은 잔디를 중심으로 가족 나들이에 잘 맞는 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "nanji-mirror-fountain",
        name: "난지캠핑장 입구 배달 후보",
        latitude: 37.5669,
        longitude: 126.8784,
        description: "웹 후기에서 난지캠핑장 입구와 인조잔디축구장 앞을 배달 수령 지점으로 추천한 후보다.",
        address: "서울 마포구 한강난지로 162",
        sourceLabel: "웹 검색: 난지천공원 완전정복",
        sourceUrl:
          "https://workman24.tistory.com/entry/%F0%9F%8F%95%EF%B8%8F-%EC%83%81%EC%95%94-%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B3%B5%EC%9B%90-%EB%82%9C%EC%A7%80%EC%B2%9C%EA%B3%B5%EC%9B%90-%EC%99%84%EC%A0%84%EC%A0%95%EB%B3%B5-%ED%85%90%ED%8A%B8-%EA%B2%B9%EB%B2%9A%EA%BD%83-%ED%8F%AC%ED%86%A0%EC%A1%B4-%EB%B0%B0%EB%8B%AC%EC%A1%B4%EA%B9%8C%EC%A7%80-%EC%B4%9D%EC%A0%95%EB%A6%AC",
      }),
    ],
  },
  {
    id: "yeouido",
    name: "여의도한강공원",
    latitude: 37.5257,
    longitude: 126.9361,
    primaryTag: "picnic",
    tags: ["picnic", "family", "night"],
    description: "넓은 잔디광장과 물빛무대, 샛강 생태공원까지 이어져 머물 거리와 볼거리가 풍부한 대표 공원이다.",
    scores: { running: 4, picnic: 5, quiet: 2, night: 4, family: 5 },
    amenities: ["parking", "restroom", "convenience_store", "cafe", "rental_bike", "playground"],
    recommendation: "잔디광장과 물빛무대를 중심으로 처음 가기 좋은 대표 한강공원",
    deliveryZones: [
      createOfficialZone({
        id: "yeouido-parking-2",
        name: "제2주차장 앞",
        latitude: 37.5272,
        longitude: 126.9329,
        description: "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 공원 내 대표 위치를 기준으로 수동 보정했다.",
        sourceLabel: officialFaqSource.sourceLabel,
        sourceUrl: officialFaqSource.sourceUrl,
      }),
      createOfficialZone({
        id: "yeouido-nadeulmok",
        name: "여의도 나들목 앞",
        latitude: 37.5264,
        longitude: 126.9347,
        description: "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 공원 접근 동선을 기준으로 수동 보정했다.",
        sourceLabel: officialFaqSource.sourceLabel,
        sourceUrl: officialFaqSource.sourceUrl,
      }),
      createOfficialZone({
        id: "yeouido-mulbit-plaza",
        name: "물빛광장 진입구 옆",
        latitude: 37.5281,
        longitude: 126.9336,
        description: "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 물빛광장 진입부를 기준으로 수동 보정했다.",
        sourceLabel: officialFaqSource.sourceLabel,
        sourceUrl: officialFaqSource.sourceUrl,
      }),
    ],
  },
  {
    id: "banpo",
    name: "반포한강공원",
    latitude: 37.5089,
    longitude: 126.9939,
    primaryTag: "night",
    tags: ["night", "picnic", "running"],
    description: "달빛무지개분수와 서래섬, 전망카페가 이어져 저녁 산책과 야경 감상에 강한 공원이다.",
    scores: { running: 4, picnic: 4, quiet: 2, night: 5, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "cafe", "rental_bike", "sports_facility"],
    recommendation: "달빛무지개분수와 서래섬 산책을 함께 즐기기 좋은 공원",
    deliveryZones: [
      createCommunityVerifiedZone({
        id: "banpo-moonlight-plaza",
        name: "반포2주차장 근처 배달 후보",
        latitude: 37.5098,
        longitude: 126.9956,
        description: "서로 다른 웹 출처들이 반포2주차장 근처, 달빛광장 인근, 잠수교 로터리 부근을 배달 수령 지점으로 반복 안내한 후보다.",
        address: "서울 서초구 반포동 115-5",
        sourceLabel: "웹 교차검증: 여행톡톡·By_lee",
        sourceUrl: "https://ggujundab.tistory.com/entry/%ED%95%9C%EA%B0%95%EA%B3%B5%EC%9B%90-%EB%B0%A4-%EC%82%B0%EC%B1%85-%EC%BD%94%EC%8A%A4-%EC%B6%94%EC%B2%9C-%EB%B0%98%ED%8F%AC%C2%B7%EB%9A%9D%EC%84%AC%C2%B7%EB%A7%9D%EC%9B%90-%EC%A3%BC%EC%B0%A8-%EB%B0%B0%EB%8B%AC-%EC%9D%8C%EC%8B%9D-%EA%BF%80%ED%8C%81",
      }),
    ],
  },
  {
    id: "ichon",
    name: "이촌한강공원",
    latitude: 37.5185,
    longitude: 126.9674,
    primaryTag: "running",
    tags: ["running", "quiet", "family"],
    description: "갈대와 억새가 이어지는 산책로와 자연학습장이 있어 조깅과 가족 산책에 모두 잘 맞는 공원이다.",
    scores: { running: 5, picnic: 4, quiet: 4, night: 3, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "playground", "sports_facility"],
    recommendation: "갈대길을 따라 산책과 조깅을 즐기기 좋은 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "ichon-bridge-north",
        name: "한강대교 북단 배달 후보",
        latitude: 37.5193,
        longitude: 126.9688,
        description: "공식 배달존 공개 자료는 없고, 공원 대표 주소와 한강대교 북단 접근 동선을 바탕으로 잡은 수령 후보 지점이다.",
        address: "서울 용산구 이촌로72길 62",
        sourceLabel: "미래한강본부 이촌 소개",
        sourceUrl: "https://hangang.seoul.go.kr/www/contents/660.do?mid=622",
      }),
    ],
  },
  {
    id: "ttukseom",
    name: "뚝섬한강공원",
    latitude: 37.5298,
    longitude: 127.0681,
    primaryTag: "running",
    tags: ["running", "night", "picnic"],
    description: "수변무대와 음악분수, 수영장과 자전거 접근성이 좋아 활동적인 한강 이용에 잘 맞는 공원이다.",
    scores: { running: 5, picnic: 4, quiet: 2, night: 4, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "cafe", "rental_bike", "playground", "sports_facility"],
    recommendation: "수변무대와 자전거 동선을 중심으로 활동적으로 즐기기 좋은 공원",
    deliveryZones: [
      createOfficialZone({
        id: "ttukseom-nadeulmok",
        name: "뚝섬 나들목 앞",
        latitude: 37.5293,
        longitude: 127.0675,
        description: "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 나들목 접근 동선을 기준으로 수동 보정했다.",
        sourceLabel: officialFaqSource.sourceLabel,
        sourceUrl: officialFaqSource.sourceUrl,
      }),
      createOfficialZone({
        id: "ttukseom-information-center",
        name: "뚝섬 안내센터 앞",
        latitude: 37.5311,
        longitude: 127.0678,
        description: "미래한강본부 FAQ에 공개된 공식 배달존이다. 지도 좌표는 안내센터 인근 기준으로 수동 보정했다.",
        sourceLabel: officialFaqSource.sourceLabel,
        sourceUrl: officialFaqSource.sourceUrl,
      }),
    ],
  },
  {
    id: "jamwon",
    name: "잠원한강공원",
    latitude: 37.5251,
    longitude: 127.016,
    primaryTag: "running",
    tags: ["running", "quiet", "family"],
    description: "자전거도로와 육상연습장, 수영장과 테니스장까지 갖춰 운동 목적 방문에 강한 공원이다.",
    scores: { running: 5, picnic: 3, quiet: 4, night: 3, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "playground", "rental_bike", "sports_facility"],
    recommendation: "강남권에서 자전거와 러닝 동선을 길게 즐기기 좋은 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "jamwon-sinsa-nadeulmok",
        name: "신사나들목 배달 후보",
        latitude: 37.5258,
        longitude: 127.0178,
        description: "웹 글과 매거진 기사에서 잠원한강공원 배달존 존재는 반복 언급되지만 정확한 수령 좌표는 확인되지 않아 신사나들목 접근 후보로 남겨둔 지점이다.",
        address: "서울 서초구 잠원로 221-124",
        sourceLabel: "웹 검색: 코스모폴리탄·키자드",
        sourceUrl: "https://www.cosmopolitan.co.kr/article/54601",
      }),
    ],
  },
  {
    id: "jamsil",
    name: "잠실한강공원",
    latitude: 37.5176,
    longitude: 127.0843,
    primaryTag: "family",
    tags: ["family", "picnic", "running"],
    description: "자연형 물놀이장과 자연학습장, 잠실어도가 있어 아이와 함께 반나절 머물기 좋은 공원이다.",
    scores: { running: 4, picnic: 5, quiet: 3, night: 3, family: 5 },
    amenities: ["parking", "restroom", "convenience_store", "playground", "rental_bike", "sports_facility"],
    recommendation: "자연형 물놀이장과 자연학습장을 함께 즐기기 좋은 가족 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "jamsil-eco-garden-gate",
        name: "자연학습장 입구 배달 후보",
        latitude: 37.5187,
        longitude: 127.0859,
        description: "공식 배달존 공개 자료는 없고, 공원 대표 주소와 자연학습장 동선을 바탕으로 잡은 수령 후보 지점이다.",
        address: "서울 송파구 한가람로 65",
        sourceLabel: "미래한강본부 잠실 소개",
        sourceUrl: "https://hangang.seoul.go.kr/www/contents/651.do?mid=444",
      }),
    ],
  },
  {
    id: "gwangnaru",
    name: "광나루한강공원",
    latitude: 37.5409,
    longitude: 127.1157,
    primaryTag: "quiet",
    tags: ["quiet", "picnic", "running"],
    description: "갈대군락과 생태경관 보전지역이 이어져 자연 풍경을 조용히 즐기기 좋은 상류권 공원이다.",
    scores: { running: 4, picnic: 4, quiet: 5, night: 3, family: 4 },
    amenities: ["parking", "restroom", "convenience_store", "playground", "sports_facility"],
    recommendation: "갈대밭과 생태경관을 느끼며 조용히 머물기 좋은 공원",
    deliveryZones: [
      createUnverifiedZone({
        id: "gwangnaru-eco-gate",
        name: "생태공원 입구 배달 후보",
        latitude: 37.5418,
        longitude: 127.1172,
        description: "공식 배달존 공개 자료는 없고, 공원 대표 주소와 생태공원 접근 동선을 바탕으로 잡은 수령 후보 지점이다.",
        address: "서울 강동구 선사로 83-106",
        sourceLabel: "미래한강본부 광나루 소개",
        sourceUrl: "https://hangang.seoul.go.kr/www/contents/645.do?mid=622",
      }),
    ],
  },
];
