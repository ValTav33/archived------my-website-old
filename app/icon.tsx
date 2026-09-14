import { ImageResponse } from "next/og";
import { OBSIDIAN_950 } from "@/lib/tokens";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The favicon.
 *
 * Also a measured fix rather than a nicety: Best Practices has read **96** in
 * both previous phases for exactly one reason — a `404 /favicon.ico` console
 * error — and `PROGRESS.md` records that deduction twice. This is the slice
 * that removes it.
 *
 * Monochrome on the same `OBSIDIAN_950` literal Tailwind paints the page
 * with, so the mark reads against a dark tab strip and introduces no colour
 * (§10.1 tokens only, §10.2 one accent and this is not it). A single `T`
 * rather than `TS`, because two letters in a 32px square are two smudges.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: OBSIDIAN_950,
          color: "#FFFFFF",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        T
      </div>
    ),
    size,
  );
}
