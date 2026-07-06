import { useState, useMemo } from 'react'
import { getCategoryBySubId } from '../data/categories'

/**
 * 小羊记账 - 数据统计面板
 *
 * 月度收支总览、支出分类统计、收入分类统计
 */
export default function Statistics({ expenses }) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [statTab, setStatTab] = useState('expense') // expense | income

  // 获取所有有数据的月份
  const availableMonths = useMemo(() => {
    const months = new Set()
    expenses.forEach((item) => {
      months.add(item.date.slice(0, 7))
    })
    return [...months].sort().reverse()
  }, [expenses])

  // 筛选当月数据
  const monthExpenses = useMemo(() => {
    return expenses.filter((item) => item.date.startsWith(selectedMonth))
  }, [expenses, selectedMonth])

  // 当月收支统计
  const monthStats = useMemo(() => {
    const expense = monthExpenses
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount), 0)
    const income = monthExpenses
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0)
    return { expense, income, balance: income - expense }
  }, [monthExpenses])

  // 按类型和一级大类统计
  const statsByType = useMemo(() => {
    const targetType = statTab
    const filtered = monthExpenses.filter((item) => item.type === targetType)

    const map = {}
    filtered.forEach((item) => {
      const info = getCategoryBySubId(item.subCategoryId, targetType)
      const mainId = info?.main.id || 'other'
      const mainName = info?.main.name || '其他'
      const mainIcon = info?.main.icon || '📦'
      if (!map[mainId]) {
        map[mainId] = { name: mainName, icon: mainIcon, total: 0, subCategories: {} }
      }
      map[mainId].total += Number(item.amount)

      const subName = info?.sub.name || '其他'
      if (!map[mainId].subCategories[item.subCategoryId]) {
        map[mainId].subCategories[item.subCategoryId] = { name: subName, total: 0 }
      }
      map[mainId].subCategories[item.subCategoryId].total += Number(item.amount)
    })

    return Object.entries(map)
      .map(([id, data]) => ({ id, ...data, total: Math.round(data.total * 100) / 100 }))
      .sort((a, b) => b.total - a.total)
  }, [monthExpenses, statTab])

  const statTotal = statTab === 'expense' ? monthStats.expense : monthStats.income

  // 没有数据时的提示
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <p className="empty-text">暂无统计数据</p>
        <p className="empty-hint">记几笔账就能看到统计啦</p>
      </div>
    )
  }

  return (
    <div className="statistics">
      {/* 月份选择 */}
      <div className="stat-header">
        <label className="form-label">选择月份</label>
        <select
          className="select month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* 收支结余总览 */}
      <div className="stat-overview">
        <div className="stat-overview-item">
          <span className="stat-overview-label">支出</span>
          <span className="stat-overview-value expense">
            ¥{monthStats.expense.toFixed(2)}
          </span>
        </div>
        <div className="stat-overview-item">
          <span className="stat-overview-label">收入</span>
          <span className="stat-overview-value income">
            ¥{monthStats.income.toFixed(2)}
          </span>
        </div>
        <div className="stat-overview-item">
          <span className="stat-overview-label">结余</span>
          <span className={`stat-overview-value ${monthStats.balance >= 0 ? 'income' : 'expense'}`}>
            {monthStats.balance >= 0 ? '+' : ''}¥{monthStats.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 支出/收入 切换 */}
      <div className="stat-tab-bar">
        <button
          className={`stat-tab-btn ${statTab === 'expense' ? 'active expense' : ''}`}
          onClick={() => setStatTab('expense')}
        >
          💸 支出分类
        </button>
        <button
          className={`stat-tab-btn ${statTab === 'income' ? 'active income' : ''}`}
          onClick={() => setStatTab('income')}
        >
          💰 收入分类
        </button>
      </div>

      {/* 分类明细 */}
      {statsByType.length > 0 ? (
        <div className="stat-categories">
          {statsByType.map((cat) => {
            const percentage = statTotal > 0 ? ((cat.total / statTotal) * 100).toFixed(1) : 0
            return (
              <div key={cat.id} className="stat-category-item">
                <div className="stat-category-header">
                  <span className="stat-category-name">
                    {cat.icon} {cat.name}
                  </span>
                  <span className="stat-category-amount">
                    ¥{cat.total.toFixed(2)}
                  </span>
                  <span className="stat-category-percent">{percentage}%</span>
                </div>
                <div className={`stat-bar-track ${statTab}`}>
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {/* 二级分类明细 */}
                <div className="stat-sub-list">
                  {Object.entries(cat.subCategories)
                    .sort(([, a], [, b]) => b.total - a.total)
                    .map(([subId, sub]) => (
                      <div key={subId} className="stat-sub-item">
                        <span className="stat-sub-name">{sub.name}</span>
                        <span className="stat-sub-amount">
                          ¥{sub.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="stat-empty">
          <p className="empty-text">
            {statTab === 'expense' ? '本月还没有支出记录' : '本月还没有收入记录'}
          </p>
        </div>
      )}
    </div>
  )
}

/** 获取当前月份字符串 YYYY-MM */
function getCurrentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}