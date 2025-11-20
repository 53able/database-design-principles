# データベース設計の原理原則 - 学習プロジェクト

このプロジェクトは、データベース設計の原理原則とベストプラクティスを実践的に学ぶための検証用プロジェクトです。

## 技術スタック

- **React**: フロントエンドUI
- **TinyBase**: クライアントサイドのリアクティブなデータベース
- **Hono**: 高速なバックエンドAPIフレームワーク
- **TypeScript**: 型安全性を確保
- **Vite**: 高速な開発環境

## プロジェクト構成

```
.
├── src/
│   ├── client/          # Reactフロントエンド
│   │   ├── components/  # Reactコンポーネント
│   │   ├── models/      # TinyBaseストア定義
│   │   └── App.tsx      # メインアプリケーション
│   ├── server/          # Honoバックエンド
│   │   └── index.ts     # APIサーバー
│   └── shared/          # 共通の型定義とスキーマ
│       └── schemas.ts   # Zodスキーマ定義
├── docs/                # ドキュメント
│   └── a.md            # データベース設計の原理原則
└── package.json
```

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

フロントエンドとバックエンドを同時に起動：

```bash
npm run dev
```

個別に起動する場合：

```bash
# フロントエンドのみ（ポート5173）
npm run dev:frontend

# バックエンドのみ（ポート3000）
npm run dev:backend
```

### ビルド

```bash
npm run build
```

## 学習内容

このプロジェクトでは、以下のデータベース設計の原理原則を実践的に学ぶことができます：

1. **原理1：単一責任の原則（1テーブル1エンティティ）**
   - 製品テーブルと顧客テーブルの分離
   - アノマリー（挿入、更新、削除の異常）の回避

2. **原理2：データ型と命名規則の最適化**
   - Zodスキーマによる型定義
   - 一貫した命名規則（スネークケース）

3. **原理3：キーによる一意性と整合性の確保**
   - 主キーの定義
   - サロゲートキーの使用

4. **原理4：正規化による冗長性の排除**
   - BCNF（ボイス・コッド正規形）の実践
   - 関数従属性と推移的依存性の解消

5. **原理5：リレーションシップの明確な定義**
   - 1対多リレーションシップ（顧客-注文）
   - 多対多リレーションシップ（注文-製品）の実装

6. **原理6：制約によるデータ品質の強制**
   - Zodスキーマによるバリデーション
   - TinyBaseのスキーマ定義

## データモデル

### テーブル構造

- **products**: 製品情報
  - `product_id` (主キー)
  - `name`
  - `price`
  - `description`

- **customers**: 顧客情報
  - `customer_id` (主キー)
  - `name`
  - `email`

- **orders**: 注文情報
  - `order_id` (主キー)
  - `customer_id` (外部キー → customers.customer_id)
  - `order_date`
  - `total_amount`

- **order_items**: 注文明細（ジャンクションテーブル）
  - `order_item_id` (主キー)
  - `order_id` (外部キー → orders.order_id)
  - `product_id` (外部キー → products.product_id)
  - `quantity`
  - `unit_price`

## 開発ガイドライン

- TypeScriptの型はZodスキーマファーストで定義
- `any`型の使用は禁止
- 関数定義は関数リテラルで記述
- 参照透過性を意識し、`const`とイミュータブルなデータ構造を使用
- TSDocコメントを適切に記述

## ライセンス

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

