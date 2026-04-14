/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARK_DATA_SOURCE?: "mock" | "api";
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_KAKAO_MAP_JS_KEY?: string;
  readonly VITE_KAKAO_RESTAURANT_RADIUS?: string;
  readonly VITE_KAKAO_RESTAURANT_LIMIT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  kakao?: {
    maps?: any;
  };
}
