# Coding Style Guide

This document explains the project's coding style and ESLint/Prettier configuration.

## Overview

This project uses ESLint and Prettier to maintain code quality and style. The configuration is defined in `eslint.config.mjs` and `.prettierrc`.

## React Component Definition

### Component Definition Style

Use **Function Declarations**.

```typescript
// ✅ Correct
export function MyComponent() {
  return <div>Hello</div>;
}

// ❌ Incorrect (do not use arrow functions)
export const MyComponent = () => {
  return <div>Hello</div>;
};
```

**Reason:** Function declarations make the component's intent clear and make the name more visible in stack traces during debugging.

### Export Style

#### Regular Components (`src/components/`)

Use **Named Exports**.

```typescript
// ✅ Correct
export function IconCard({ icon, label }: Props) {
  return <div>...</div>;
}
```

#### Page Components (App Router)

Next.js App Router special files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc.) **require default exports**.

#### Other Files

For utility functions, type definitions, constants, etc., use **Named Exports**.

```typescript
// ✅ Correct
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const MAX_RETRY_COUNT = 3;
```

## Naming Conventions

### Types and Interfaces

Use **PascalCase**.

```typescript
type UserProfile = { name: string; age: number };
interface EventData { title: string; date: Date; }
```

### Functions

Use **camelCase** for regular functions. Use **PascalCase** for React components.

```typescript
// ✅ Correct (regular functions)
function fetchUserData() { }
function validateInput() { }

// ✅ Correct (React components)
function IconCard() { return <div>...</div>; }
function UserProfile() { return <div>...</div>; }
```

### Variables

Use **camelCase**.

```typescript
const userName = "John";
let itemCount = 0;
```

### Exported Constants

Use **UPPER_CASE**.

```typescript
export const API_BASE_URL = "https://api.example.com";
export const MAX_UPLOAD_SIZE = 1024 * 1024;
```

### Boolean Variables

Must use **is/has/can** prefixes.

```typescript
// ✅ Correct
const isActive = true;
const hasPermission = false;
const canEdit = user.role === "admin";

// ❌ Incorrect
const active = true;
const permission = false;
const editable = true;
```

## Import Order

Imports should be ordered as follows (the `simple-import-sort` plugin will automatically sort them):

1. Side effect imports (polyfills, etc.)
2. React / Next.js
3. External libraries
4. Internal aliases (`@/`)
5. Relative paths
6. CSS imports

```typescript
// 1. Side effects
import "polyfill";

// 2. React / Next.js
import { useState } from "react";
import Link from "next/link";

// 3. External libraries
import axios from "axios";

// 4. Internal aliases
import { validateEmail } from "@/lib/validation";
import { UserProfile } from "@/types/user";

// 5. Relative paths
import { helper } from "../utils/helper";
import { config } from "./config";

// 6. CSS
import styles from "./Component.module.css";
```

## Equality Operators

Always use **strict equality operators (`===`, `!==`)**.

```typescript
// ✅ Correct
if (value === null) { }
if (count !== 0) { }

// ❌ Incorrect
if (value == null) { }
if (count != 0) { }
```

## Prettier Configuration

Format rules defined in `.prettierrc`:

- **printWidth**: 80 characters
- **tabWidth**: 2 spaces
- **useTabs**: false (use spaces)
- **singleQuote**: false (use double quotes)
- **semi**: true (semicolons required)
- **trailingComma**: "all" (add trailing commas wherever possible)
- **arrowParens**: "always" (always use parentheses for arrow function parameters)

```typescript
// ✅ Correct formatting
const greeting = "Hello, World!";
const numbers = [1, 2, 3];
const user = {
  name: "John",
  age: 30,
};

const add = (a, b) => a + b;
```

## Tool Usage

### Linting

```bash
npm run lint         # Check only
npm run lint:fix     # Fix auto-fixable errors
```

### Formatting

```bash
npm run format:check # Check only
npm run format       # Auto-format
```

## Summary

- **React Components**: Function declarations + Named exports
- **Utility functions/constants**: Named exports
- **Naming Conventions**: PascalCase (types, components), camelCase (functions, variables), UPPER_CASE (constants)
- **Boolean Variables**: is/has/can prefix required
- **Equality Operators**: Always use `===` / `!==`
- **Import Order**: React → External → Internal → Relative → CSS

ESLint and Prettier will automatically apply these rules, so run `npm run lint:fix` and `npm run format` to auto-fix.
