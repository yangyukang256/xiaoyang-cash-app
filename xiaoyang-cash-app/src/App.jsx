import { useState } from 'react'
import Header from './components/Header'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Statistics from './components/Statistics'
import { useExpenses } from './hooks/useExpenses'
import './App.css'

/**
 * 小羊记账 - 主应用
 */
export default function App() {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    handleExport,
    handleImport,
    handleFileImport,
    fileInputRef,
  } = useExpenses()

  const [activeTab, setActiveTab] = useState('list')
  const [editingRecord, setEditingRecord] = useState(null)

  function handleSubmit(data) {
    if (editingRecord) {
      updateExpense(editingRecord.id, data)
      setEditingRecord(null)
    } else {
      addExpense(data)
    }
  }

  function handleEdit(record) {
    setEditingRecord(record)
    setActiveTab('add')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingRecord(null)
  }

  return (
    <div className="app">
      <Header
        expenses={expenses}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* 隐藏的文件选择 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileImport}
      />

      {/* 标签切换 */}
      <nav className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('add')
            setEditingRecord(null)
          }}
        >
          ✏️ 记账
        </button>
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📃 账单
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 统计
        </button>
      </nav>

      {/* 内容区 */}
      <main className="main-content">
        {activeTab === 'add' && (
          <ExpenseForm
            onSubmit={handleSubmit}
            editingRecord={editingRecord}
            onCancelEdit={handleCancelEdit}
          />
        )}

        {activeTab === 'list' && (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={deleteExpense}
          />
        )}

        {activeTab === 'stats' && <Statistics expenses={expenses} />}
      </main>

      {/* 底部信息 */}
      <footer className="app-footer">
        <span>🐑 小羊记账 v1.0</span>
        <span>共 {expenses.length} 笔记录</span>
      </footer>
    </div>
  )
}