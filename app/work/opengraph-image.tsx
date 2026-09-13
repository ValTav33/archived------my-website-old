import { OG_CONTENT_TYPE, OG_SIZE, routeOgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Ονομαστικά έργα που έχουν παραδοθεί";

export default function Image() {
  return routeOgCard("/work");
}
