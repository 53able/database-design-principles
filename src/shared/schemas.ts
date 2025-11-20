import { z } from 'zod';

/**
 * 製品スキーマ
 * 原理1：単一責任の原則に基づき、製品エンティティを定義
 */
export const ProductSchema = z.object({
  product_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  description: z.string().optional(),
});

/**
 * 顧客スキーマ
 * 原理1：単一責任の原則に基づき、顧客エンティティを定義
 */
export const CustomerSchema = z.object({
  customer_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

/**
 * 注文スキーマ
 * 原理5：リレーションシップの定義（1対多：顧客-注文）
 */
export const OrderSchema = z.object({
  order_id: z.number().int().positive(),
  customer_id: z.number().int().positive(),
  order_date: z.string().datetime(),
  total_amount: z.number().nonnegative(),
});

/**
 * 注文明細スキーマ
 * 原理5：リレーションシップの定義（多対多：注文-製品）
 */
export const OrderItemSchema = z.object({
  order_item_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

