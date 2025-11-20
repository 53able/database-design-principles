import { useState } from 'react';

/**
 * 原理2：データ型と命名規則の最適化デモ
 * データ型の選択と命名規則の重要性を学ぶ
 */
export const DataTypeDemo = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    'string' | 'integer' | 'decimal' | 'datetime' | 'naming'
  >('string');

  return (
    <div className="data-type-demo">
      <div className="category-tabs">
        <button
          className={selectedCategory === 'string' ? 'active' : ''}
          onClick={() => setSelectedCategory('string')}
        >
          📝 文字列型
        </button>
        <button
          className={selectedCategory === 'integer' ? 'active' : ''}
          onClick={() => setSelectedCategory('integer')}
        >
          🔢 整数型
        </button>
        <button
          className={selectedCategory === 'decimal' ? 'active' : ''}
          onClick={() => setSelectedCategory('decimal')}
        >
          💰 小数点数型
        </button>
        <button
          className={selectedCategory === 'datetime' ? 'active' : ''}
          onClick={() => setSelectedCategory('datetime')}
        >
          📅 時間・日付型
        </button>
        <button
          className={selectedCategory === 'naming' ? 'active' : ''}
          onClick={() => setSelectedCategory('naming')}
        >
          🏷️ 命名規則
        </button>
      </div>

      {selectedCategory === 'string' && <StringTypeDemo />}
      {selectedCategory === 'integer' && <IntegerTypeDemo />}
      {selectedCategory === 'decimal' && <DecimalTypeDemo />}
      {selectedCategory === 'datetime' && <DateTimeTypeDemo />}
      {selectedCategory === 'naming' && <NamingConventionDemo />}
    </div>
  );
};

/**
 * 文字列型のデモ
 */
const StringTypeDemo = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState<'CHAR' | 'VARCHAR' | 'TEXT'>(
    'VARCHAR'
  );

  const examples = [
    { label: '州コード', value: 'WA', recommended: 'CHAR(2)' },
    { label: 'ユーザー名', value: 'john_doe', recommended: 'VARCHAR(50)' },
    { label: '製品説明', value: 'これは非常に長い製品説明文です...', recommended: 'TEXT' },
  ];

  return (
    <div className="type-demo-content">
      <div className="explanation-box">
        <h4>文字列型の選択基準</h4>
        <ul>
          <li>
            <strong>CHAR</strong>：固定長データ（例：州コード 'WA'）に適しています
          </li>
          <li>
            <strong>VARCHAR</strong>：可変長データ（例：名前、メールアドレス）に適しています
          </li>
          <li>
            <strong>TEXT</strong>：長い文章（例：製品説明、コメント）に適しています
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>データ型を選択して試してみよう</h4>
        <div className="input-group">
          <label>入力値：</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="文字列を入力..."
          />
        </div>
        <div className="input-group">
          <label>データ型：</label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as 'CHAR' | 'VARCHAR' | 'TEXT')
            }
          >
            <option value="CHAR">CHAR(10)</option>
            <option value="VARCHAR">VARCHAR(255)</option>
            <option value="TEXT">TEXT</option>
          </select>
        </div>

        <div className="result-box">
          <h5>結果：</h5>
          {inputValue ? (
            <div>
              <p>
                入力値: <code>{inputValue}</code>
              </p>
              <p>
                長さ: {inputValue.length} 文字
              </p>
              <p>
                推奨データ型: {getRecommendedStringType(inputValue)}
              </p>
              {selectedType === 'CHAR' && inputValue.length !== 10 && (
                <p className="warning">
                  ⚠️ CHAR(10)は固定長なので、{inputValue.length}文字のデータには不適切です
                </p>
              )}
            </div>
          ) : (
            <p className="hint">上記の入力欄に文字列を入力してください</p>
          )}
        </div>
      </div>

      <div className="examples-table">
        <h4>実例</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>用途</th>
              <th>例</th>
              <th>推奨データ型</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((example, idx) => (
              <tr key={idx}>
                <td>{example.label}</td>
                <td>
                  <code>{example.value}</code>
                </td>
                <td>
                  <code>{example.recommended}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 整数型のデモ
 */
const IntegerTypeDemo = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState<
    'TINYINT' | 'INT' | 'BIGINT'
  >('INT');

  const typeRanges = {
    TINYINT: { min: 0, max: 255, signed: { min: -128, max: 127 } },
    INT: {
      min: 0,
      max: 4294967295,
      signed: { min: -2147483648, max: 2147483647 },
    },
    BIGINT: {
      min: 0,
      max: 18446744073709551615,
      signed: { min: -9223372036854775808, max: 9223372036854775807 },
    },
  };

  const currentRange = typeRanges[selectedType];
  const numValue = parseInt(inputValue, 10);

  return (
    <div className="type-demo-content">
      <div className="explanation-box">
        <h4>整数型の選択基準</h4>
        <ul>
          <li>
            <strong>TINYINT</strong>：0〜255（UNSIGNED）または -128〜127（SIGNED）
            <br />
            用途：ステータスコード、年齢など
          </li>
          <li>
            <strong>INT</strong>：約-21億〜21億（SIGNED）または 0〜42億（UNSIGNED）
            <br />
            用途：主キーID、数量など
          </li>
          <li>
            <strong>BIGINT</strong>：非常に大きな範囲
            <br />
            用途：将来の拡張を考慮した主キーなど
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>データ型を選択して試してみよう</h4>
        <div className="input-group">
          <label>入力値：</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="数値を入力..."
          />
        </div>
        <div className="input-group">
          <label>データ型：</label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as 'TINYINT' | 'INT' | 'BIGINT')
            }
          >
            <option value="TINYINT">TINYINT (UNSIGNED)</option>
            <option value="INT">INT (UNSIGNED)</option>
            <option value="BIGINT">BIGINT (UNSIGNED)</option>
          </select>
        </div>

        <div className="result-box">
          <h5>結果：</h5>
          {inputValue && !isNaN(numValue) ? (
            <div>
              <p>
                入力値: <code>{numValue}</code>
              </p>
              <p>
                範囲: {currentRange.min.toLocaleString()} 〜{' '}
                {currentRange.max.toLocaleString()} (UNSIGNED)
              </p>
              {numValue >= currentRange.min && numValue <= currentRange.max ? (
                <p className="success">
                  ✅ この値は {selectedType} に収まります
                </p>
              ) : (
                <p className="error">
                  ❌ この値は {selectedType} の範囲外です
                </p>
              )}
              <p className="hint">
                推奨: {getRecommendedIntegerType(numValue)}
              </p>
            </div>
          ) : (
            <p className="hint">上記の入力欄に数値を入力してください</p>
          )}
        </div>
      </div>

      <div className="examples-table">
        <h4>データ型の範囲</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>データ型</th>
              <th>UNSIGNED 範囲</th>
              <th>SIGNED 範囲</th>
              <th>用途例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>TINYINT</code>
              </td>
              <td>0 〜 255</td>
              <td>-128 〜 127</td>
              <td>ステータスコード、年齢</td>
            </tr>
            <tr>
              <td>
                <code>INT</code>
              </td>
              <td>0 〜 4,294,967,295</td>
              <td>-2,147,483,648 〜 2,147,483,647</td>
              <td>主キーID、数量</td>
            </tr>
            <tr>
              <td>
                <code>BIGINT</code>
              </td>
              <td>0 〜 18,446,744,073,709,551,615</td>
              <td>-9,223,372,036,854,775,808 〜 9,223,372,036,854,775,807</td>
              <td>将来の拡張を考慮した主キー</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 小数点数型のデモ
 */
const DecimalTypeDemo = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState<'DECIMAL' | 'FLOAT'>(
    'DECIMAL'
  );

  return (
    <div className="type-demo-content">
      <div className="explanation-box">
        <h4>小数点数型の選択基準</h4>
        <ul>
          <li>
            <strong>DECIMAL</strong>：絶対的な精度が必要な場合（金額計算など）
            <br />
            例：DECIMAL(7, 2) = 全体7桁、小数点以下2桁（99999.99まで）
          </li>
          <li>
            <strong>FLOAT/DOUBLE</strong>：近似値で十分な場合（科学技術計算など）
            <br />
            注意：丸め誤差が発生する可能性があります
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>データ型を選択して試してみよう</h4>
        <div className="input-group">
          <label>入力値：</label>
          <input
            type="number"
            step="0.01"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="小数値を入力..."
          />
        </div>
        <div className="input-group">
          <label>データ型：</label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as 'DECIMAL' | 'FLOAT')
            }
          >
            <option value="DECIMAL">DECIMAL(7, 2)</option>
            <option value="FLOAT">FLOAT</option>
          </select>
        </div>

        <div className="result-box">
          <h5>結果：</h5>
          {inputValue && !isNaN(parseFloat(inputValue)) ? (
            <div>
              <p>
                入力値: <code>{inputValue}</code>
              </p>
              {selectedType === 'DECIMAL' ? (
                <div>
                  <p className="success">
                    ✅ DECIMAL(7, 2) は正確な値を保持します
                  </p>
                  <p className="hint">
                    用途：金額計算、在庫数など精度が重要な場合
                  </p>
                </div>
              ) : (
                <div>
                  <p className="warning">
                    ⚠️ FLOAT は近似値のため、丸め誤差が発生する可能性があります
                  </p>
                  <p className="hint">
                    用途：科学技術計算など、近似値で十分な場合
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="hint">上記の入力欄に小数値を入力してください</p>
          )}
        </div>
      </div>

      <div className="examples-table">
        <h4>実例</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>用途</th>
              <th>推奨データ型</th>
              <th>理由</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>商品価格</td>
              <td>
                <code>DECIMAL(7, 2)</code>
              </td>
              <td>金額計算では精度が重要</td>
            </tr>
            <tr>
              <td>在庫数</td>
              <td>
                <code>DECIMAL(10, 2)</code>
              </td>
              <td>正確な数量管理が必要</td>
            </tr>
            <tr>
              <td>科学計算</td>
              <td>
                <code>FLOAT</code>
              </td>
              <td>近似値で十分、計算速度が重要</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 時間・日付型のデモ
 */
const DateTimeTypeDemo = () => {
  return (
    <div className="type-demo-content">
      <div className="explanation-box">
        <h4>時間・日付型の選択基準</h4>
        <ul>
          <li>
            <strong>TIMESTAMP</strong>：タイムゾーンを考慮したイベント記録
            <br />
            用途：最終ログイン時刻、作成日時など
            <br />
            一般的にUTC（協定世界時）で保存
          </li>
          <li>
            <strong>DATETIME</strong>：日付と時間の両方が必要
            <br />
            用途：予約日時、イベント日時など
          </li>
          <li>
            <strong>DATE</strong>：日付のみで十分
            <br />
            用途：誕生日、契約日など
          </li>
        </ul>
      </div>

      <div className="examples-table">
        <h4>実例</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>用途</th>
              <th>推奨データ型</th>
              <th>例</th>
              <th>理由</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>最終ログイン時刻</td>
              <td>
                <code>TIMESTAMP</code>
              </td>
              <td>2024-01-15 10:30:00 UTC</td>
              <td>タイムゾーン変換が必要</td>
            </tr>
            <tr>
              <td>注文日時</td>
              <td>
                <code>DATETIME</code>
              </td>
              <td>2024-01-15 10:30:00</td>
              <td>日付と時間の両方が必要</td>
            </tr>
            <tr>
              <td>誕生日</td>
              <td>
                <code>DATE</code>
              </td>
              <td>1990-05-20</td>
              <td>時間情報は不要</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="current-time-demo">
        <h4>現在時刻の例</h4>
        <div className="time-examples">
          <div className="time-box">
            <strong>TIMESTAMP</strong>
            <code>{new Date().toISOString()}</code>
            <span className="hint">UTC形式</span>
          </div>
          <div className="time-box">
            <strong>DATETIME</strong>
            <code>
              {new Date().toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </code>
            <span className="hint">ローカル形式</span>
          </div>
          <div className="time-box">
            <strong>DATE</strong>
            <code>
              {new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </code>
            <span className="hint">日付のみ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 命名規則のデモ
 */
const NamingConventionDemo = () => {
  const [inputName, setInputName] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    issues: string[];
  }>({ isValid: true, issues: [] });

  const sqlReservedWords = [
    'SELECT',
    'FROM',
    'WHERE',
    'ORDER',
    'GROUP',
    'BY',
    'INSERT',
    'UPDATE',
    'DELETE',
    'CREATE',
    'TABLE',
    'ALTER',
    'DROP',
    'INDEX',
    'PRIMARY',
    'KEY',
    'FOREIGN',
    'REFERENCES',
    'CONSTRAINT',
    'UNIQUE',
    'NOT',
    'NULL',
    'DEFAULT',
    'CHECK',
  ];

  const validateName = (name: string) => {
    const issues: string[] = [];

    if (!name) {
      return { isValid: false, issues: ['名前が入力されていません'] };
    }

    // SQL予約語チェック
    if (sqlReservedWords.includes(name.toUpperCase())) {
      issues.push(`"${name}" はSQLの予約語です`);
    }

    // スネークケース推奨
    if (!/^[a-z][a-z0-9_]*$/.test(name)) {
      issues.push('スネークケース（小文字、数字、アンダースコア）を推奨します');
    }

    // 大文字が含まれている
    if (/[A-Z]/.test(name)) {
      issues.push('大文字が含まれています。小文字に統一することを推奨します');
    }

    // スペースが含まれている
    if (/\s/.test(name)) {
      issues.push('スペースが含まれています。アンダースコア（_）を使用してください');
    }

    // 数字で始まっている
    if (/^[0-9]/.test(name)) {
      issues.push('数字で始まる名前は避けるべきです');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  };

  const handleInputChange = (value: string) => {
    setInputName(value);
    if (value) {
      setValidationResult(validateName(value));
    } else {
      setValidationResult({ isValid: true, issues: [] });
    }
  };

  const goodExamples = [
    { name: 'user_id', description: 'ユーザーID' },
    { name: 'order_date', description: '注文日' },
    { name: 'product_name', description: '製品名' },
    { name: 'customer_email', description: '顧客メール' },
  ];

  const badExamples = [
    { name: 'UserId', issues: '大文字が含まれている（キャメルケース）' },
    { name: 'order date', issues: 'スペースが含まれている' },
    { name: 'SELECT', issues: 'SQLの予約語' },
    { name: '123product', issues: '数字で始まっている' },
  ];

  return (
    <div className="type-demo-content">
      <div className="explanation-box">
        <h4>命名規則のベストプラクティス</h4>
        <ul>
          <li>
            <strong>スネークケース（snake_case）</strong>を推奨
            <br />
            例：<code>user_id</code>, <code>order_date</code>
          </li>
          <li>
            <strong>SQL予約語の回避</strong>
            <br />
            SELECT, ORDER, GROUP などは使用不可
          </li>
          <li>
            <strong>意味が明確な名前</strong>
            <br />
            短縮形は避け、完全な単語を使用
          </li>
          <li>
            <strong>一貫性</strong>
            <br />
            プロジェクト全体で統一された命名規則を採用
          </li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h4>名前を入力して検証してみよう</h4>
        <div className="input-group">
          <label>テーブル名またはカラム名：</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="例: user_id, order_date..."
          />
        </div>

        <div className="result-box">
          {inputName ? (
            <div>
              {validationResult.isValid ? (
                <div>
                  <p className="success">
                    ✅ <code>{inputName}</code> は適切な命名です
                  </p>
                </div>
              ) : (
                <div>
                  <p className="error">
                    ❌ <code>{inputName}</code> に問題があります
                  </p>
                  <ul>
                    {validationResult.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="hint">上記の入力欄に名前を入力してください</p>
          )}
        </div>
      </div>

      <div className="examples-grid">
        <div className="good-examples">
          <h4>✅ 良い例</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>名前</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              {goodExamples.map((example, idx) => (
                <tr key={idx}>
                  <td>
                    <code>{example.name}</code>
                  </td>
                  <td>{example.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bad-examples">
          <h4>❌ 悪い例</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>名前</th>
                <th>問題点</th>
              </tr>
            </thead>
            <tbody>
              {badExamples.map((example, idx) => (
                <tr key={idx}>
                  <td>
                    <code>{example.name}</code>
                  </td>
                  <td>{example.issues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * 文字列の長さに基づいて推奨データ型を返す
 */
const getRecommendedStringType = (value: string): string => {
  if (value.length <= 2) {
    return 'CHAR(2)';
  }
  if (value.length <= 255) {
    return `VARCHAR(${Math.max(value.length, 50)})`;
  }
  return 'TEXT';
};

/**
 * 数値の大きさに基づいて推奨整数型を返す
 */
const getRecommendedIntegerType = (value: number): string => {
  if (value >= 0 && value <= 255) {
    return 'TINYINT (UNSIGNED)';
  }
  if (value >= 0 && value <= 4294967295) {
    return 'INT (UNSIGNED)';
  }
  return 'BIGINT (UNSIGNED)';
};

