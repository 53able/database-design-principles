import { useState } from 'react';
import { useRowIds, useCell } from 'tinybase/ui-react';
import { store } from '../models/store';

/**
 * 原理3：キーによる一意性と整合性の確保デモ
 * 主キー、候補キー、サロゲートキーの概念を学ぶ
 */
export const KeyDemo = () => {
  const [selectedTab, setSelectedTab] = useState<
    'primary' | 'candidate' | 'surrogate'
  >('primary');

  return (
    <div className="key-demo">
      <div className="key-tabs">
        <button
          className={selectedTab === 'primary' ? 'active' : ''}
          onClick={() => setSelectedTab('primary')}
        >
          🔑 主キー (Primary Key)
        </button>
        <button
          className={selectedTab === 'candidate' ? 'active' : ''}
          onClick={() => setSelectedTab('candidate')}
        >
          🎯 候補キー (Candidate Key)
        </button>
        <button
          className={selectedTab === 'surrogate' ? 'active' : ''}
          onClick={() => setSelectedTab('surrogate')}
        >
          🔢 サロゲートキー (Surrogate Key)
        </button>
      </div>

      {selectedTab === 'primary' && <PrimaryKeyDemo />}
      {selectedTab === 'candidate' && <CandidateKeyDemo />}
      {selectedTab === 'surrogate' && <SurrogateKeyDemo />}
    </div>
  );
};

/**
 * 主キーのデモ
 */
const PrimaryKeyDemo = () => {
  const [newUserId, setNewUserId] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // TinyBaseからユーザーデータを取得
  const userIds = useRowIds('users');

  const handleAddUser = () => {
    setError(null);
    setSuccess(null);

    if (!newUserId || !newUsername) {
      setError('❌ ユーザーIDとユーザー名は必須です');
      return;
    }

    const userId = parseInt(newUserId, 10);
    if (isNaN(userId)) {
      setError('❌ ユーザーIDは数値である必要があります');
      return;
    }

    // 主キーの一意性チェック
    if (store.hasRow('users', String(userId))) {
      setError(
        `❌ 主キー制約違反：ユーザーID ${userId} は既に存在します（一意性制約）`
      );
      return;
    }

    // NULLチェック（主キーはNULL不可）
    if (userId === null || userId === undefined) {
      setError('❌ 主キー制約違反：ユーザーIDはNULLであってはなりません（NOT NULL制約）');
      return;
    }

    store.setRow('users', String(userId), {
      user_id: userId,
      username: newUsername,
      email: '',
      phone: '',
    });
    setSuccess(`✅ ユーザーID ${userId} でユーザー「${newUsername}」を追加しました`);
    setNewUserId('');
    setNewUsername('');
  };

  const handleDeleteUser = (userId: string) => {
    store.delRow('users', userId);
    setSuccess(`✅ ユーザーID ${userId} を削除しました`);
    setError(null);
  };

  return (
    <div className="key-demo-content">
      <div className="explanation-box">
        <h4>主キー (Primary Key) の特徴</h4>
        <ul>
          <li>
            <strong>一意性</strong>：テーブル内で重複する値を持つことができません
          </li>
          <li>
            <strong>NOT NULL</strong>：NULL値を持つことができません
          </li>
          <li>
            <strong>安定性</strong>：レコードの生存期間中に変更されるべきではありません
          </li>
          <li>
            <strong>単純性</strong>：可能な限り単一の属性からなることが望ましいです
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>ユーザーを追加してみよう（主キー制約を体験）</h4>
        <div className="input-group">
          <label>ユーザーID（主キー）：</label>
          <input
            type="number"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            placeholder="例: 4"
          />
        </div>
        <div className="input-group">
          <label>ユーザー名：</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="例: david"
          />
        </div>
        <button onClick={handleAddUser} className="add-button">
          ユーザーを追加
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      <div className="examples-table">
        <h4>ユーザーテーブル（user_id が主キー）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>user_id (主キー) 🔑</th>
              <th>username</th>
              <th>email</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {userIds.map((userId) => (
              <UserRow
                key={userId}
                userId={userId}
                onDelete={handleDeleteUser}
              />
            ))}
          </tbody>
        </table>
        <p className="hint">
          💡 同じuser_idで追加しようとすると、主キー制約違反エラーが発生します
        </p>
      </div>
    </div>
  );
};

/**
 * ユーザー行コンポーネント
 */
const UserRow = ({
  userId,
  onDelete,
}: {
  userId: string;
  onDelete: (userId: string) => void;
}) => {
  const user_id = useCell('users', userId, 'user_id');
  const username = useCell('users', userId, 'username');
  const email = useCell('users', userId, 'email');

  return (
    <tr>
      <td>
        <strong>{user_id}</strong>
      </td>
      <td>{username}</td>
      <td>{email || '-'}</td>
      <td>
        <button onClick={() => onDelete(userId)} className="delete-btn">
          削除
        </button>
      </td>
    </tr>
  );
};

/**
 * 候補キーのデモ
 */
const CandidateKeyDemo = () => {
  // TinyBaseからユーザーデータを取得
  const userIds = useRowIds('users');

  const candidateKeys = [
    {
      name: 'user_id',
      description: '自動生成される一意のID',
      isPrimary: true,
    },
    {
      name: 'username',
      description: 'ユーザー名（一意）',
      isPrimary: false,
    },
    {
      name: 'email',
      description: 'メールアドレス（一意）',
      isPrimary: false,
    },
    {
      name: 'phone',
      description: '電話番号（一意）',
      isPrimary: false,
    },
  ];

  return (
    <div className="key-demo-content">
      <div className="explanation-box">
        <h4>候補キー (Candidate Key) とは</h4>
        <ul>
          <li>
            <strong>定義</strong>：テーブル内のレコードを一意に識別できる、属性または属性の組み合わせの「最小セット」
          </li>
          <li>
            <strong>特徴</strong>：複数の候補キーが存在する場合があります
          </li>
          <li>
            <strong>主キーの選定</strong>：候補キーの中から1つを主キーとして選びます
          </li>
          <li>
            <strong>最小セット</strong>：「usernameとfirst_nameの組み合わせ」は候補キーではありません（usernameだけで十分なため）
          </li>
        </ul>
      </div>

      <div className="candidate-keys-list">
        <h4>このテーブルの候補キー候補</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>属性名</th>
              <th>説明</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {candidateKeys.map((key) => (
              <tr key={key.name}>
                <td>
                  <code>{key.name}</code>
                </td>
                <td>{key.description}</td>
                <td>
                  {key.isPrimary ? (
                    <span className="badge-primary">主キーとして選定</span>
                  ) : (
                    <span className="badge-candidate">候補キー</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="examples-table">
        <h4>ユーザーテーブル（複数の候補キーが存在）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>user_id 🔑</th>
              <th>username 🎯</th>
              <th>email 🎯</th>
              <th>phone 🎯</th>
            </tr>
          </thead>
          <tbody>
            {userIds.map((userId) => (
              <CandidateKeyRow key={userId} userId={userId} />
            ))}
          </tbody>
        </table>
        <p className="hint">
          💡 user_id、username、email、phone はそれぞれ単独でユーザーを特定できるため、すべて候補キーです。
          <br />
          この例では、user_id が主キーとして選定されています。
        </p>
      </div>
    </div>
  );
};

/**
 * 候補キー行コンポーネント
 */
const CandidateKeyRow = ({ userId }: { userId: string }) => {
  const user_id = useCell('users', userId, 'user_id');
  const username = useCell('users', userId, 'username');
  const email = useCell('users', userId, 'email');
  const phone = useCell('users', userId, 'phone');

  return (
    <tr>
      <td>
        <strong>{user_id}</strong>
      </td>
      <td>{username}</td>
      <td>{email}</td>
      <td>{phone}</td>
    </tr>
  );
};

/**
 * サロゲートキーのデモ
 */
const SurrogateKeyDemo = () => {
  // TinyBaseから製品データを取得
  const productIds = useRowIds('products_surrogate');

  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAddProduct = () => {
    if (!newSku || !newName || !newPrice) {
      return;
    }

    // サロゲートキー（自動生成）
    const nextId =
      Math.max(
        ...productIds.map((id) => Number(store.getCell('products_surrogate', id, 'product_id'))),
        0
      ) + 1;

    // TinyBaseに追加
    store.setRow('products_surrogate', String(nextId), {
      product_id: nextId,
      sku: newSku, // 自然キー（業務上の意味を持つ）
      name: newName,
      price: parseFloat(newPrice),
    });

    setNewSku('');
    setNewName('');
    setNewPrice('');
  };

  return (
    <div className="key-demo-content">
      <div className="explanation-box">
        <h4>サロゲートキー (Surrogate Key) とは</h4>
        <ul>
          <li>
            <strong>定義</strong>：業務上の意味を持たない、データベースが自動生成する代理のキー
          </li>
          <li>
            <strong>利点1：安定性</strong>：業務ロジックの変更に影響されません
            <br />
            例：SKUコードが変更されても、product_idは変更されない
          </li>
          <li>
            <strong>利点2：単純性</strong>：通常は整数型で、パフォーマンスが高い
          </li>
          <li>
            <strong>利点3：一意性の保証</strong>：データベースが自動的に一意性を保証します
          </li>
          <li>
            <strong>自然キーとの違い</strong>：SKUコード（'PROD-001'）は自然キー、product_id（1）はサロゲートキー
          </li>
        </ul>
      </div>

      <div className="comparison-box">
        <h4>サロゲートキー vs 自然キー</h4>
        <div className="comparison-grid">
          <div className="comparison-item">
            <h5>サロゲートキー（product_id）</h5>
            <ul>
              <li>✅ 業務ロジックに依存しない</li>
              <li>✅ 変更されない（安定性）</li>
              <li>✅ 整数型で高速</li>
              <li>✅ 自動生成可能</li>
            </ul>
          </div>
          <div className="comparison-item">
            <h5>自然キー（SKUコード）</h5>
            <ul>
              <li>⚠️ 業務ルール変更の影響を受ける</li>
              <li>⚠️ 変更される可能性がある</li>
              <li>⚠️ 文字列型で比較的遅い</li>
              <li>⚠️ 手動で管理が必要</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="interactive-demo">
        <h4>製品を追加してみよう（サロゲートキーが自動生成される）</h4>
        <div className="input-group">
          <label>SKUコード（自然キー）：</label>
          <input
            type="text"
            value={newSku}
            onChange={(e) => setNewSku(e.target.value)}
            placeholder="例: PROD-004"
          />
        </div>
        <div className="input-group">
          <label>製品名：</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="例: Magic Wand"
          />
        </div>
        <div className="input-group">
          <label>価格：</label>
          <input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="例: 49.99"
          />
        </div>
        <button onClick={handleAddProduct} className="add-button">
          製品を追加
        </button>
        <p className="hint">
          💡 product_id（サロゲートキー）は自動的に割り当てられます
        </p>
      </div>

      <div className="examples-table">
        <h4>製品テーブル（product_id がサロゲートキー）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>product_id 🔢<br />(サロゲートキー)</th>
              <th>sku 🏷️<br />(自然キー)</th>
              <th>name</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {productIds.map((productId) => (
              <SurrogateKeyRow key={productId} productId={productId} />
            ))}
          </tbody>
        </table>
        <p className="hint">
          💡 product_id は自動生成されるサロゲートキーで、SKUコードが変更されても影響を受けません
        </p>
      </div>
    </div>
  );
};

/**
 * サロゲートキー行コンポーネント
 */
const SurrogateKeyRow = ({ productId }: { productId: string }) => {
  const product_id = useCell('products_surrogate', productId, 'product_id');
  const sku = useCell('products_surrogate', productId, 'sku');
  const name = useCell('products_surrogate', productId, 'name');
  const price = useCell('products_surrogate', productId, 'price');

  return (
    <tr>
      <td>
        <strong>{product_id}</strong>
      </td>
      <td>
        <code>{sku}</code>
      </td>
      <td>{name}</td>
      <td>${price}</td>
    </tr>
  );
};

