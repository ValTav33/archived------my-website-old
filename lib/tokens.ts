/**
 * Token values that are needed OUTSIDE a Tailwind class.
 *
 * Almost every colour in this system is consumed as a utility class and lives
 * only in `tailwind.config.ts`. A handful cannot be: browser metadata takes a
 * string, not a class. Those values are declared here and imported by BOTH
 * the Tailwind config and the consumer, so the two physically cannot drift.
 *
 * This is not a second palette. Add a value here only when something outside
 * CSS genuinely needs it.
 */

/**
 * The page background. Feeds `obsidian.DEFAULT` / `obsidian-950` in Tailwind
 * and the `theme-color` meta tag in `app/layout.tsx`, which paints the mobile
 * browser chrome. If those two disagree the address bar shows a seam against
 * the top of the page.
 */
export const OBSIDIAN_950 = "#08090D";
