import { useState } from 'react';
import { useRowIds, useCell } from 'tinybase/ui-react';

/**
 * 原理4：正規化による冗長性の排除デモ
 * 正規化のプロセスを可視化して学ぶ
 */
export const NormalizationDemo = () => {
  const [selectedStep, setSelectedStep] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="normalization-demo">
      <div className="normalization-steps">
        <button
          className={selectedStep === 1 ? 'active' : ''}
          onClick={() => setSelectedStep(1)}
        >
          ステップ1: 非正規形
        </button>
        <button
          className={selectedStep === 2 ? 'active' : ''}
          onClick={() => setSelectedStep(2)}
        >
          ステップ2: 第1正規形
        </button>
        <button
          className={selectedStep === 3 ? 'active' : ''}
          onClick={() => setSelectedStep(3)}
        >
          ステップ3: 第2正規形
        </button>
        <button
          className={selectedStep === 4 ? 'active' : ''}
          onClick={() => setSelectedStep(4)}
        >
          ステップ4: 第3正規形（BCNF）
        </button>
      </div>

      {selectedStep === 1 && <UnnormalizedForm />}
      {selectedStep === 2 && <FirstNormalForm />}
      {selectedStep === 3 && <SecondNormalForm />}
      {selectedStep === 4 && <ThirdNormalForm />}
    </div>
  );
};

/**
 * 非正規形のデモ
 */
const UnnormalizedForm = () => {
  // TinyBaseから非正規形データを取得
  const employeeIds = useRowIds('employees_unnormalized');

  return (
    <div className="normalization-content">
      <div className="explanation-box warning-box">
        <h4>❌ 非正規形（0NF）の問題点</h4>
        <ul>
          <li>
            <strong>多値カラム</strong>：skillsカラムに複数の値が入っている（'SQL, JavaScript, Python'）
          </li>
          <li>
            <strong>データの冗長性</strong>：department_nameが重複している
          </li>
          <li>
            <strong>更新アノマリー</strong>：営業部の名前を変更する場合、複数行を更新する必要がある
          </li>
          <li>
            <strong>挿入アノマリー</strong>：新しい部署を追加する場合、従業員情報も必要
          </li>
        </ul>
      </div>

      <div className="examples-table">
        <h4>従業員テーブル（非正規形）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>employee_id</th>
              <th>employee_name</th>
              <th>department_id</th>
              <th>department_name</th>
              <th>skills（多値）</th>
            </tr>
          </thead>
          <tbody>
            {employeeIds.map((empId) => (
              <UnnormalizedRow key={empId} empId={empId} />
            ))}
          </tbody>
        </table>
        <p className="hint warning-text">
          ⚠️ skillsカラムに複数の値が入っており、検索や集計が困難です
        </p>
      </div>
    </div>
  );
};

/**
 * 非正規形行コンポーネント
 */
const UnnormalizedRow = ({ empId }: { empId: string }) => {
  const employee_id = useCell('employees_unnormalized', empId, 'employee_id');
  const employee_name = useCell('employees_unnormalized', empId, 'employee_name');
  const department_id = useCell('employees_unnormalized', empId, 'department_id');
  const department_name = useCell('employees_unnormalized', empId, 'department_name');
  const skills = useCell('employees_unnormalized', empId, 'skills');

  return (
    <tr>
      <td>{employee_id}</td>
      <td>{employee_name}</td>
      <td>{department_id}</td>
      <td>{department_name}</td>
      <td>
        <code>{skills}</code>
      </td>
    </tr>
  );
};

/**
 * 第1正規形のデモ
 */
const FirstNormalForm = () => {
  // TinyBaseから非正規形データを取得
  const employeeIds = useRowIds('employees_unnormalized');

  return (
    <div className="normalization-content">
      <div className="explanation-box info-box">
        <h4>✅ 第1正規形（1NF）の改善点</h4>
        <ul>
          <li>
            <strong>多値カラムの解消</strong>：skillsを1つの値に分割し、複数行に展開
          </li>
          <li>
            <strong>主キーの定義</strong>：employee_idを主キーとして定義
          </li>
        </ul>
        <p className="hint">
          ⚠️ ただし、まだデータの冗長性が残っています（employee_name、department_nameが重複）
        </p>
      </div>

      <div className="examples-table">
        <h4>従業員テーブル（第1正規形）</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>employee_id 🔑</th>
              <th>employee_name</th>
              <th>department_id</th>
              <th>department_name</th>
              <th>skill</th>
            </tr>
          </thead>
          <tbody>
            {employeeIds.map((empId) => (
              <FirstNormalFormRows key={empId} empId={empId} />
            ))}
          </tbody>
        </table>
        <p className="hint">
          💡 多値カラムは解消されましたが、employee_nameとdepartment_nameが重複しています
        </p>
      </div>
    </div>
  );
};

/**
 * 第1正規形行コンポーネント（スキルを展開）
 */
const FirstNormalFormRows = ({ empId }: { empId: string }) => {
  const employee_id = useCell('employees_unnormalized', empId, 'employee_id');
  const employee_name = useCell('employees_unnormalized', empId, 'employee_name');
  const department_id = useCell('employees_unnormalized', empId, 'department_id');
  const department_name = useCell('employees_unnormalized', empId, 'department_name');
  const skills = useCell('employees_unnormalized', empId, 'skills') as string;

  // スキルを展開
  const skillList = skills ? skills.split(', ') : [];

  return (
    <>
      {skillList.map((skill, idx) => (
        <tr key={`${empId}-${skill}-${idx}`}>
          <td>{employee_id}</td>
          <td>{employee_name}</td>
          <td>{department_id}</td>
          <td>{department_name}</td>
          <td>{skill}</td>
        </tr>
      ))}
    </>
  );
};

/**
 * 第2正規形のデモ
 */
const SecondNormalForm = () => {
  // TinyBaseから正規化後のデータを取得
  const employeeIds = useRowIds('employees');
  const departmentIds = useRowIds('departments');
  const skillIds = useRowIds('employee_skills');

  return (
    <div className="normalization-content">
      <div className="explanation-box info-box">
        <h4>✅ 第2正規形（2NF）の改善点</h4>
        <ul>
          <li>
            <strong>部分関数従属の解消</strong>：非キー属性が主キーの一部にのみ依存している状態を解消
          </li>
          <li>
            <strong>テーブルの分割</strong>：従業員テーブル、部署テーブル、スキルテーブルに分割
          </li>
          <li>
            <strong>データの冗長性削減</strong>：department_nameの重複を排除
          </li>
        </ul>
        <p className="hint">
          ⚠️ ただし、まだ推移的依存性が残っている可能性があります
        </p>
      </div>

      <div className="tables-grid">
        <div className="table-container">
          <h4>従業員テーブル (employees)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>employee_id 🔑</th>
                <th>employee_name</th>
                <th>department_id</th>
              </tr>
            </thead>
            <tbody>
              {employeeIds.map((empId) => (
                <EmployeeRow key={empId} empId={empId} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>部署テーブル (departments)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>department_id 🔑</th>
                <th>department_name</th>
              </tr>
            </thead>
            <tbody>
              {departmentIds.map((deptId) => (
                <DepartmentRow key={deptId} deptId={deptId} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>従業員スキルテーブル (employee_skills)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>employee_id</th>
                <th>skill</th>
              </tr>
            </thead>
            <tbody>
              {skillIds.map((skillId) => (
                <EmployeeSkillRow key={skillId} skillId={skillId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="hint">
        💡 テーブルが分割され、データの冗長性が大幅に削減されました
      </p>
    </div>
  );
};

/**
 * 従業員行コンポーネント
 */
const EmployeeRow = ({ empId }: { empId: string }) => {
  const employee_id = useCell('employees', empId, 'employee_id');
  const employee_name = useCell('employees', empId, 'employee_name');
  const department_id = useCell('employees', empId, 'department_id');

  return (
    <tr>
      <td>{employee_id}</td>
      <td>{employee_name}</td>
      <td>{department_id}</td>
    </tr>
  );
};

/**
 * 部署行コンポーネント
 */
const DepartmentRow = ({ deptId }: { deptId: string }) => {
  const department_id = useCell('departments', deptId, 'department_id');
  const department_name = useCell('departments', deptId, 'department_name');

  return (
    <tr>
      <td>{department_id}</td>
      <td>{department_name}</td>
    </tr>
  );
};

/**
 * 従業員スキル行コンポーネント
 */
const EmployeeSkillRow = ({ skillId }: { skillId: string }) => {
  const employee_id = useCell('employee_skills', skillId, 'employee_id');
  const skill = useCell('employee_skills', skillId, 'skill');

  return (
    <tr>
      <td>{employee_id}</td>
      <td>{skill}</td>
    </tr>
  );
};

/**
 * 第3正規形（BCNF）のデモ
 */
const ThirdNormalForm = () => {
  // TinyBaseから正規化後のデータを取得
  const employeeIds = useRowIds('employees');
  const departmentIds = useRowIds('departments');
  const skillIds = useRowIds('employee_skills');

  return (
    <div className="normalization-content">
      <div className="explanation-box success-box">
        <h4>✅ 第3正規形 / BCNF（ボイス・コッド正規形）の完成</h4>
        <ul>
          <li>
            <strong>推移的依存性の解消</strong>：非キー属性が別の非キー属性に依存している状態を解消
          </li>
          <li>
            <strong>完全関数従属</strong>：全ての非キー属性が主キーの全体に対してのみ関数従属
          </li>
          <li>
            <strong>データ整合性の確保</strong>：更新アノマリー、挿入アノマリー、削除アノマリーを防止
          </li>
        </ul>
        <p className="hint success-text">
          ✅ この設計により、データの冗長性が最小化され、整合性が保たれます
        </p>
      </div>

      <div className="normalization-diagram">
        <h4>正規化の結果</h4>
        <div className="diagram-box">
          <div className="diagram-item">
            <strong>employees テーブル</strong>
            <ul>
              <li>主キー: employee_id</li>
              <li>非キー属性: employee_name, department_id</li>
              <li>全ての非キー属性が主キーに完全関数従属 ✅</li>
            </ul>
          </div>
          <div className="diagram-arrow">→</div>
          <div className="diagram-item">
            <strong>departments テーブル</strong>
            <ul>
              <li>主キー: department_id</li>
              <li>非キー属性: department_name</li>
              <li>推移的依存性なし ✅</li>
            </ul>
          </div>
          <div className="diagram-arrow">→</div>
          <div className="diagram-item">
            <strong>employee_skills テーブル</strong>
            <ul>
              <li>複合主キー: (employee_id, skill)</li>
              <li>多対多関係を表現 ✅</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="tables-grid">
        <div className="table-container">
          <h4>従業員テーブル (employees)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>employee_id 🔑</th>
                <th>employee_name</th>
                <th>department_id</th>
              </tr>
            </thead>
            <tbody>
              {employeeIds.map((empId) => (
                <EmployeeRow key={empId} empId={empId} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>部署テーブル (departments)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>department_id 🔑</th>
                <th>department_name</th>
              </tr>
            </thead>
            <tbody>
              {departmentIds.map((deptId) => (
                <DepartmentRow key={deptId} deptId={deptId} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>従業員スキルテーブル (employee_skills)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>employee_id</th>
                <th>skill</th>
              </tr>
            </thead>
            <tbody>
              {skillIds.map((skillId) => (
                <EmployeeSkillRow key={skillId} skillId={skillId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="benefits-box">
        <h4>正規化のメリット</h4>
        <div className="benefits-grid">
          <div className="benefit-item">
            <strong>✅ 更新アノマリーの防止</strong>
            <p>部署名を変更する場合、departmentsテーブルの1行だけを更新すればOK</p>
          </div>
          <div className="benefit-item">
            <strong>✅ 挿入アノマリーの防止</strong>
            <p>新しい部署を追加する場合、departmentsテーブルに1行追加するだけ</p>
          </div>
          <div className="benefit-item">
            <strong>✅ 削除アノマリーの防止</strong>
            <p>従業員を削除しても、部署情報は保持される</p>
          </div>
        </div>
      </div>
    </div>
  );
};

