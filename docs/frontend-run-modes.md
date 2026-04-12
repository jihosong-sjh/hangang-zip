# Frontend Run Modes

## Overview
The frontend supports two data modes:

- `mock`
  - Uses local data from `src/data/parks.ts`
  - No backend required
- `api`
  - Loads park data from the Spring Boot backend
  - Requires the backend server to be running

The mode is controlled by Vite environment variables.

## Environment Variables
Create a `.env.local` file in the project root based on `.env.example`.

### Variables
- `VITE_PARK_DATA_SOURCE`
  - `mock` or `api`
- `VITE_API_BASE_URL`
  - Backend base URL
  - Example: `http://localhost:8081`

## Example: Mock Mode
`.env.local`

```env
VITE_PARK_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:8081
```

Run:

```bash
npm run dev
```

Behavior:
- The app reads data from `src/data/parks.ts`
- Filters still work
- No backend connection is required

## Example: API Mode
`.env.local`

```env
VITE_PARK_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:8081
```

Start backend first:

```bash
cd backend-skeleton
./gradlew bootRun --args='--server.port=8081'
```

Then start frontend:

```bash
npm run dev
```

Behavior:
- The app calls:
  - `GET /api/parks`
  - `GET /api/parks?tag=running`
- Loading and error states are shown in the UI

## Recommended Local Workflow
### Frontend-only work
Use `mock` mode when:
- adjusting layout
- styling components
- changing basic UI interactions

### Full integration work
Use `api` mode when:
- testing backend responses
- checking filter requests
- preparing for real deployment flow

## Notes
- Restart the Vite dev server after changing `.env.local`
- The current frontend defaults to `mock` mode if `VITE_PARK_DATA_SOURCE` is not set
- The current backend examples use port `8081` to avoid common port conflicts
