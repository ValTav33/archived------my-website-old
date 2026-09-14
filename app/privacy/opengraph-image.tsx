import { OG_CONTENT_TYPE, OG_SIZE, routeOgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Πολιτική Απορρήτου";

export default function Image() {
  return routeOgCard("/privacy");
}
