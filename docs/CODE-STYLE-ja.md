# Code Style Guide

本ドキュメントは、コードの書き方および命名規則を定めるものである。

---

## 目次

* [表記方法](#表記方法)
* [ブランチ運用](#ブランチ運用)
* [ページコンポーネント](#ページコンポーネント)
* [Reactコンポーネント](#reactコンポーネント)
* [ライブラリ](#ライブラリ)
* [スタイル](#スタイル)
* [画像](#画像)
* [インポート規則](#インポート規則)
* [エクスポート規則](#エクスポート規則)
* [命名規則](#命名規則)
* [スコープ設計](#スコープ設計)
* [コードフォーマット](#コードフォーマット)
* [例外規定](#例外規定)


---

## 表記方法

本ドキュメントで使用するケース表記を以下に統一する。

* `PascalCase`
* `camelCase`
* `snake_case`
* `CONSTANT_CASE`
* `kebab-case`

#### ケース形式 / ケース表記

| ケース形式     | 表記方法            | 別称                 | 説明                 |
| :-------- | :-------------- | :----------------- | :----------------- |
| パスカルケース   | `PascalCase`    | `UpperCamelCase`   | 単語の先頭文字を大文字にして連結する |
| キャメルケース   | `camelCase`     | `lowerCamelCase`   | 先頭単語のみ小文字で連結する     |
| スネークケース   | `snake_case`    | `lower_snake_case` | 単語を `_` で区切る       |
| コンスタントケース | `CONSTANT_CASE` | `UPPER_SNAKE_CASE` | 定数定義に使用            |
| ケバブケース    | `kebab-case`    | `lisp-case`        | 単語を `-` で区切る       |

---

## ブランチ運用

ブランチ名は以下の形式とする。

```
<branch-type>/<topic-name>
```

#### branch-type

| 種別           | 用途                                      |
| :----------- | :-------------------------------------- |
| feature      | 新機能追加（demo は `feature/demo/<username>`） |
| fix / bugfix | バグ修正                                    |
| hotfix       | 本番環境向け緊急修正                              |
| refactor     | 内部構造の改善                                 |
| chore        | 雑務・整理                                   |
| test         | 実験・検証                                   |
| docs         | ドキュメント更新                                |

#### topic-name

変更内容を簡潔に表す。`kebab-case` を使用する。

---

## ページコンポーネント

`Next.js App Router`を前提とする。

* ファイル名は `page.tsx`
* `export default function <PageName>Page()` を含む
* `<PageName>` は親ディレクトリ名を `PascalCase` に変換したもの

---

## Reactコンポーネント

* コンポーネント名は `PascalCase`
* ファイル名は `<ComponentName>.tsx`
* `export function <ComponentName>()` を使用

---

## ライブラリ

* ファイル名は `<library-name>.ts`
* `kebab-case` を使用

---

## スタイル

#### ページ用スタイル

* `<page-name>.module.css`
* 対応するページの近くに配置
* 無関係なページからは読み込まない

#### コンポーネント用スタイル

* `<ComponentName>.module.css`
* `/src/styles/` に配置

---

## 画像

* `/public/` 配下に配置
* `kebab-case` を使用

---

## インポート規則

#### 書式

* コンポーネント

```
import { ComponentName } from "@/components/ComponentName";
```

* CSS

```
import styles from "@/styles/file.module.css";
```

#### 順序

1. 外部ライブラリ
2. 内部モジュール
3. スタイル

同一グループ内ではアルファベット順を推奨する。

---

## エクスポート規則

* 原則 名前付きエクスポートを使用
* `export default` はページコンポーネントのみ許可

---

## 命名規則

#### ディレクトリ

* 原則`kebab-case`を用いる。

#### ファイル

* 原則`kebab-case`を用いる。
* 規定がある場合はそちらを優先する。

#### 型・インターフェース

* `PascalCase`

#### Hooks

* `use` で始める `camelCase`

#### 関数

* `camelCase`
* `.tsx` 内ではアロー関数を使用
* React コンポーネントのみ `function` 宣言を使用

#### 変数

* `camelCase`
* boolean は `is` / `has` / `can` で開始

#### クラス

* `PascalCase`

#### 定数

* `CONSTANT_CASE`

---

## スコープ設計

* ファイルローカルな要素には文脈依存の名前を付ける
* 過度に汎用的な命名を避ける

---

## コードフォーマット

#### 書式

* 行長：最大80文字
* インデント：半角スペース2つ
* 文字列：ダブルクオーテーション
* セミコロン：必須
* 複数行構造では trailing comma を付与
* 等価比較は `===` / `!==`
* 変数展開はテンプレートリテラルを使用
* ファイルの末尾には改行を入れる

#### 禁止事項

* 意味のない省略（usr, cfg, mgr など）
* 似た概念の名称混在（UserCard / UserItem など）

一般的な略語（URL / API / ID）は使用可。

---

## 例外規定

フレームワークや外部ライブラリの仕様により本規則を適用できない場合は、その仕様を優先する。
