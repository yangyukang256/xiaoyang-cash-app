/**
 * 小羊记账 - 顶部导航 & 概览
 * 展示本月支出、收入、结余
 */
export default function Header({ expenses, onExport, onImport }) {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // 总收支
  const totalExpense = expenses
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0)
  const totalIncome = expenses
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0)
  const balance = totalIncome - totalExpense

  // 本月收支
  const monthExpenses = expenses.filter((item) => item.date.startsWith(currentMonth))
  const monthExpense = monthExpenses
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0)
  const monthIncome = monthExpenses
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0)
  const monthBalance = monthIncome - monthExpense
  const monthCount = monthExpenses.length

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="app-title">
          <span className="app-icon">🐑</span>
          小羊记账
        </h1>
        <div className="header-actions">
          <button className="btn-icon" onClick={onExport} title="导出CSV（Excel可打开）">
            📤
          </button>
          <button className="btn-icon" onClick={onImport} title="导入备份">
            📥
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">本月支出</span>
          <span className="summary-value expense">¥{monthExpense.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">本月收入</span>
          <span className="summary-value income">¥{monthIncome.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">本月结余</span>
          <span className={`summary-value ${monthBalance >= 0 ? 'income' : 'expense'}`}>
            {monthBalance >= 0 ? '+' : ''}¥{monthBalance.toFixed(2)}
          </span>
        </div>
      </div>
    </header>
  )
}