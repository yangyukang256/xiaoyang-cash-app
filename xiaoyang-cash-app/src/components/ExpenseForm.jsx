import { useState } from 'react'
import { getCategoriesByType, getCategoryBySubId, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories'

/**
 * 小羊记账 - 记账表单
 *
 * 支持新增和编辑两种模式
 * 支持支出/收入切换
 * 2级分类选择：先选一级大类，再选二级小类
 */
export default function ExpenseForm({ onSubmit, editingRecord, onCancelEdit }) {
  const isEditing = !!editingRecord

  const [type, setType] = useState(isEditing ? editingRecord.type : 'expense')
  const [amount, setAmount] = useState(isEditing ? editingRecord.amount : '')
  const [mainCategoryId, setMainCategoryId] = useState(
    isEditing ? getMainIdBySubId(editingRecord.subCategoryId, editingRecord.type) : ''
  )
  const [subCategoryId, setSubCategoryId] = useState(
    isEditing ? editingRecord.subCategoryId : ''
  )
  const [date, setDate] = useState(isEditing ? editingRecord.date : today())
  const [note, setNote] = useState(isEditing ? editingRecord.note : '')

  // 根据类型获取分类列表
  const categories = getCategoriesByType(type)
  // 选中的一级分类对象
  const selectedMain = categories.find((c) => c.id === mainCategoryId)

  // 表单验证
  const isValid =
    amount && Number(amount) > 0 && subCategoryId && date

  function handleTypeChange(newType) {
    if (isEditing) return // 编辑模式不允许切换收支类型
    setType(newType)
    setMainCategoryId('')
    setSubCategoryId('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return

    const record = {
      type,
      amount: Math.round(Number(amount) * 100) / 100,
      subCategoryId,
      date,
      note: note.trim(),
    }

    if (isEditing) {
      onSubmit(editingRecord.id, record)
    } else {
      onSubmit(record)
    }

    if (!isEditing) {
      resetForm()
    }
  }

  function resetForm() {
    setAmount('')
    setMainCategoryId('')
    setSubCategoryId('')
    setDate(today())
    setNote('')
  }

  function handleCancel() {
    resetForm()
    onCancelEdit?.()
  }

  return (
    <div className={`expense-form-wrapper ${isEditing ? 'editing' : ''}`}>
      {isEditing && (
        <div className="form-editing-badge">
          ✏️ 正在编辑
          <button type="button" className="btn-text" onClick={handleCancel}>
            取消
          </button>
        </div>
      )}

      <form className="expense-form" onSubmit={handleSubmit}>
        {/* 收支切换 */}
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
            disabled={isEditing}
          >
            💸 支出
          </button>
          <button
            type="button"
            className={`type-btn ${type === 'income' ? 'active income' : ''}`}
            onClick={() => handleTypeChange('income')}
            disabled={isEditing}
          >
            💰 收入
          </button>
        </div>
        {/* 金额输入 */}
        <div className="form-row amount-row">
          <span className="currency-sign">¥</span>
          <input
            type="number"
            className="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus={!isEditing}
          />
        </div>

        {/* 分类选择（2级） */}
        <div className="form-row">
          <label className="form-label">分类</label>
          <div className="category-selectors">
            {/* 一级大类 */}
            <select
              className="select"
              value={mainCategoryId}
              onChange={(e) => {
                setMainCategoryId(e.target.value)
                setSubCategoryId('')
              }}
            >
              <option value="">选择大类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            {/* 二级小类 */}
            <select
              className="select"
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              disabled={!mainCategoryId}
            >
              <option value="">选择小类</option>
              {selectedMain?.subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 日期选择 */}
        <div className="form-row">
          <label className="form-label">日期</label>
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* 备注 */}
        <div className="form-row">
          <label className="form-label">备注</label>
          <input
            type="text"
            className="note-input"
            placeholder="可选，比如：食堂午饭、地铁通勤..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={50}
          />
        </div>

        {/* 提交按钮 */}
        <button type="submit" className={`btn-submit ${type}`} disabled={!isValid}>
          {isEditing
            ? '✅ 保存修改'
            : type === 'income'
              ? '💰 记一笔收入'
              : '💸 记一笔支出'}
        </button>
      </form>
    </div>
  )
}

/** 获取今天的日期字符串 */
function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 根据二级分类ID查找其所属的一级分类ID */
function getMainIdBySubId(subId, type = 'expense') {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  for (const cat of list) {
    if (cat.subCategories.some((s) => s.id === subId)) {
      return cat.id
    }
  }
  return ''
}