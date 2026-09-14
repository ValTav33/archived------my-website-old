import { OG_CONTENT_TYPE, OG_SIZE, routeOgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Πώς τιμολογούμε και τι μετακινεί το κόστος";

export default function Image() {
  return routeOgCard("/pricing");
}
