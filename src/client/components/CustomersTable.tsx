import { useRowIds, useCell } from 'tinybase/ui-react';

/**
 * 顧客テーブルコンポーネント
 * 原理1：単一責任の原則 - 顧客エンティティのみを表示
 */
export const CustomersTable = () => {
  const customerIds = useRowIds('customers');

  if (customerIds.length === 0) {
    return <p>顧客データがありません</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>顧客ID</th>
          <th>名前</th>
          <th>メールアドレス</th>
        </tr>
      </thead>
      <tbody>
        {customerIds.map((customerId) => (
          <CustomerRow key={customerId} customerId={customerId} />
        ))}
      </tbody>
    </table>
  );
};

/**
 * 顧客行コンポーネント
 */
const CustomerRow = ({ customerId }: { customerId: string }) => {
  const customerIdValue = useCell('customers', customerId, 'customer_id');
  const name = useCell('customers', customerId, 'name');
  const email = useCell('customers', customerId, 'email');

  return (
    <tr>
      <td>{customerIdValue}</td>
      <td>{name}</td>
      <td>{email}</td>
    </tr>
  );
};

