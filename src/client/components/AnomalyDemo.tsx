import { useState } from 'react';
import { useRowIds, useCell } from 'tinybase/ui-react';
import { store } from '../models/store';

/**
 * 原理1：アノマリー（異常）のデモコンポーネント
 * 悪い設計（製品と顧客が混在）と良い設計（分離）を比較
 */
export const AnomalyDemo = () => {
  const [activeTab, setActiveTab] = useState<'bad' | 'good'>('bad');

  return (
    <div className="anomaly-demo">
      <div className="tab-buttons">
        <button
          className={activeTab === 'bad' ? 'active' : ''}
          onClick={() => setActiveTab('bad')}
        >
          ❌ 悪い設計（アノマリー発生）
        </button>
        <button
          className={activeTab === 'good' ? 'active' : ''}
          onClick={() => setActiveTab('good')}
        >
          ✅ 良い設計（分離済み）
        </button>
      </div>

      {activeTab === 'bad' ? <BadDesignDemo /> : <GoodDesignDemo />}
    </div>
  );
};

/**
 * 悪い設計のデモ（製品と顧客が混在）
 */
const BadDesignDemo = () => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 悪い設計のテーブル（製品と顧客が混在）
  const badTableRows = useRowIds('bad_design');

  const handleInsertProduct = () => {
    setError(null);
    if (!newProductName || !newProductPrice) {
      setError('❌ 挿入アノマリー：製品を追加するには顧客情報も必要です！');
      return;
    }
    // 悪い設計では製品だけを追加できない
    setError('❌ 挿入アノマリー：製品データだけを独立して挿入できません');
  };

  const handleUpdatePrice = (rowId: string, newPrice: number) => {
    // 悪い設計では複数行を更新する必要がある
    const productName = store.getCell('bad_design', rowId, 'name') as string;
    const allRows = store.getRowIds('bad_design');
    let updatedCount = 0;

    allRows.forEach((id) => {
      if (store.getCell('bad_design', id, 'name') === productName) {
        store.setCell('bad_design', id, 'price', newPrice);
        updatedCount++;
      }
    });

    if (updatedCount > 1) {
      setError(
        `⚠️ 更新アノマリー：同じ製品が${updatedCount}箇所に存在し、すべて更新する必要があります`
      );
    }
  };

  const handleDelete = (rowId: string) => {
    const customerName = store.getCell('bad_design', rowId, 'customer_name') as string;
    const productName = store.getCell('bad_design', rowId, 'name') as string;

    // この顧客の他のレコードがあるか確認
    const allRows = store.getRowIds('bad_design');
    const customerRows = allRows.filter(
      (id) => store.getCell('bad_design', id, 'customer_name') === customerName
    );
    const productRows = allRows.filter(
      (id) => store.getCell('bad_design', id, 'name') === productName
    );

    if (customerRows.length === 1) {
      setError(
        `❌ 削除アノマリー：このレコードを削除すると、顧客「${customerName}」の情報も失われます！`
      );
    } else if (productRows.length === 1) {
      setError(
        `❌ 削除アノマリー：このレコードを削除すると、製品「${productName}」の情報も失われます！`
      );
    } else {
      store.delRow('bad_design', rowId);
      setError(null);
    }
  };

  return (
    <div className="bad-design">
      <div className="anomaly-explanation">
        <h4>問題点</h4>
        <ul>
          <li>
            <strong>挿入アノマリー</strong>：製品だけを追加できない（顧客情報が必要）
          </li>
          <li>
            <strong>更新アノマリー</strong>：同じ製品の価格を複数箇所で更新する必要がある
          </li>
          <li>
            <strong>削除アノマリー</strong>：レコード削除時に他の情報も失われる可能性
          </li>
        </ul>
      </div>

      <div className="action-panel">
        <div className="insert-panel">
          <h4>新製品を追加（挿入アノマリー）</h4>
          <input
            type="text"
            placeholder="製品名"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="number"
            placeholder="価格"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <button onClick={handleInsertProduct}>製品を追加</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>製品ID</th>
            <th>製品名</th>
            <th>価格</th>
            <th>顧客ID</th>
            <th>顧客名</th>
            <th>メール</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {badTableRows.map((rowId) => (
            <BadDesignRow
              key={rowId}
              rowId={rowId}
              onUpdatePrice={handleUpdatePrice}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 悪い設計の行コンポーネント
 */
const BadDesignRow = ({
  rowId,
  onUpdatePrice,
  onDelete,
}: {
  rowId: string;
  onUpdatePrice: (rowId: string, price: number) => void;
  onDelete: (rowId: string) => void;
}) => {
  const productId = useCell('bad_design', rowId, 'product_id');
  const name = useCell('bad_design', rowId, 'name');
  const price = useCell('bad_design', rowId, 'price');
  const customerId = useCell('bad_design', rowId, 'customer_id');
  const customerName = useCell('bad_design', rowId, 'customer_name');
  const customerEmail = useCell('bad_design', rowId, 'customer_email');
  const [editPrice, setEditPrice] = useState<string>(String(price ?? ''));

  return (
    <tr>
      <td>{productId}</td>
      <td>{name}</td>
      <td>
        <input
          type="number"
          value={editPrice}
          onChange={(e) => setEditPrice(e.target.value)}
          onBlur={() => {
            const newPrice = parseFloat(editPrice);
            if (!isNaN(newPrice) && newPrice !== price) {
              onUpdatePrice(rowId, newPrice);
            }
          }}
        />
      </td>
      <td>{customerId}</td>
      <td>{customerName}</td>
      <td>{customerEmail}</td>
      <td>
        <button onClick={() => onDelete(rowId)} className="delete-btn">
          削除
        </button>
      </td>
    </tr>
  );
};

/**
 * 良い設計のデモ（製品と顧客が分離）
 */
const GoodDesignDemo = () => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const productRows = useRowIds('products');
  const customerRows = useRowIds('customers');

  const handleInsertProduct = () => {
    if (!newProductName || !newProductPrice) {
      return;
    }

    const newId = Math.max(...productRows.map(Number), 0) + 1;
    store.setRow('products', String(newId), {
      product_id: newId,
      name: newProductName,
      price: parseFloat(newProductPrice),
      description: '',
    });

    setSuccess(`✅ 製品「${newProductName}」を追加しました（顧客情報は不要）`);
    setNewProductName('');
    setNewProductPrice('');
  };

  const handleUpdatePrice = (rowId: string, newPrice: number) => {
    store.setCell('products', rowId, 'price', newPrice);
    setSuccess('✅ 価格を1箇所だけ更新しました');
  };

  const handleDeleteProduct = (rowId: string) => {
    const productName = store.getCell('products', rowId, 'name');
    store.delRow('products', rowId);
    setSuccess(`✅ 製品「${productName}」を削除しました（顧客情報は影響なし）`);
  };

  return (
    <div className="good-design">
      <div className="anomaly-explanation">
        <h4>解決策</h4>
        <ul>
          <li>
            <strong>挿入アノマリー解決</strong>：製品だけを独立して追加可能
          </li>
          <li>
            <strong>更新アノマリー解決</strong>：製品情報は1箇所だけ更新すればOK
          </li>
          <li>
            <strong>削除アノマリー解決</strong>：製品を削除しても顧客情報は保持
          </li>
        </ul>
      </div>

      <div className="action-panel">
        <div className="insert-panel">
          <h4>新製品を追加</h4>
          <input
            type="text"
            placeholder="製品名"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="number"
            placeholder="価格"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <button onClick={handleInsertProduct}>製品を追加</button>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}

      <div className="tables-grid">
        <div className="table-container">
          <h4>製品テーブル (products)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>製品ID</th>
                <th>製品名</th>
                <th>価格</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {productRows.map((rowId) => (
                <GoodProductRow
                  key={rowId}
                  rowId={rowId}
                  onUpdatePrice={handleUpdatePrice}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>顧客テーブル (customers)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>顧客ID</th>
                <th>顧客名</th>
                <th>メール</th>
              </tr>
            </thead>
            <tbody>
              {customerRows.map((rowId) => (
                <GoodCustomerRow key={rowId} rowId={rowId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * 良い設計の製品行コンポーネント
 */
const GoodProductRow = ({
  rowId,
  onUpdatePrice,
  onDelete,
}: {
  rowId: string;
  onUpdatePrice: (rowId: string, price: number) => void;
  onDelete: (rowId: string) => void;
}) => {
  const productId = useCell('products', rowId, 'product_id');
  const name = useCell('products', rowId, 'name');
  const price = useCell('products', rowId, 'price');
  const [editPrice, setEditPrice] = useState<string>(String(price ?? ''));

  return (
    <tr>
      <td>{productId}</td>
      <td>{name}</td>
      <td>
        <input
          type="number"
          value={editPrice}
          onChange={(e) => setEditPrice(e.target.value)}
          onBlur={() => {
            const newPrice = parseFloat(editPrice);
            if (!isNaN(newPrice) && newPrice !== price) {
              onUpdatePrice(rowId, newPrice);
            }
          }}
        />
      </td>
      <td>
        <button onClick={() => onDelete(rowId)} className="delete-btn">
          削除
        </button>
      </td>
    </tr>
  );
};

/**
 * 良い設計の顧客行コンポーネント
 */
const GoodCustomerRow = ({ rowId }: { rowId: string }) => {
  const customerId = useCell('customers', rowId, 'customer_id');
  const name = useCell('customers', rowId, 'name');
  const email = useCell('customers', rowId, 'email');

  return (
    <tr>
      <td>{customerId}</td>
      <td>{name}</td>
      <td>{email}</td>
    </tr>
  );
};

