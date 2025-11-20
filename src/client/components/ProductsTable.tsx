import { useRowIds, useCell } from 'tinybase/ui-react';

/**
 * 製品テーブルコンポーネント
 * 原理1：単一責任の原則 - 製品エンティティのみを表示
 */
export const ProductsTable = () => {
  const productIds = useRowIds('products');

  if (productIds.length === 0) {
    return <p>製品データがありません</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>製品ID</th>
          <th>製品名</th>
          <th>価格</th>
          <th>説明</th>
        </tr>
      </thead>
      <tbody>
        {productIds.map((productId) => (
          <ProductRow key={productId} productId={productId} />
        ))}
      </tbody>
    </table>
  );
};

/**
 * 製品行コンポーネント
 */
const ProductRow = ({ productId }: { productId: string }) => {
  const productIdValue = useCell('products', productId, 'product_id');
  const name = useCell('products', productId, 'name');
  const price = useCell('products', productId, 'price');
  const description = useCell('products', productId, 'description');

  return (
    <tr>
      <td>{productIdValue}</td>
      <td>{name}</td>
      <td>${price}</td>
      <td>{description ?? '-'}</td>
    </tr>
  );
};

