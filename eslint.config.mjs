import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const namingConventionBase = [
  "error",
  {
    selector: "typeLike",
    format: ["PascalCase"],
  },
  {
    // Allow PascalCase for React components (functions that return JSX)
    selector: "function",
    format: ["camelCase", "PascalCase"],
  },
  {
    selector: "variable",
    format: ["camelCase"],
  },
  {
    // 例外: export const myFunction = () => {} は camelCase
    selector: "variable",
    modifiers: ["const", "exported"],
    types: ["function"],
    format: ["camelCase"],
  },
  {
    // Boolean variables must use is/has/can prefix
    selector: "variable",
    types: ["boolean"],
    format: ["camelCase", "PascalCase"],
    prefix: ["is", "has", "can"],
  },
];

const eslintConfig = [
  // Next.js + TypeScript + Prettier（整形系を全部off）
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  // 無視対象
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // 共通ルール（意味・規約のみ）
  {
    files: ["**/*.{ts,tsx}"],
    // enable type-aware linting for TypeScript files
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      /* Export policy */
      "import/no-default-export": "error",

      /* Naming conventions */
      "@typescript-eslint/naming-convention": namingConventionBase,

      /* Import order */
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports (polyfills, etc.)
            ["^\\u0000"],

            // React / Next.js
            ["^react", "^next"],

            // External libraries
            ["^@?\\w"],

            // Internal aliases
            ["^@/"],

            // Relative paths
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./"],

            // CSS
            ["^.+\\.css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      /* Equality operators */
      eqeqeq: ["error", "always"],

      /* React component definition */
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
        },
      ],
    },
  },

  // Naming conventions specific to src/lib/constants.ts
  {
    files: ["src/lib/constants.ts"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        ...namingConventionBase,
        {
          // エクスポートされる定数は UPPER_CASE (例: export const API_ENDPOINTS = ...)
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["UPPER_CASE"],
        },
      ],
    },
  },

  // Allow default exports for Next.js App Router files
  {
    files: [
      "**/page.tsx",
      "**/layout.tsx",
      "**/loading.tsx",
      "**/error.tsx",
      "**/not-found.tsx",
      "**/template.tsx",
      "**/default.tsx",
      "**/route.ts",
      "**/route.tsx",
      "next.config.ts",
      "next.config.mjs",
      "src/middleware.ts",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
];

export default eslintConfig;
