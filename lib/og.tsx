import { ImageResponse } from "next/og";
import { getRoute, type RoutePath } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { greekUpper } from "@/lib/utils";
import { OBSIDIAN_950 } from "@/lib/tokens";

/** Facebook and X both read 1200×630; anything else gets cropped by someone. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/**
 * One OG card design, parameterised.
 *
 * The exit gate asks for a **unique** image per route, not eleven designs —
 * so this is the only layout on the site and each route passes its own
 * strings. Titles come from the route manifest rather than being retyped
 * beside the image, so a card cannot end up advertising a heading the page no
 * longer has.
 *
 * Monochrome, on the same `OBSIDIAN_950` literal Tailwind paints the page
 * with (§10.1: tokens only, and this is the token). No emerald — §10.2
 * reserves it for live status dots, and a share card has no live status.
 *
 * `ImageResponse` runs Satori, which supports a deliberately small slice of
 * CSS: flexbox only, no `gap` on some versions, every element needing an
 * explicit `display`. The inline styles below are written for that, not for a
 * browser.
 */
export function ogCard({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: OBSIDIAN_950,
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            fontWeight: 700,
          }}
        >
          {SITE.brand.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.14em",
              color: "#6B7280",
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 62,
              lineHeight: 1.15,
              color: "#FFFFFF",
              fontWeight: 600,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#9CA3AF",
          }}
        >
          {SITE.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** The card for a route in the manifest. Title and label come from there. */
export function routeOgCard(path: RoutePath) {
  const route = getRoute(path);
  return ogCard({ eyebrow: greekUpper(route.label), title: route.title });
}
