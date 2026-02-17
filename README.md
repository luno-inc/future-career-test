# Career Compass

生成AIが描く、あなたの未来キャリア診断サイト

## 概要

Career Compassは、ユーザーのプロフィール情報と外部環境の変化を考慮して、複数の未来キャリアシナリオを生成するWebアプリケーションです。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 18, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **AI**: Anthropic Claude API
- **状態管理**: React Query (TanStack Query)
- **UIコンポーネント**: Radix UI

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

シナリオ生成に Anthropic Claude API を使うため、プロジェクトルートに `.env.local` を作成し、`ANTHROPIC_API_KEY=your_anthropic_api_key_here` を記述してください。設定後は開発サーバーを再起動してください。

`.env.local.example` をコピーして `.env.local` にリネームし、値を編集しても構いません。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
career-compass/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── generate-scenarios/
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   └── providers.tsx       # プロバイダー（QueryClient, Auth等）
├── src/
│   ├── components/        # Reactコンポーネント
│   ├── pages/            # ページコンポーネント
│   ├── lib/              # ユーティリティ・ライブラリ
│   └── utils/            # ヘルパー関数
└── public/               # 静的ファイル
```

## 主な機能

1. **プロフィール入力**: 27の質問を通じてユーザーの価値観、経験、夢を可視化
2. **外生イベント選択**: ランダムに抽出された外部環境の変化イベントを選択
3. **シナリオ生成**: Claude APIを使用して3つの異なる未来キャリアシナリオを生成
4. **結果表示**: 生成されたシナリオを詳細に表示

## ビルド

```bash
npm run build
```

## 本番環境での実行

```bash
npm start
```

## 注意事項

- 入力データはサーバーに保存されません。セッションストレージに一時保存されます。
- ブラウザを閉じるとデータは削除されます。
- Claude APIの利用にはAPIキーが必要です。
