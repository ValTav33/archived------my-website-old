import { OG_CONTENT_TYPE, OG_SIZE, routeOgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Tavlikos Systems — Web development & AI automations";

export default function Image() {
  return routeOgCard("/");
}
