import { useState } from 'react';
import { useRowIds, useCell } from 'tinybase/ui-react';
import { store } from '../models/store';

/**
 * 原理6：制約によるデータ品質の強制デモ
 * SQL制約の動作を体験して学ぶ
 */
export const ConstraintDemo = () => {
  const [selectedConstraint, setSelectedConstraint] = useState<
    'not_null' | 'unique' | 'primary_key' | 'foreign_key' | 'check' | 'default'
  >('not_null');

  return (
    <div className="constraint-demo">
      <div className="constraint-tabs">
        <button
          className={selectedConstraint === 'not_null' ? 'active' : ''}
          onClick={() => setSelectedConstraint('not_null')}
        >
          NOT NULL
        </button>
        <button
          className={selectedConstraint === 'unique' ? 'active' : ''}
          onClick={() => setSelectedConstraint('unique')}
        >
          UNIQUE
        </button>
        <button
          className={selectedConstraint === 'primary_key' ? 'active' : ''}
          onClick={() => setSelectedConstraint('primary_key')}
        >
          PRIMARY KEY
        </button>
        <button
          className={selectedConstraint === 'foreign_key' ? 'active' : ''}
          onClick={() => setSelectedConstraint('foreign_key')}
        >
          FOREIGN KEY
        </button>
        <button
          className={selectedConstraint === 'check' ? 'active' : ''}
          onClick={() => setSelectedConstraint('check')}
        >
          CHECK
        </button>
        <button
          className={selectedConstraint === 'default' ? 'active' : ''}
          onClick={() => setSelectedConstraint('default')}
        >
          DEFAULT
        </button>
      </div>

      {selectedConstraint === 'not_null' && <NotNullDemo />}
      {selectedConstraint === 'unique' && <UniqueDemo />}
      {selectedConstraint === 'primary_key' && <PrimaryKeyConstraintDemo />}
      {selectedConstraint === 'foreign_key' && <ForeignKeyDemo />}
      {selectedConstraint === 'check' && <CheckDemo />}
      {selectedConstraint === 'default' && <DefaultDemo />}
    </div>
  );
};

/**
 * NOT NULL制約のデモ
 */
const NotNullDemo = () => {
  // TinyBaseからユーザーデータを取得
  const userIds = useRowIds('users_constraints');

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddUser = () => {
    setError(null);
    setSuccess(null);

    if (!newUsername) {
      setError('❌ NOT NULL制約違反：usernameは必須です（NULL不可）');
      return;
    }

    if (!newEmail) {
      setError('❌ NOT NULL制約違反：emailは必須です（NULL不可）');
      return;
    }

    const newId =
      Math.max(
        ...userIds.map((id) => Number(store.getCell('users_constraints', id, 'user_id'))),
        0
      ) + 1;
    store.setRow('users_constraints', String(newId), {
      user_id: newId,
      username: newUsername,
      email: newEmail,
    });
    setSuccess(`✅ ユーザー「${newUsername}」を追加しました`);
    setNewUsername('');
    setNewEmail('');
  };

  return (
    <div className="constraint-demo-content">
      <div className="explanation-box">
        <h4>NOT NULL制約</h4>
        <ul>
          <li>
            <strong>目的</strong>：カラムがNULL値（空の値）を持つことを禁止します
          </li>
          <li>
            <strong>用途</strong>：ユーザー名、パスワードなど、存在が必須である情報に対して設定
          </li>
          <li>
            <strong>効果</strong>：データの完全性を保証し、必須項目の欠落を防ぎます
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>ユーザーを追加してみよう（NOT NULL制約を体験）</h4>
        <div className="input-group">
          <label>username（NOT NULL）：</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="必須項目"
          />
        </div>
        <div className="input-group">
          <label>email（NOT NULL）：</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="必須項目"
          />
        </div>
        <button onClick={handleAddUser} className="add-button">
          ユーザーを追加
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      <div className="examples-table">
        <h4>ユーザーテーブル（username, email にNOT NULL制約）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>user_id</th>
              <th>username（NOT NULL）</th>
              <th>email（NOT NULL）</th>
            </tr>
          </thead>
          <tbody>
            {userIds.map((userId) => (
              <NotNullRow key={userId} userId={userId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * NOT NULL行コンポーネント
 */
const NotNullRow = ({ userId }: { userId: string }) => {
  const user_id = useCell('users_constraints', userId, 'user_id');
  const username = useCell('users_constraints', userId, 'username');
  const email = useCell('users_constraints', userId, 'email');

  return (
    <tr>
      <td>{user_id}</td>
      <td>{username}</td>
      <td>{email}</td>
    </tr>
  );
};

/**
 * UNIQUE制約のデモ
 */
const UniqueDemo = () => {
  // TinyBaseからユーザーデータを取得
  const userIds = useRowIds('users_constraints');

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddUser = () => {
    setError(null);
    setSuccess(null);

    if (!newUsername || !newEmail) {
      setError('❌ usernameとemailは必須です');
      return;
    }

    // UNIQUE制約チェック
    const existingUsernames = userIds.map((id) =>
      store.getCell('users_constraints', id, 'username')
    );
    if (existingUsernames.includes(newUsername)) {
      setError(
        `❌ UNIQUE制約違反：username「${newUsername}」は既に存在します（重複不可）`
      );
      return;
    }

    const existingEmails = userIds.map((id) =>
      store.getCell('users_constraints', id, 'email')
    );
    if (existingEmails.includes(newEmail)) {
      setError(
        `❌ UNIQUE制約違反：email「${newEmail}」は既に存在します（重複不可）`
      );
      return;
    }

    const newId =
      Math.max(
        ...userIds.map((id) => Number(store.getCell('users_constraints', id, 'user_id'))),
        0
      ) + 1;
    store.setRow('users_constraints', String(newId), {
      user_id: newId,
      username: newUsername,
      email: newEmail,
    });
    setSuccess(`✅ ユーザー「${newUsername}」を追加しました`);
    setNewUsername('');
    setNewEmail('');
  };

  return (
    <div className="constraint-demo-content">
      <div className="explanation-box">
        <h4>UNIQUE制約</h4>
        <ul>
          <li>
            <strong>目的</strong>：カラム内のすべての値が一意であること（重複しないこと）を保証します
          </li>
          <li>
            <strong>用途</strong>：メールアドレス、ユーザー名など、他のレコードと重複してはならない属性に適用
          </li>
          <li>
            <strong>効果</strong>：データの一意性を保証し、重複データの挿入を防ぎます
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>ユーザーを追加してみよう（UNIQUE制約を体験）</h4>
        <div className="input-group">
          <label>username（UNIQUE）：</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="例: charlie"
          />
        </div>
        <div className="input-group">
          <label>email（UNIQUE）：</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="例: charlie@example.com"
          />
        </div>
        <button onClick={handleAddUser} className="add-button">
          ユーザーを追加
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      <div className="examples-table">
        <h4>ユーザーテーブル（username, email にUNIQUE制約）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>user_id</th>
              <th>username（UNIQUE）</th>
              <th>email（UNIQUE）</th>
            </tr>
          </thead>
          <tbody>
            {userIds.map((userId) => (
              <UniqueRow key={userId} userId={userId} />
            ))}
          </tbody>
        </table>
        <p className="hint">
          💡 同じusernameやemailで追加しようとすると、UNIQUE制約違反エラーが発生します
        </p>
      </div>
    </div>
  );
};

/**
 * PRIMARY KEY制約のデモ
 */
const PrimaryKeyConstraintDemo = () => {
  return (
    <div className="constraint-demo-content">
      <div className="explanation-box">
        <h4>PRIMARY KEY制約</h4>
        <ul>
          <li>
            <strong>定義</strong>：NOT NULLとUNIQUEを組み合わせた制約で、テーブルの主キーを定義します
          </li>
          <li>
            <strong>特徴</strong>：
            <ul>
              <li>一意性：テーブル内で重複不可</li>
              <li>NOT NULL：NULL値不可</li>
              <li>自動インデックス：主キーには自動的にインデックスが作成されます</li>
            </ul>
          </li>
          <li>
            <strong>用途</strong>：各レコードを一意に識別するための最も基本的な制約
          </li>
        </ul>
      </div>

      <div className="examples-table">
        <h4>PRIMARY KEY制約の例</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>user_id（PRIMARY KEY）🔑</th>
              <th>username</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>1</strong>
              </td>
              <td>alice</td>
              <td>alice@example.com</td>
            </tr>
            <tr>
              <td>
                <strong>2</strong>
              </td>
              <td>bob</td>
              <td>bob@example.com</td>
            </tr>
            <tr>
              <td>
                <strong>3</strong>
              </td>
              <td>charlie</td>
              <td>charlie@example.com</td>
            </tr>
          </tbody>
        </table>
        <p className="hint">
          💡 PRIMARY KEYは、NOT NULLとUNIQUEの両方の特性を持ちます
        </p>
      </div>
    </div>
  );
};

/**
 * UNIQUE行コンポーネント
 */
const UniqueRow = ({ userId }: { userId: string }) => {
  const user_id = useCell('users_constraints', userId, 'user_id');
  const username = useCell('users_constraints', userId, 'username');
  const email = useCell('users_constraints', userId, 'email');

  return (
    <tr>
      <td>{user_id}</td>
      <td>{username}</td>
      <td>{email}</td>
    </tr>
  );
};

/**
 * FOREIGN KEY制約のデモ
 */
const ForeignKeyDemo = () => {
  // TinyBaseからデータを取得
  const customerIds = useRowIds('customers');
  const orderIds = useRowIds('orders_constraints');

  const [newOrderCustomerId, setNewOrderCustomerId] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddOrder = () => {
    setError(null);
    setSuccess(null);

    if (!newOrderCustomerId || !newOrderAmount) {
      setError('❌ customer_idとtotal_amountは必須です');
      return;
    }

    const customerId = parseInt(newOrderCustomerId, 10);
    if (isNaN(customerId)) {
      setError('❌ customer_idは数値である必要があります');
      return;
    }

    // FOREIGN KEY制約チェック
    const existingCustomerIds = customerIds.map((id) =>
      Number(store.getCell('customers', id, 'customer_id'))
    );
    if (!existingCustomerIds.includes(customerId)) {
      setError(
        `❌ FOREIGN KEY制約違反：customer_id ${customerId} はcustomersテーブルに存在しません（参照整合性違反）`
      );
      return;
    }

    const newOrderId =
      Math.max(
        ...orderIds.map((id) => Number(store.getCell('orders_constraints', id, 'order_id'))),
        0
      ) + 1;
    store.setRow('orders_constraints', String(newOrderId), {
      order_id: newOrderId,
      customer_id: customerId,
      status: 'pending',
      created_at: new Date().toLocaleString('ja-JP'),
      total_amount: parseFloat(newOrderAmount),
    });
    setSuccess(`✅ 注文ID ${newOrderId} を追加しました`);
    setNewOrderCustomerId('');
    setNewOrderAmount('');
  };

  return (
    <div className="constraint-demo-content">
      <div className="explanation-box">
        <h4>FOREIGN KEY制約</h4>
        <ul>
          <li>
            <strong>目的</strong>：親テーブルの主キーを参照し、テーブル間の参照整合性を強制します
          </li>
          <li>
            <strong>効果</strong>：存在しない親レコードを子レコードが参照することを防ぎます
          </li>
          <li>
            <strong>参照アクション</strong>：
            <ul>
              <li>RESTRICT：子レコードが存在する場合、親の削除・更新を禁止</li>
              <li>CASCADE：親が削除されると、子も自動削除</li>
              <li>SET NULL：親が削除されると、子の外部キーをNULLに設定</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="tables-grid">
        <div className="table-container">
          <h4>顧客テーブル (customers)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>customer_id 🔑</th>
                <th>name</th>
              </tr>
            </thead>
            <tbody>
              {customerIds.map((customerId) => (
                <CustomerRow key={customerId} customerId={customerId} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>注文テーブル (orders)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>order_id 🔑</th>
                <th>customer_id（FOREIGN KEY）</th>
                <th>total_amount</th>
              </tr>
            </thead>
            <tbody>
              {orderIds.map((orderId) => (
                <OrderRow key={orderId} orderId={orderId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="interactive-demo">
        <h4>注文を追加してみよう（FOREIGN KEY制約を体験）</h4>
        <div className="input-group">
          <label>customer_id（FOREIGN KEY）：</label>
          <input
            type="number"
            value={newOrderCustomerId}
            onChange={(e) => setNewOrderCustomerId(e.target.value)}
            placeholder="例: 101, 102"
          />
        </div>
        <div className="input-group">
          <label>total_amount：</label>
          <input
            type="number"
            step="0.01"
            value={newOrderAmount}
            onChange={(e) => setNewOrderAmount(e.target.value)}
            placeholder="例: 39.99"
          />
        </div>
        <button onClick={handleAddOrder} className="add-button">
          注文を追加
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <p className="hint">
          💡 存在しないcustomer_id（例: 999）で追加しようとすると、FOREIGN KEY制約違反エラーが発生します
        </p>
      </div>
    </div>
  );
};

/**
 * 顧客行コンポーネント
 */
const CustomerRow = ({ customerId }: { customerId: string }) => {
  const customer_id = useCell('customers', customerId, 'customer_id');
  const name = useCell('customers', customerId, 'name');

  return (
    <tr>
      <td>{customer_id}</td>
      <td>{name}</td>
    </tr>
  );
};

/**
 * 注文行コンポーネント
 */
const OrderRow = ({ orderId }: { orderId: string }) => {
  const order_id = useCell('orders_constraints', orderId, 'order_id');
  const customer_id = useCell('orders_constraints', orderId, 'customer_id');
  const total_amount = useCell('orders_constraints', orderId, 'total_amount');

  return (
    <tr>
      <td>{order_id}</td>
      <td>{customer_id}</td>
      <td>${total_amount}</td>
    </tr>
  );
};

/**
 * CHECK制約のデモ
 */
const CheckDemo = () => {
  // TinyBaseから製品データを取得
  const productIds = useRowIds('products_constraints');

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddProduct = () => {
    setError(null);
    setSuccess(null);

    if (!newName || !newPrice || !newStock) {
      setError('❌ すべての項目は必須です');
      return;
    }

    const price = parseFloat(newPrice);
    const stock = parseInt(newStock, 10);

    // CHECK制約：price >= 0
    if (price < 0) {
      setError('❌ CHECK制約違反：priceは0以上である必要があります');
      return;
    }

    // CHECK制約：stock >= 0
    if (stock < 0) {
      setError('❌ CHECK制約違反：stockは0以上である必要があります');
      return;
    }

    const newId =
      Math.max(
        ...productIds.map((id) =>
          Number(store.getCell('products_constraints', id, 'product_id'))
        ),
        0
      ) + 1;
    store.setRow('products_constraints', String(newId), {
      product_id: newId,
      name: newName,
      price,
      stock,
    });
    setSuccess(`✅ 製品「${newName}」を追加しました`);
    setNewName('');
    setNewPrice('');
    setNewStock('');
  };

  return (
    <div className="constraint-demo-content">
      <div className="explanation-box">
        <h4>CHECK制約</h4>
        <ul>
          <li>
            <strong>目的</strong>：カラムの値が指定された特定の条件を満たすことを保証します
          </li>
          <li>
            <strong>例</strong>：
            <ul>
              <li>age {'>='} 0（年齢は0以上）</li>
              <li>price {'>'} 0（価格は正の値）</li>
              <li>status IN ('active', 'inactive')（ステータスは特定の値のみ）</li>
            </ul>
          </li>
          <li>
            <strong>効果</strong>：ビジネスルールをデータベースレベルで強制し、不正なデータの挿入を防ぎます
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>製品を追加してみよう（CHECK制約を体験）</h4>
        <div className="input-group">
          <label>name：</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="例: Product C"
          />
        </div>
        <div className="input-group">
          <label>price（CHECK: {'>='} 0）：</label>
          <input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="例: 39.99"
          />
        </div>
        <div className="input-group">
          <label>stock（CHECK: {'>='} 0）：</label>
          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="例: 20"
          />
        </div>
        <button onClick={handleAddProduct} className="add-button">
          製品を追加
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <p className="hint">
          💡 負の値（例: -10）を入力しようとすると、CHECK制約違反エラーが発生します
        </p>
      </div>

      <div className="examples-table">
        <h4>製品テーブル（price, stock にCHECK制約）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>product_id</th>
              <th>name</th>
              <th>price（CHECK: {'>='} 0）</th>
              <th>stock（CHECK: {'>='} 0）</th>
            </tr>
          </thead>
          <tbody>
            {productIds.map((productId) => (
              <CheckRow key={productId} productId={productId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * CHECK行コンポーネント
 */
const CheckRow = ({ productId }: { productId: string }) => {
  const product_id = useCell('products_constraints', productId, 'product_id');
  const name = useCell('products_constraints', productId, 'name');
  const price = useCell('products_constraints', productId, 'price');
  const stock = useCell('products_constraints', productId, 'stock');

  return (
    <tr>
      <td>{product_id}</td>
      <td>{name}</td>
      <td>${price}</td>
      <td>{stock}</td>
    </tr>
  );
};

/**
 * DEFAULT制約のデモ
 */
const DefaultDemo = () => {
  // TinyBaseから注文データを取得
  const orderIds = useRowIds('orders_constraints');

  const [newCustomerId, setNewCustomerId] = useState('');
  const [newStatus, setNewStatus] = useState('pending');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddOrder = () => {
    setError(null);
    setSuccess(null);

    if (!newCustomerId) {
      setError('❌ customer_idは必須です');
      return;
    }

    const customerId = parseInt(newCustomerId, 10);
    if (isNaN(customerId)) {
      setError('❌ customer_idは数値である必要があります');
      return;
    }

    // DEFAULT制約：created_atに現在時刻を自動設定
    const now = new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newOrderId =
      Math.max(
        ...orderIds.map((id) => Number(store.getCell('orders_constraints', id, 'order_id'))),
        0
      ) + 1;
    store.setRow('orders_constraints', String(newOrderId), {
      order_id: newOrderId,
      customer_id: customerId,
      status: newStatus,
      created_at: now, // DEFAULT制約により自動設定
    });
    setSuccess(
      `✅ 注文ID ${newOrderId} を追加しました（created_atは自動設定されました）`
    );
    setNewCustomerId('');
    setNewStatus('pending');
  };

  return (
    <div className="constraint-demo-content">
      <div className="explanation-box">
        <h4>DEFAULT制約</h4>
        <ul>
          <li>
            <strong>目的</strong>：レコード挿入時にカラムの値が指定されなかった場合に、自動的に挿入されるデフォルト値を設定します
          </li>
          <li>
            <strong>例</strong>：
            <ul>
              <li>created_atカラムに現在時刻を自動設定</li>
              <li>statusカラムに'pending'をデフォルト値として設定</li>
              <li>is_activeカラムにtrueをデフォルト値として設定</li>
            </ul>
          </li>
          <li>
            <strong>効果</strong>：開発者の負担を軽減し、一貫性のあるデータを保証します
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>注文を追加してみよう（DEFAULT制約を体験）</h4>
        <div className="input-group">
          <label>customer_id：</label>
          <input
            type="number"
            value={newCustomerId}
            onChange={(e) => setNewCustomerId(e.target.value)}
            placeholder="例: 103"
          />
        </div>
        <div className="input-group">
          <label>status（DEFAULT: 'pending'）：</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <button onClick={handleAddOrder} className="add-button">
          注文を追加
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <p className="hint">
          💡 created_atは自動的に現在時刻が設定されます（DEFAULT制約）
        </p>
      </div>

      <div className="examples-table">
        <h4>注文テーブル（created_at にDEFAULT制約）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>order_id</th>
              <th>customer_id</th>
              <th>status</th>
              <th>created_at（DEFAULT: 現在時刻）</th>
            </tr>
          </thead>
          <tbody>
            {orderIds.map((orderId) => (
              <DefaultRow key={orderId} orderId={orderId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * DEFAULT行コンポーネント
 */
const DefaultRow = ({ orderId }: { orderId: string }) => {
  const order_id = useCell('orders_constraints', orderId, 'order_id');
  const customer_id = useCell('orders_constraints', orderId, 'customer_id');
  const status = useCell('orders_constraints', orderId, 'status');
  const created_at = useCell('orders_constraints', orderId, 'created_at');

  return (
    <tr>
      <td>{order_id}</td>
      <td>{customer_id}</td>
      <td>{status}</td>
      <td>{created_at}</td>
    </tr>
  );
};

