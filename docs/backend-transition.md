# Frontend Mock to Spring Boot + MySQL Transition

## Goal
- Keep the current frontend `Park` shape as stable as possible.
- Replace local mock imports with API fetches with minimal UI changes.
- Start with a small REST API:
  - `GET /api/parks`
  - `GET /api/parks/{id}`

## Current Frontend Shape
The frontend currently expects:

```ts
type Park = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  primaryTag: "running" | "picnic" | "quiet" | "night" | "family";
  tags: ParkTag[];
  description: string;
  scores: {
    running: number;
    picnic: number;
    quiet: number;
    night: number;
    family: number;
  };
  amenities: AmenityType[];
  recommendation: string;
};
```

## Backend Design Direction
- Keep the API response close to the frontend `Park` type.
- Store fixed score columns directly on `parks`.
- Store `tags` and `amenities` as separate collection tables.
- Keep recommendation as a stored text field for now.
- Recommendation labels derived from scores can remain frontend logic for MVP.

## Suggested Package Structure
```text
backend-skeleton/src/main/java/com/hangangzip/park
├── controller
├── domain
├── dto
├── repository
└── service
```

## Entity Model
- `ParkEntity`
  - basic park info
  - score columns
  - `primaryTag`
  - `tags`
  - `amenities`
  - `recommendation`
- `ParkTag`
  - enum
- `AmenityType`
  - enum

## API Shape
### `GET /api/parks`
- Supports optional query param:
  - `tag`
- Returns a list of park summary items.

### `GET /api/parks/{id}`
- Returns a full park detail item.

For MVP, summary and detail can share the same DTO shape if desired.

## Frontend Change Points
Current frontend directly imports:
- `src/data/parks.ts`

To switch to backend:
1. Add a data access layer such as `src/lib/parkApi.ts`
2. Replace direct mock import inside `MapPage`
3. Load parks with `fetch("/api/parks")`
4. Keep `filterParks` only as a fallback or remove it once server filtering is active
5. Keep `getParkRecommendationLabels` unchanged because it already works from the returned `Park` shape

### Current code path
- `src/pages/MapPage.tsx`
  - imports `parks` from `src/data/parks.ts`

### Suggested target code path
- `src/pages/MapPage.tsx`
  - calls `getParks(selectedTag)`
- `src/lib/parkApi.ts`
  - fetch wrapper

## Minimal Frontend Fetch Layer
```ts
export async function getParks(tag?: ParkTag | null): Promise<Park[]> {
  const url = tag ? `/api/parks?tag=${tag}` : "/api/parks";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load parks");
  }

  return response.json();
}
```

## Migration Sequence
1. Build backend API using the skeleton in `backend-skeleton/`
2. Seed MySQL with the current 11 park rows
3. Expose `GET /api/parks` and `GET /api/parks/{id}`
4. Add frontend fetch layer
5. Replace mock import in `MapPage`
6. Remove or archive `src/data/parks.ts` after API is stable
