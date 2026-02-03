# CODE STYLE

本ドキュメントは,コードの書き方および命名規則を定めるものである.

## 表記方法

本ドキュメントで使用する[ケース表記](#ケース形式--ケース表記)を統一する.

- [パスカルケース PascalCase](#パスカルケース-pascalcase)
- [キャメルケース camelCase](#キャメルケース-camelcase)
- [スネークケース snake_case](#スネークケース-snake_case)
- [コンスタントケース CONSTANT_CASE](#コンスタントケース-constant_case)
- [ケバブケース kebab-case](#ケバブケース-kebab-case)

## ブランチ

`<branch-type>/<topic-name>`とする.

#### `<branch-type>`

ブランチの目的や変更の性質を表す識別子.

- `feature` — 新機能追加
- `fix` または `bugfix` — バグの修正
- `hotfix` — 本番環境用の緊急修正
- `chore` — 保守作業・整理
- `refactor` — 内部のコードの改善・変更
- `test` — テストや実験用ブランチ
- `docs` ― ドキュメントの更新

#### `<topic-name>`

ブランチが扱う変更内容を簡潔に表すトピック名.

[kebab-case]を用いる.

## ディレクトリ

ディレクトリ名は基本的に[kebab-case]を用いる.

## ファイル

ファイル名はファイルの種類に応じてケース表記を使い分ける.

下記にないものは,基本的に[kebab-case]を用いる.

---

### ページコンポーネント

※ Next.js App Router を前提とする.

ファイル名は`page.tsx`とする.

`export default function <PageName>Page()`を含むこと.

#### `<PageName>`

基本的にファイルの親ディレクトリ名を使用する.

[PascalCase]を用いる.

---

### Reactコンポーネント

#### `<ComponentName>`

[PascalCase]を用いる.

コンポーネントファイルを作成する場合.

- ファイル名は`<ComponentName>.tsx`とする.
- `export function <ComponentName>()`を含むこと.

---

### ライブラリ

ファイル名は`<library-name>.ts`とする.

#### `<library-name>`

[kebab-case]を用いる.

---

### スタイル

ページのスタイルの場合,
- ファイル名は`<page-name>.module.css`とする.
- できるだけ,ページコンポーネントに近い場所に置く.
- 関係のない複数のページコンポーネントには読み込ませない.

コンポーネントのスタイルの場合,
- ファイル名は`<ComponentName>.module.css`とする.
- `/src/styles/`に置く.

#### `<page-name>`

[kebab-case]を用いる.

#### `<ComponentName>`

[PascalCase]を用いる.

---

### 画像

`/public/`に置く.

[kebab-case]を用いる.

## インポート

| インポート対象 | コード                                                        |
| :------------- | :------------------------------------------------------------ |
| component      | `import <ComponentName> from "@/components/<ComponentName>";` |
| css            | `import styles from "@/styles/<css-file>.module.css";`        |

### インポート順

1. 外部ライブラリ
2. 内部モジュール
3. スタイル

できれば,同一グループ内ではアルファベット順にする.

[ダブルクオーテーション]["]を用いる.

## エクスポート

コンポーネント名の誤字を防ぐために,コンポーネント・関数・型は名前付きエクスポートを基本とする.

`export default`はページコンポーネントのみとする.

## 型・インターフェース

型名・interface名は[PascalCase]を用いる.

## Hooks

カスタムフックは`use`から始め,[camelCase]を用いる.

## 関数

[camelCase]を用いる.

`.tsx`内の関数定義には,アロー関数`() => {}`を使用する.

ただし,Reactコンポーネントは`function`宣言を用いる.

## 変数

[camelCase]を用いる.

boolean値は`is`・`has`・`can`から始める.

## 定数

[CONSTANT_CASE]を用いる.

## スコープ

ファイル内のみで使用される変数・関数は,

過度に汎用的な名前を避け,文脈に即した名前を付ける.

## インデント

インデント文字は半角スペース2つを用いる.

## 文字列

文字列を表すときにはダブルクオーテーション(`"`)を用いる.

## 文末のセミコロン

`.ts`・`.tsx`の文末にはセミコロンを付ける.

## 最後のカンマ

`trailing comma`ともいう.

オブジェクトなどを追加・並び替えを容易にするため,

複数行の配列・オブジェクト・引数では最後のカンマを付ける.

## 等価演算子

等価比較には基本的に `===` ・ `!==` を使用する.

## テンプレートリテラル

変数展開を伴う文字列にはテンプレートリテラルを使用する.

例 : `` `name: ${name}` ``

## 禁止事項・アンチパターン

- 意味のない省略をしない.\
  (usr, cfg, mgr)
- 似た意味の単語を複数使わない,わかりやすく分ける.\
  (UserCard と UserItem が混在するなど)

ただし,一般的な略語は使用可とする.

- URL
- API
- ID

## 例外

フレームワークや外部ライブラリの仕様により

本命名規則を適用できない場合は,その仕様を優先する.

# ケース形式 / ケース表記

## パスカルケース (PascalCase)

**単語の頭文字のみ大文字にし繋げる.**

`UpperCamelCase`とも.

1970年代に開発されたプログラミング言語「Pascal」において標準的に用いられていた.

## キャメルケース (camelCase)

**1つ目以外の単語の頭文字のみ大文字にし繋げる.**

`lowerCamelCase`とも.

ラクダ(camel)のこぶに見えることから名付けられた.

## スネークケース (snake_case)

**文字を小文字で揃え,空白文字を`_`で置き換える.**

`lower_snake_case`,`アンダースコア記法`とも.

蛇(snake)が地面を這っているように見えることから名付けられた.

## コンスタントケース​ (CONSTANT_CASE)

**文字を大文字で揃え,空白文字を`_`で置き換える.**

`MACRO_CASE`,`SCREAMING_SNAKE_CASE`,`UPPER_SNAKE_CASE`とも.

その名の通り「定数(CONSTANT)」を定義する際に使われることから名付けられた.

## ケバブケース (kebab-case)

**文字を小文字で揃え,空白文字を`-`で置き換える.**

`lisp-case`,`chain-case`とも.

ハイフンを文字を貫く串に見立てている.

[PascalCase]: #パスカルケース-pascalcase
[camelCase]: #キャメルケース-camelcase
[snake_case]: #スネークケース-snake_case
[CONSTANT_CASE]: #コンスタントケース-constant_case
[kebab-case]: #ケバブケース-kebab-case
["]: #文字列
