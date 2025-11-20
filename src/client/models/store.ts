import { createStore } from 'tinybase/with-schemas';

/**
 * TinyBaseストアのスキーマ定義
 * 原理1：単一責任の原則に基づき、各テーブルを分離
 * 原理3：キーによる一意性の確保（各テーブルに主キーを定義）
 * 原理5：リレーションシップの明確な定義
 * 
 * `as const`を付けることで、TypeScriptの型推論が正しく機能します。
 * @see https://tinybase.org/guides/schemas/schema-based-typing/
 */
const tablesSchema = {
  // 製品テーブル
  products: {
    product_id: { type: 'number' },
    name: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' },
  },
  // 顧客テーブル
  customers: {
    customer_id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string' },
  },
  // 注文テーブル
  orders: {
    order_id: { type: 'number' },
    customer_id: { type: 'number' },
    order_date: { type: 'string' },
    total_amount: { type: 'number' },
  },
  // 注文明細テーブル
  order_items: {
    order_item_id: { type: 'number' },
    order_id: { type: 'number' },
    product_id: { type: 'number' },
    quantity: { type: 'number' },
    unit_price: { type: 'number' },
  },
  // 悪い設計のテーブル（アノマリーデモ用）
  bad_design: {
    product_id: { type: 'number' },
    name: { type: 'string' },
    price: { type: 'number' },
    customer_id: { type: 'number' },
    customer_name: { type: 'string' },
    customer_email: { type: 'string' },
  },
  // ユーザーテーブル（キーデモ用）
  users: {
    user_id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
  },
  // サロゲートキーデモ用製品テーブル
  products_surrogate: {
    product_id: { type: 'number' },
    sku: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'number' },
  },
  // 非正規形テーブル（正規化デモ用）
  employees_unnormalized: {
    employee_id: { type: 'number' },
    employee_name: { type: 'string' },
    department_id: { type: 'number' },
    department_name: { type: 'string' },
    skills: { type: 'string' },
  },
  // 正規化後のテーブル
  employees: {
    employee_id: { type: 'number' },
    employee_name: { type: 'string' },
    department_id: { type: 'number' },
  },
  departments: {
    department_id: { type: 'number' },
    department_name: { type: 'string' },
  },
  employee_skills: {
    employee_id: { type: 'number' },
    skill: { type: 'string' },
  },
  // 制約デモ用テーブル
  users_constraints: {
    user_id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
  },
  products_constraints: {
    product_id: { type: 'number' },
    name: { type: 'string' },
    price: { type: 'number' },
    stock: { type: 'number' },
  },
  orders_constraints: {
    order_id: { type: 'number' },
    customer_id: { type: 'number' },
    status: { type: 'string' },
    created_at: { type: 'string' },
    total_amount: { type: 'number' },
  },
} as const;

/**
 * TinyBaseストアの定義
 * スキーマベースのストアとして初期化
 * 
 * `setSchema()`の戻り値を代入することで、型付けが有効になります。
 * @see https://tinybase.org/guides/schemas/schema-based-typing/
 */
export const store = createStore().setSchema(tablesSchema);

/**
 * 初期データの投入
 * ドキュメントの例に基づいたサンプルデータ
 * 
 * スキーマベースのストアでは、setTable()でテーブル全体を設定します。
 * スキーマに定義された型に従って自動的に型チェックが行われます。
 * @see https://github.com/tinyplex/tinybase
 */
export const initializeStore = (): void => {
  // 製品テーブル
  // 原理1：単一責任の原則 - 製品エンティティのみを格納
  // 原理3：主キーとしてproduct_idを使用
  store.setTable('products', {
    1: {
      product_id: 1,
      name: 'Selfie Toaster',
      price: 24.99,
      description: 'セルフィーが撮れるトースター',
    },
    2: {
      product_id: 2,
      name: 'Cat-Poop Coffee',
      price: 29.99,
      description: '猫の糞から作られたコーヒー',
    },
  });

  // 顧客テーブル
  // 原理1：単一責任の原則 - 顧客エンティティのみを格納
  // 原理3：主キーとしてcustomer_idを使用
  store.setTable('customers', {
    101: {
      customer_id: 101,
      name: 'John Doe',
      email: 'john.doe@email.com',
    },
    102: {
      customer_id: 102,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
    },
    103: {
      customer_id: 103,
      name: 'Peter Jones',
      email: 'peter.jones@email.com',
    },
  });

  // 注文テーブル
  // 原理1：単一責任の原則 - 注文エンティティのみを格納
  // 原理3：主キーとしてorder_idを使用
  // 原理5：リレーションシップ - customer_idでcustomersテーブルと関連
  store.setTable('orders', {
    1: {
      order_id: 1,
      customer_id: 101,
      order_date: new Date().toISOString(),
      total_amount: 24.99,
    },
    2: {
      order_id: 2,
      customer_id: 102,
      order_date: new Date().toISOString(),
      total_amount: 29.99,
    },
    3: {
      order_id: 3,
      customer_id: 103,
      order_date: new Date().toISOString(),
      total_amount: 24.99,
    },
  });

  // 注文明細テーブル（ジャンクションテーブル）
  // 原理1：単一責任の原則 - 注文明細エンティティのみを格納
  // 原理3：主キーとしてorder_item_idを使用
  // 原理5：多対多リレーションシップ - order_idとproduct_idで関連テーブルと接続
  store.setTable('order_items', {
    1: {
      order_item_id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 1,
      unit_price: 24.99,
    },
    2: {
      order_item_id: 2,
      order_id: 2,
      product_id: 2,
      quantity: 1,
      unit_price: 29.99,
    },
    3: {
      order_item_id: 3,
      order_id: 3,
      product_id: 1,
      quantity: 1,
      unit_price: 24.99,
    },
  });

  // 悪い設計のテーブル（アノマリーデモ用）
  // 原理1の反例：製品と顧客が混在している
  store.setTable('bad_design', {
    1: {
      product_id: 1,
      name: 'Selfie Toaster',
      price: 24.99,
      customer_id: 101,
      customer_name: 'John Doe',
      customer_email: 'john.doe@email.com',
    },
    2: {
      product_id: 2,
      name: 'Cat-Poop Coffee',
      price: 29.99,
      customer_id: 102,
      customer_name: 'Jane Smith',
      customer_email: 'jane.smith@email.com',
    },
    3: {
      product_id: 1,
      name: 'Selfie Toaster',
      price: 24.99,
      customer_id: 103,
      customer_name: 'Peter Jones',
      customer_email: 'peter.jones@email.com',
    },
  });

  // 原理3：キーデモ用テーブル
  // 主キー、候補キー、サロゲートキーのデモ
  store.setTable('users', {
    1: {
      user_id: 1,
      username: 'alice',
      email: 'alice@example.com',
      phone: '090-1234-5678',
    },
    2: {
      user_id: 2,
      username: 'bob',
      email: 'bob@example.com',
      phone: '090-2345-6789',
    },
    3: {
      user_id: 3,
      username: 'charlie',
      email: 'charlie@example.com',
      phone: '090-3456-7890',
    },
  });

  // サロゲートキーデモ用製品テーブル
  store.setTable('products_surrogate', {
    1: {
      product_id: 1,
      sku: 'PROD-001',
      name: 'Selfie Toaster',
      price: 24.99,
    },
    2: {
      product_id: 2,
      sku: 'PROD-002',
      name: 'Cat-Poop Coffee',
      price: 29.99,
    },
    3: {
      product_id: 3,
      sku: 'PROD-003',
      name: 'Unicorn Horn',
      price: 39.99,
    },
  });

  // 原理4：正規化デモ用テーブル
  // 非正規形（デモ用 - 実際には使わない）
  store.setTable('employees_unnormalized', {
    1: {
      employee_id: 1,
      employee_name: '山田太郎',
      department_id: 101,
      department_name: '営業部',
      skills: 'SQL, JavaScript, Python',
    },
    2: {
      employee_id: 2,
      employee_name: '佐藤花子',
      department_id: 101,
      department_name: '営業部',
      skills: 'Java, TypeScript',
    },
    3: {
      employee_id: 3,
      employee_name: '鈴木一郎',
      department_id: 102,
      department_name: '開発部',
      skills: 'Python, Go',
    },
  });

  // 正規化後のテーブル
  store.setTable('employees', {
    1: {
      employee_id: 1,
      employee_name: '山田太郎',
      department_id: 101,
    },
    2: {
      employee_id: 2,
      employee_name: '佐藤花子',
      department_id: 101,
    },
    3: {
      employee_id: 3,
      employee_name: '鈴木一郎',
      department_id: 102,
    },
  });

  store.setTable('departments', {
    101: {
      department_id: 101,
      department_name: '営業部',
    },
    102: {
      department_id: 102,
      department_name: '開発部',
    },
  });

  store.setTable('employee_skills', {
    '1-SQL': {
      employee_id: 1,
      skill: 'SQL',
    },
    '1-JavaScript': {
      employee_id: 1,
      skill: 'JavaScript',
    },
    '1-Python': {
      employee_id: 1,
      skill: 'Python',
    },
    '2-Java': {
      employee_id: 2,
      skill: 'Java',
    },
    '2-TypeScript': {
      employee_id: 2,
      skill: 'TypeScript',
    },
    '3-Python': {
      employee_id: 3,
      skill: 'Python',
    },
    '3-Go': {
      employee_id: 3,
      skill: 'Go',
    },
  });

  // 原理6：制約デモ用テーブル
  // NOT NULL, UNIQUE制約デモ用
  store.setTable('users_constraints', {
    1: {
      user_id: 1,
      username: 'alice',
      email: 'alice@example.com',
    },
    2: {
      user_id: 2,
      username: 'bob',
      email: 'bob@example.com',
    },
  });

  // CHECK制約デモ用
  store.setTable('products_constraints', {
    1: {
      product_id: 1,
      name: 'Product A',
      price: 24.99,
      stock: 10,
    },
    2: {
      product_id: 2,
      name: 'Product B',
      price: 29.99,
      stock: 5,
    },
  });

  // DEFAULT制約、FOREIGN KEY制約デモ用
  store.setTable('orders_constraints', {
    1: {
      order_id: 1,
      customer_id: 101,
      status: 'pending',
      created_at: '2024-01-15 10:30:00',
    },
    2: {
      order_id: 2,
      customer_id: 102,
      status: 'completed',
      created_at: '2024-01-15 11:00:00',
    },
  });
};

