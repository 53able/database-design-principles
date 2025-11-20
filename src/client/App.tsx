import { useEffect } from 'react';
import { Provider } from 'tinybase/ui-react';
import { Inspector } from 'tinybase/ui-react-inspector';
import { store, initializeStore } from './models/store';
import { ProductsTable } from './components/ProductsTable';
import { CustomersTable } from './components/CustomersTable';
import { OrdersTable } from './components/OrdersTable';
import { AnomalyDemo } from './components/AnomalyDemo';
import { DataTypeDemo } from './components/DataTypeDemo';
import { KeyDemo } from './components/KeyDemo';
import { NormalizationDemo } from './components/NormalizationDemo';
import { ConstraintDemo } from './components/ConstraintDemo';
import './App.css';

/**
 * メインアプリケーションコンポーネント
 * データベース設計の原理原則を学ぶためのデモアプリケーション
 */
const AppContent = () => {
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>データベース設計の原理原則 - 学習デモ</h1>
        <p>テーブル設計のベストプラクティスを実践的に学ぶ</p>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>原理1：単一責任の原則（1テーブル1エンティティ）</h2>
          <p>
            異なるエンティティを1つのテーブルに混在させると、3つの「アノマリー（異常）」が発生します。
          </p>
          <AnomalyDemo />
        </section>

        <section className="section">
          <h2>原理1：良い設計の実例</h2>
          <p>エンティティを分離した正しい設計</p>
          <div className="tables-grid">
            <div className="table-container">
              <h3>製品テーブル (products)</h3>
              <ProductsTable />
            </div>
            <div className="table-container">
              <h3>顧客テーブル (customers)</h3>
              <CustomersTable />
            </div>
          </div>
        </section>

        <section className="section">
          <h2>原理2：データ型と命名規則の最適化</h2>
          <p>
            適切なデータ型の選択と一貫した命名規則は、データベースの効率性と保守性を高めます。
          </p>
          <DataTypeDemo />
        </section>

        <section className="section">
          <h2>原理3：キーによる一意性と整合性の確保</h2>
          <p>
            主キー、候補キー、サロゲートキーの概念を理解し、適切なキー設計を行います。
          </p>
          <KeyDemo />
        </section>

        <section className="section">
          <h2>原理4：正規化による冗長性の排除</h2>
          <p>
            正規化プロセスを通じて、データの冗長性と不適切な依存関係を最小限に抑えます。
          </p>
          <NormalizationDemo />
        </section>

        <section className="section">
          <h2>原理5：リレーションシップの定義</h2>
          <p>テーブル間の関係を外部キーで表現します</p>
          <div className="table-container">
            <h3>注文テーブル (orders)</h3>
            <OrdersTable />
          </div>
        </section>

        <section className="section">
          <h2>原理6：制約によるデータ品質の強制</h2>
          <p>
            データベースレベルでビジネスルールを強制し、データの品質と整合性を保証します。
          </p>
          <ConstraintDemo />
        </section>
      </main>

      {/* TinyBase Inspector - 開発中にデータを観測 */}
      <Inspector />
    </div>
  );
};

/**
 * TinyBase Providerでラップされたアプリケーション
 */
export const App = () => {
  // 型アサーション: TinyBaseのスキーマベースストアとProviderの型の互換性の問題を回避
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <Provider store={store as any}>
      <AppContent />
    </Provider>
  );
};

