# 都立小石川中等教育学校IT委員会ウェブサイト

都立小石川中等教育学校(Koishikawa Secondary School)IT委員会のウェブサイトです。.

## English Version

[Link](./README.md)

## 概要

IT委員会公式のフルスタックウェブアプリケーションで、
- 委員会情報とメンバーとプロフィール
- 管理者認証のユーザー認証
- メンバー管理機能
を提供します。

## 技術スタック

- **フレームワーク:** Next.js 15 with App Router
- **言語:** TypeScript 5
- **UI:** React 19, CSS Modules
- **データベース:** Vercel Postgres (Neon)
- **認証:** bcryptjsを利用したセッションベース
- **デプロイ:** Docker, Nginx (ロードバランサー), Vercel
- **CI/CD:** GitHub Actions

## はじめに

### 前提

- Node.js 20+
- npm または yarn
- PostgreSQL (または Vercel Postgres)

###  開発環境での起動

```bash
npm install
npm run dev
```

### 環境変数

次のコマンドで `.env.local` ファイルを作成してください。

```
POSTGRES_URL=your_postgres_connection_string
```

## プロジェクト構成

```
src/
├── app/                  # Next.js App Routerのページ
│   ├── api/auth/         # 認証用APIルート
│   ├── committee-info/   # 委員向けページ
│   ├── login/            # ログインページ
│   ├── signup/           # 新規登録ページ
│   └── tutorial/         # チュートリアル（保護済）
├── components/           # 再利用可能なReact components
├── lib/                  # 認証・データベース関連ユーティリティ
├── styles/               # CSSモジュール
└── types/                # TypeScriptの型定義
```

## 機能

### 認証機能
- パスワードをハッシュ化したユーザー登録
- 7日間のスライド有効期限を持つセッションベース認証
- 新規アカウント作成時に管理者の承認が必要
- HttpOnly Cookie による安全なセッション管理

### 保護されたコンテンツ
- ミドルウェアによるルート保護
- 委員用チュートリアルコンテンツ
- アクセス制御された委員会情報

## ブランチの命名規則

- `feature/` — 新機能追加
- `fix/` あるいは `bugfix/` — バグの修正
- `hotfix/` — 本番環境用の緊急修正
- `chore/` — 保守作業・整理
- `refactor/` — 内部のコードの改善・変更
- `test/` — テストや実験用ブランチ
- `docs/` — ドキュメントの更新

## スクリプト

```bash
npm run dev       # 開発サーバーを起動
npm run build     # 本番用ビルド
npm run start     # 本番サーバーを起動
npm run lint      # ESLintの実行
```

## ライセンス

本プロジェクトはIT委員会によって管理されており、MITライセンスのもとで公開されています。