import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js + TypeScript + Prettier（整形系を全部off）
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ),

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
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      /* export 方針 */
      "import/no-default-export": "error",

      /* 命名規則 */
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "function",
          format: ["camelCase"],
        },
        {
          selector: "variable",
          format: ["camelCase"],
        },
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["UPPER_CASE"],
        },
      ],

      /* boolean 変数 */
      "id-match": [
        "error",
        "^(is|has|can)[A-Z].*",
        {
          onlyDeclarations: true,
          properties: false,
        },
      ],

      /* import順 */
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // side effect import（polyfillなど）
            ["^\\u0000"],

            // React / Next.js
            ["^react", "^next"],

            // 外部ライブラリ
            ["^@?\\w"],

            // 内部エイリアス
            ["^@/"],

            // 相対パス
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./"],

            // CSS
            ["^.+\\.css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      /* 等価演算子 */
      eqeqeq: ["error", "always"],

      /* React コンポーネント定義 */
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
        },
      ],
    },
  },

  // page.tsx だけ default export を許可
  {
    files: ["**/page.tsx"],
    rules: {
      "import/no-default-export": "off",
    },
  },
];

export default eslintConfig;
