import { useRowIds, useCell } from 'tinybase/ui-react';

/**
 * 注文テーブルコンポーネント
 * 原理5：リレーションシップの定義 - 顧客との1対多関係を表示
 */
export const OrdersTable = () => {
  const orderIds = useRowIds('orders');

  if (orderIds.length === 0) {
    return <p>注文データがありません</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>注文ID</th>
          <th>顧客ID</th>
          <th>注文日時</th>
          <th>合計金額</th>
        </tr>
      </thead>
      <tbody>
        {orderIds.map((orderId) => (
          <OrderRow key={orderId} orderId={orderId} />
        ))}
      </tbody>
    </table>
  );
};

/**
 * 注文行コンポーネント
 */
const OrderRow = ({ orderId }: { orderId: string }) => {
  const orderIdValue = useCell('orders', orderId, 'order_id');
  const customerId = useCell('orders', orderId, 'customer_id');
  const orderDate = useCell('orders', orderId, 'order_date');
  const totalAmount = useCell('orders', orderId, 'total_amount');

  const formattedDate =
    orderDate && typeof orderDate === 'string'
      ? new Date(orderDate).toLocaleString('ja-JP')
      : '-';

  return (
    <tr>
      <td>{orderIdValue}</td>
      <td>{customerId}</td>
      <td>{formattedDate}</td>
      <td>${totalAmount}</td>
    </tr>
  );
};

