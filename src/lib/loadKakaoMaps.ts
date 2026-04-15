const SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js";

export type KakaoMapsSdk = {
  maps: any;
};

let sdkPromise: Promise<KakaoMapsSdk> | null = null;

function getSdkKey() {
  const sdkKey = import.meta.env.VITE_KAKAO_MAP_JS_KEY;

  if (!sdkKey) {
    throw new Error("VITE_KAKAO_MAP_JS_KEY 가 설정되지 않았습니다.");
  }

  return sdkKey;
}

function buildSdkUrl() {
  const params = new URLSearchParams({
    appkey: getSdkKey(),
    autoload: "false",
  });

  return `${SDK_URL}?${params.toString()}`;
}

export async function loadKakaoMaps(): Promise<KakaoMapsSdk> {
  if (window.kakao?.maps?.Map) {
    return window.kakao as KakaoMapsSdk;
  }

  if (sdkPromise) {
    return sdkPromise;
  }

  sdkPromise = new Promise<KakaoMapsSdk>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-kakao-maps-sdk='true']",
    );

    const finalizeLoad = () => {
      const maps = window.kakao?.maps;

      if (!maps?.load) {
        reject(new Error("카카오맵 SDK를 초기화하지 못했습니다."));
        return;
      }

      maps.load(() => {
        if (!window.kakao?.maps?.Map) {
          reject(new Error("카카오맵 SDK를 초기화하지 못했습니다."));
          return;
        }

        resolve(window.kakao as KakaoMapsSdk);
      });
    };

    const handleError = () => {
      reject(new Error("카카오맵 SDK 스크립트를 불러오지 못했습니다."));
    };

    if (existingScript) {
      if (window.kakao?.maps?.Map) {
        resolve(window.kakao as KakaoMapsSdk);
        return;
      }

      if (window.kakao?.maps?.load) {
        finalizeLoad();
        return;
      }

      existingScript.addEventListener("load", finalizeLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = buildSdkUrl();
    script.async = true;
    script.defer = true;
    script.dataset.kakaoMapsSdk = "true";
    script.addEventListener("load", finalizeLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise!;
}
