# コーディングスタイルガイド

このドキュメントは、プロジェクトのコーディングスタイルとESLint/Prettierの設定について説明します.

## 概要

このプロジェクトでは、ESLintとPrettierを使用してコードの品質とスタイルを保持しています. 設定は`eslint.config.mjs`と`.prettierrc`に定義されています.

## Reactコンポーネントの定義

### コンポーネントの定義スタイル

**関数宣言 (Function Declaration)** を使用してください.

```typescript
// ✅ 正しい
export default function MyComponent() {
  return <div>Hello</div>;
}

// ❌ 間違い（アロー関数は使用しない）
export const MyComponent = () => {
  return <div>Hello</div>;
};
```

**理由:** 関数宣言は、コンポーネントの意図を明確にし、デバッグ時にスタックトレースで名前が表示されやすくなります.

### エクスポートスタイル

#### 通常のコンポーネント（`src/components/`）

**デフォルトエクスポート (Default Export)** を使用してください.

```typescript
// ✅ 正しい
export default function IconCard({ icon, label }: Props) {
  return <div>...</div>;
}
```

#### ページコンポーネント（App Router）

Next.jsのApp Routerの特殊ファイル（`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`など）は、**デフォルトエクスポートが必須**です.

#### その他のファイル

ユーティリティ関数、型定義、定数などは、**名前付きエクスポート (Named Export)** を使用してください.

```typescript
// ✅ 正しい
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const MAX_RETRY_COUNT = 3;
```

## 命名規則

### 型とインターフェース

**PascalCase** を使用してください.

```typescript
type UserProfile = { name: string; age: number };
interface EventData { title: string; date: Date; }
```

### 関数

通常の関数は **camelCase** を使用してください. Reactコンポーネントは **PascalCase** を使用してください.

```typescript
// ✅ 正しい（通常の関数）
function fetchUserData() { }
function validateInput() { }

// ✅ 正しい（Reactコンポーネント）
function IconCard() { return <div>...</div>; }
function UserProfile() { return <div>...</div>; }
```

### 変数

**camelCase** を使用してください.

```typescript
const userName = "John";
let itemCount = 0;
```

### エクスポートされた定数

**UPPER_CASE** を使用してください.

```typescript
export const API_BASE_URL = "https://api.example.com";
export const MAX_UPLOAD_SIZE = 1024 * 1024;
```

### Boolean変数

**is/has/can** のプレフィックスを必須とします.

```typescript
// ✅ 正しい
const isActive = true;
const hasPermission = false;
const canEdit = user.role === "admin";

// ❌ 間違い
const active = true;
const permission = false;
const editable = true;
```

## import順序

importsは以下の順序で並べてください（`simple-import-sort`プラグインが自動的に並べ替えます）:

1. Side effect imports（polyfillなど）
2. React / Next.js
3. 外部ライブラリ
4. 内部エイリアス (`@/`)
5. 相対パス
6. CSS imports

```typescript
// 1. Side effects
import "polyfill";

// 2. React / Next.js
import { useState } from "react";
import Link from "next/link";

// 3. 外部ライブラリ
import axios from "axios";

// 4. 内部エイリアス
import { validateEmail } from "@/lib/validation";
import { UserProfile } from "@/types/user";

// 5. 相対パス
import { helper } from "../utils/helper";
import { config } from "./config";

// 6. CSS
import styles from "./Component.module.css";
```

## 等価演算子

常に **厳密等価演算子 (`===`, `!==`)** を使用してください.

```typescript
// ✅ 正しい
if (value === null) { }
if (count !== 0) { }

// ❌ 間違い
if (value == null) { }
if (count != 0) { }
```

## Prettierの設定

`.prettierrc`で定義されたフォーマットルール:

- **printWidth**: 80文字
- **tabWidth**: 2スペース
- **useTabs**: false（スペースを使用）
- **singleQuote**: false（ダブルクォートを使用）
- **semi**: true（セミコロン必須）
- **trailingComma**: "all"（可能な限りトレーリングカンマを追加）
- **arrowParens**: "always"（アロー関数の引数に常に括弧を使用）

```typescript
// ✅ 正しいフォーマット
const greeting = "Hello, World!";
const numbers = [1, 2, 3];
const user = {
  name: "John",
  age: 30,
};

const add = (a, b) => a + b;
```

## ツールの使用

### リント

```bash
npm run lint         # リントチェックのみ
npm run lint:fix     # 自動修正可能なエラーを修正
```

### フォーマット

```bash
npm run format:check # フォーマットチェックのみ
npm run format       # 自動フォーマット
```

## まとめ

- **Reactコンポーネント**: 関数宣言 + デフォルトエクスポート
- **ユーティリティ関数/定数**: 名前付きエクスポート
- **命名規則**: PascalCase（型）, camelCase（関数/変数）, UPPER_CASE（定数）
- **Boolean変数**: is/has/canプレフィックス必須
- **等価演算子**: 常に `===` / `!==` を使用
- **import順序**: React → 外部 → 内部 → 相対 → CSS

ESLintとPrettierが自動的にこれらのルールを適用しますので、`npm run lint:fix`と`npm run format`を実行して自動修正してください.
