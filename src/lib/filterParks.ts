import type { Park, ParkTag } from "../types/park";

export function filterParks(parks: Park[], selectedTag: ParkTag | null) {
  if (!selectedTag) {
    return parks;
  }

  return parks.filter((park) => park.tags.includes(selectedTag));
}
