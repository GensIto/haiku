# Haiku

モダンな技術スタックで構築されたフルスタックReactアプリケーション。Cloudflare Workersでエッジ実行され、認証機能を備えています。

## 使用技術

### フロントエンド
- **React 19** + TypeScript - モダンなUI構築
- **Vite** - 高速な開発サーバーとビルドツール
- **TanStack Router** - ファイルベースルーティング
- **TanStack Query** - データフェッチング
- **shadcn/ui** - UIコンポーネント
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **next-themes** - ダークモード対応

### バックエンド
- **Hono** - 軽量高速なAPIフレームワーク
- **better-auth** - 認証システム
- **Drizzle ORM** - TypeScript製のORM
- **Cloudflare D1** - エッジで動くSQLiteデータベース
- **Cloudflare AI** - AIモデルへのアクセス

### インフラ
- **Cloudflare Workers** - エッジコンピューティングプラットフォーム
- **Cloudflare D1** - グローバルに分散されたSQLiteデータベース

## セットアップ手順

### 1. 必要な環境
- Node.js (推奨: 最新のLTS版)
- npm

### 2. リポジトリのクローンと依存関係のインストール

```bash
git clone <repository-url>
cd haiku
npm install
```

### 3. データベースのセットアップ

ローカル開発用のデータベースを初期化:

```bash
npm run db:migrate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションが [http://localhost:3000](http://localhost:3000) で起動します。

## 開発時の注意点

### データベース操作
- **ローカル開発**: `.wrangler/state/` にSQLiteファイルが作成されます
- **スキーマ変更**: `src/worker/db/schema.ts` を編集後、`npm run db:gen` でマイグレーションを生成
- **マイグレーション適用**: `npm run db:migrate` (ローカル) または `npm run db:migrate:remote` (本番)
- **データベースGUI**: `npm run db:studio` でDrizzle Studioが起動

### 認証について
- better-authを使用したメール/パスワード認証
- 認証エンドポイント: `/api/auth/*`
- フロントエンド: `src/react-app/lib/betterAuth.ts`
- バックエンド: `src/worker/lib/auth.ts`

### アーキテクチャ: DDD (ドメイン駆動設計)

バックエンドはクリーンアーキテクチャとDDDの原則に従って設計されています:

```
src/worker/
├── domain/                 # ドメイン層（ビジネスロジックの中核）
│   ├── entities/          # エンティティ (Verse, Haiku, Senryu, User)
│   ├── value-object/      # 値オブジェクト (VerseForm)
│   ├── factories/         # ファクトリ (VerseFactory)
│   ├── service/           # ドメインサービス (KigoDetectionService)
│   └── interface/         # インターフェース定義
│       ├── repositories/  # リポジトリインターフェース
│       ├── usecase/       # ユースケースインターフェース
│       ├── service/       # サービスインターフェース
│       └── providers/     # プロバイダーインターフェース
├── usecase/               # ユースケース層（アプリケーションロジック）
│   ├── verses/           # 句に関するユースケース
│   └── dangos/           # Dangoに関するユースケース
├── infrastructure/        # インフラ層（外部システムとの接続）
│   ├── VersesRepository.ts
│   ├── DangosRepository.ts
│   ├── UsersRepository.ts
│   └── providers/        # 各種プロバイダー実装
├── controllers/           # コントローラー層（HTTPハンドラ）
│   ├── verses.ts
│   ├── dangos.ts
│   └── users.ts
├── db/                    # データベーススキーマ
├── containers.ts          # DIコンテナ (tsyringe)
└── index.ts              # エントリーポイント
```

### ファイル構成
```
src/
├── react-app/          # フロントエンドアプリケーション
│   ├── routes/         # TanStack Router のルート定義
│   ├── components/ui/  # shadcn/ui コンポーネント
│   └── lib/            # ユーティリティ (router, auth, API client)
└── worker/             # バックエンド (Cloudflare Worker)
```

## よく使うコマンド

### 開発
```bash
npm run dev              # 開発サーバーを起動 (http://localhost:3000)
npm run build            # 本番用ビルド
npm run preview          # ビルドしたアプリをローカルでプレビュー
npm run lint             # ESLintを実行
npm run check            # 型チェック + ビルド + デプロイのドライラン
```

### データベース
```bash
npm run db:gen           # スキーマ変更からマイグレーションファイルを生成
npm run db:migrate       # ローカルDBにマイグレーションを適用
npm run db:migrate:remote # 本番DBにマイグレーションを適用
npm run db:studio        # ローカルDB用のDrizzle Studioを起動
npm run db:studio:prod   # 本番DB用のDrizzle Studioを起動
```

### デプロイ
```bash
npm run deploy           # Cloudflare Workersにデプロイ
npx wrangler tail        # デプロイされたWorkerのログを監視
```

### Cloudflare設定
```bash
npm run cf-typegen       # Cloudflareバインディングの型定義を生成
```

## 本番環境設定

本番環境のデータベース操作には、`.env` ファイルに以下の環境変数が必要です:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_d1_token
```

## プロジェクトの特徴

- **シングルWorkerアーキテクチャ**: フロントエンドとバックエンドを1つのCloudflare Workerで実行
- **エッジファースト**: グローバルに分散されたエッジネットワークで高速なレスポンス
- **型安全なAPI**: HonoのRPCクライアントでフロントエンド/バックエンド間の型共有
- **ファイルベースルーティング**: TanStack Routerによる直感的なルート管理
- **モダンなReact**: React 19の最新機能を活用
- **DDD設計**: クリーンアーキテクチャに基づいた保守性の高いコード構造

## 実装の参考情報

### DI (依存性注入)
- **ライブラリ**: tsyringe
- **設定ファイル**: [src/worker/containers.ts](src/worker/containers.ts)
- **使用例**: コントローラーやユースケースで `@injectable()` と `@inject()` を使用

### 新しい機能の追加方法

#### 1. エンティティの追加
[src/worker/domain/entities/](src/worker/domain/entities/) にドメインエンティティを作成

#### 2. リポジトリの追加
1. [src/worker/domain/interface/repositories/](src/worker/domain/interface/repositories/) にインターフェースを定義
2. [src/worker/infrastructure/](src/worker/infrastructure/) に実装を作成
3. [src/worker/containers.ts](src/worker/containers.ts) にDI登録

#### 3. ユースケースの追加
1. [src/worker/domain/interface/usecase/](src/worker/domain/interface/usecase/) にインターフェースを定義
2. [src/worker/usecase/](src/worker/usecase/) に実装を作成
3. [src/worker/containers.ts](src/worker/containers.ts) にDI登録

#### 4. コントローラー（APIエンドポイント）の追加
1. [src/worker/controllers/](src/worker/controllers/) にコントローラーを作成
2. [src/worker/index.ts](src/worker/index.ts) にルートを追加

### データベーススキーマの変更
1. [src/worker/db/schema.ts](src/worker/db/schema.ts) または関連スキーマファイルを編集
2. `npm run db:gen` でマイグレーションファイルを生成
3. `npm run db:migrate` でローカルDBに適用
4. 本番環境には `npm run db:migrate:remote` で適用

### ドメインロジックの実装例
- **季語検出**: [src/worker/domain/service/KigoDetectionService.ts](src/worker/domain/service/KigoDetectionService.ts)
- **句の作成**: [src/worker/domain/factories/VerseFactory.ts](src/worker/domain/factories/VerseFactory.ts)
- **モーラ数カウント**: [src/worker/service/MoraCounterService.ts](src/worker/service/MoraCounterService.ts)

## 参考リンク

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [TanStack Router](https://tanstack.com/router/)
- [TanStack Query](https://tanstack.com/query/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [better-auth](https://www.better-auth.com/)
- [shadcn/ui](https://ui.shadcn.com/)
