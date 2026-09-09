import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint 9 flat config.
 *
 * eslint-config-next 16 ships native flat configs (arrays of Linter.Config),
 * so these are spread directly — the @eslint/eslintrc FlatCompat wrapper is
 * only needed for the older eslintrc-shaped releases.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
