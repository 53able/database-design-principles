import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Product, Customer, Order } from '../shared/schemas';

/**
 * Honoバックエンドサーバー
 * データベース設計の原理原則を学ぶためのAPIエンドポイント
 */
const app = new Hono();

// CORS設定
app.use('/*', cors());

/**
 * ヘルスチェックエンドポイント
 */
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'サーバーは正常に動作しています' });
});

/**
 * 製品一覧取得
 * GET /api/products
 */
app.get('/api/products', (c) => {
  // サンプルデータ
  const products: Product[] = [
    {
      product_id: 1,
      name: 'Selfie Toaster',
      price: 24.99,
      description: 'セルフィーが撮れるトースター',
    },
    {
      product_id: 2,
      name: 'Cat-Poop Coffee',
      price: 29.99,
      description: '猫の糞から作られたコーヒー',
    },
  ];

  return c.json(products);
});

/**
 * 顧客一覧取得
 * GET /api/customers
 */
app.get('/api/customers', (c) => {
  // サンプルデータ
  const customers: Customer[] = [
    {
      customer_id: 101,
      name: 'John Doe',
      email: 'john.doe@email.com',
    },
    {
      customer_id: 102,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
    },
    {
      customer_id: 103,
      name: 'Peter Jones',
      email: 'peter.jones@email.com',
    },
  ];

  return c.json(customers);
});

/**
 * 注文一覧取得
 * GET /api/orders
 */
app.get('/api/orders', (c) => {
  // サンプルデータ
  const orders: Order[] = [
    {
      order_id: 1,
      customer_id: 101,
      order_date: new Date().toISOString(),
      total_amount: 24.99,
    },
    {
      order_id: 2,
      customer_id: 102,
      order_date: new Date().toISOString(),
      total_amount: 29.99,
    },
    {
      order_id: 3,
      customer_id: 103,
      order_date: new Date().toISOString(),
      total_amount: 24.99,
    },
  ];

  return c.json(orders);
});

/**
 * サーバー起動
 */
const port = 3000;
serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 サーバーが http://localhost:${port} で起動しました`);

