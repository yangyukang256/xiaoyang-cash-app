import { useState } from 'react'
import { getCategoryBySubId } from '../data/categories'

/**
 * 小羊记账 - 账单列表
 *
 * 全部记录混合展示，支出红色、收入绿色
 * 支持按类型筛选（全部/支出/收入）
 */
export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filtered =
    filter === 'all'
      ? expenses
      : expenses.filter((item) => item.type === filter)

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p className="empty-text">还没有记账记录</p>
        <p className="empty-hint">点击上方"记账"，开始记录吧！</p>
      </div>
    )
  }

  return (
    <div className="expense-list">
      {/* 筛选按钮 */}
      <div className="list-filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部 ({expenses.length})
        </button>
        <button
          className={`filter-btn expense ${filter === 'expense' ? 'active' : ''}`}
          onClick={() => setFilter('expense')}
        >
          💸 支出 ({expenses.filter((e) => e.type === 'expense').length})
        </button>
        <button
          className={`filter-btn income ${filter === 'income' ? 'active' : ''}`}
          onClick={() => setFilter('income')}
        >
          💰 收入 ({expenses.filter((e) => e.type === 'income').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-text">没有符合条件的记录</p>
        </div>
      ) : (
        filtered.map((item) => (
          <ExpenseItem
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

/**
 * 单条记账记录
 */
function ExpenseItem({ item, onEdit, onDelete }) {
  const categoryInfo = getCategoryBySubId(item.subCategoryId, item.type)
  const mainName = categoryInfo?.main.name || '未分类'
  const mainIcon = categoryInfo?.main.icon || '📦'
  const subName = categoryInfo?.sub.name || '其他'

  const isExpense = item.type === 'expense'

  // 格式化日期
  const dateObj = new Date(item.date)
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const dayOfWeek = weekDays[dateObj.getDay()]
  const displayDate = `${item.date} 周${dayOfWeek}`

  return (
    <div className={`expense-item ${isExpense ? 'is-expense' : 'is-income'}`}>
      <div className="expense-item-left">
        <div className="expense-category-icon">{mainIcon}</div>
        <div className="expense-info">
          <div className="expense-category">
            <span className="expense-type-tag">
              {isExpense ? '💸' : '💰'}
            </span>
            <span className="expense-main-cat">{mainName}</span>
            <span className="expense-sep">/</span>
            <span className="expense-sub-cat">{subName}</span>
          </div>
          <div className="expense-date">{displayDate}</div>
          {item.note && <div className="expense-note">{item.note}</div>}
        </div>
      </div>
      <div className="expense-item-right">
        <div className={`expense-amount ${isExpense ? 'expense' : 'income'}`}>
          {isExpense ? '-' : '+'}¥{Number(item.amount).toFixed(2)}
        </div>
        <div className="expense-actions">
          <button
            className="btn-item-edit"
            onClick={() => onEdit(item)}
            title="编辑"
          >
            ✏️
          </button>
          <button
            className="btn-item-delete"
            onClick={() => {
              if (window.confirm('确定要删除这条记录吗？')) {
                onDelete(item.id)
              }
            }}
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}