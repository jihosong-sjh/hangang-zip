const dataSource = process.env.VITE_PARK_DATA_SOURCE;
const apiBaseUrl = process.env.VITE_API_BASE_URL;
const kakaoMapKey = process.env.VITE_KAKAO_MAP_JS_KEY;

if (dataSource !== "api") {
  console.error("Production build requires VITE_PARK_DATA_SOURCE=api.");
  process.exit(1);
}

if (!apiBaseUrl) {
  console.error("Production build requires VITE_API_BASE_URL.");
  process.exit(1);
}

if (!kakaoMapKey) {
  console.error("Production build requires VITE_KAKAO_MAP_JS_KEY.");
  process.exit(1);
}

if (/^https?:\/\/localhost(?::\d+)?$/i.test(apiBaseUrl) || /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i.test(apiBaseUrl)) {
  console.error("Production build cannot use a localhost VITE_API_BASE_URL.");
  process.exit(1);
}
