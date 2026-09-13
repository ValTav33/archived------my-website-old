import { OG_CONTENT_TYPE, OG_SIZE, routeOgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Κατασκευή ιστοσελίδων και web εφαρμογών σε Next.js";

export default function Image() {
  return routeOgCard("/websites");
}
