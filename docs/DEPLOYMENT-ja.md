# ゼロダウンタイム・デプロイガイド

このプロジェクトは、nginx のロードバランサーの背後に 2 つの Next.js インスタンスを配置し、**ローリングアップデート戦略**を使うことで、ゼロダウンタイムでのデプロイを実現しています。

## アーキテクチャ（構造）

```txt
                ┌────────┐
インターネット → │  Nginx │ (ロードバランサ)
                └────┬───┘
                     │
            ┌────────┴────────┐
            │                 │
      ┌─────▼─────┐    ┌─────▼─────┐
      │ nextjs-1  │    │ nextjs-2  │
      └───────────┘    └───────────┘
```

## 仕組み

1. **ロードバランシング**: Nginx は `least_conn` アルゴリズムを使って、2 つの Next.js インスタンスにトラフィックを分散します
2. **ヘルスチェック**: 各インスタンスは 10 秒ごとにヘルスチェックされます
3. **ローリングアップデート**: インスタンスを 1 台ずつ順番に更新します
4. **ゼロダウンタイム**: 片方を更新している間、もう片方がすべてのトラフィックを処理します

## 初回セットアップ

```bash
# すべてのサービスをビルドして起動
docker compose up -d --build

# すべてのサービスが正常か確認
docker compose ps
```

## デプロイアップデート(ゼロダウンタイム)

コンテンツを更新してデプロイする場合：

```bash
# ローリングデプロイスクリプトを実行
./deploy-rolling.sh
```

### スクリプトの処理内容

1. ✅ 新しいDockerイメージをビルド
2. ✅ `nextjs-2` が通信を処理している間にnextjs-1を更新
3. ✅ `nextjs-1`のヘルスチェックがOKになるまで待機
4. ✅ `nextjs-1`が通信を処理している間に `nextjs-2`を更新
5. ✅ `nextjs-2` のヘルスチェックがOKになるまで待機
6. ✅ ルーティングを正しくするため nginx を再起動
7. ✅ **この間ずっとゼロダウンタイム！**

## 手動デプロイ（上級者向け）

より細かく制御したい場合：

```bash
# Update instance 1 only
# インスタンス1だけを更新
docker compose up -d --no-deps --build nextjs-1

# ヘルスチェックを待つ
docker inspect --format='{{.State.Health.Status}}' KSS-IT-Committee-HP-nextjs-1

# インスタンス2だけを更新
docker compose up -d --no-deps --build nextjs-2

# nginx を再起動
docker compose restart nginx
```

## 監視

```bash
# サービスの状態を確認
docker compose ps

# ログを見る
docker compose logs -f nextjs-1
docker compose logs -f nextjs-2
docker compose logs -f nginx

# ヘルス状態を確認
docker inspect --format='{{.State.Health.Status}}' KSS-IT-Committee-HP-nextjs-1
docker inspect --format='{{.State.Health.Status}}' KSS-IT-Committee-HP-nextjs-2

```

## ロールバック

デプロイに失敗した場合、スクリプトは自動的にロールバックを試みます。手動で行う場合：

```bash
# 問題のあるインスタンスを再起動
docker compose restart nextjs-1

# または、前のイメージから再構築
docker compose up -d --no-deps nextjs-1

```

## パフォーマンス調整

### Nginxのロードバランシングのアルゴリズム

現在: `least_conn`（接続数が少ないインスタンスにリクエストを送る）

docker/nginx/default.conf で他の方式も選べます：

- round_robin（デフォルト、コメントアウトされている）— 交互に振り分け
- ip_hash — 同じクライアントは常に同じインスタンスに送られる

### ヘルスチェックの調整

`docker-compose.yml`で以下を変更できます：

- `interval`: チェック間隔（デフォルト:10秒）
- `timeout`: 応答待ちの最大時間（デフォルト:5秒）
- `retries`: 異常と判定するまでの失敗回数（デフォルト:3）
- `start_period`: 起動時の猶予期間（デフォルト:30秒）

## トラブルシューティング

### インスタンスが「starting」のまま止まる場合

```bash
docker compose logs nextjs-1
# ビルドエラーや起動エラーを確認
```

### nginxがトラフィックを振り分けない場合

```bash
docker compose logs nginx
# upstream設定を確認
```

### ヘルスチェックが失敗した場合

```bash
# ヘルスエンドポイントを手動でテスト
docker exec KSS-IT-Committee-HP-nextjs-1 wget -O- http://localhost:3000/
```

## 本番デプロイ前チェックリスト

本番環境にデプロイする前に:

- [ ] ステージング環境でデプロイスクリプトをテスト
- [ ] ヘルスチェックが正しく動いていることを確認
- [ ] 初回デプロイ時にログを監視
- [ ] ヘルスチェック失敗時の監視・アラートを設定
- [ ] チーム用にロールバック手順をドキュメント化  
- [ ] デプロイ前に自動テストを追加することを検討
