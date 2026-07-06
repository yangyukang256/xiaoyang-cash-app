import { useState, useCallback, useEffect, useRef } from 'react'
import { loadExpenses, saveExpenses, exportToCsv, importFromJson } from '../utils/storage'

/**
 * 小羊记账 - 核心数据管理 Hook
 *
 * 管理所有记账记录的增删改查，以及数据的导入导出
 */
export function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loaded, setLoaded] = useState(false)
  const fileInputRef = useRef(null)

  // 启动时从本地存储加载数据
  useEffect(() => {
    const data = loadExpenses()
    if (data.length > 0) {
      setExpenses(data)
    }
    setLoaded(true)
  }, [])

  // 数据变化时自动保存到本地
  useEffect(() => {
    if (loaded) {
      saveExpenses(expenses)
    }
  }, [expenses, loaded])

  // 生成唯一ID
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  }, [])

  // 新增支出
  const addExpense = useCallback(
    (record) => {
      const newRecord = {
        ...record,
        id: generateId(),
        createdAt: Date.now(),
      }
      setExpenses((prev) => [newRecord, ...prev])
      return newRecord
    },
    [generateId]
  )

  // 编辑支出
  const updateExpense = useCallback((id, updates) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
      )
    )
  }, [])

  // 删除支出
  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // 导出备份（CSV格式）
  const handleExport = useCallback(() => {
    exportToCsv(expenses)
  }, [expenses])

  // 导入备份
  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // 文件选择后的导入处理
  const handleFileImport = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    importFromJson(file)
      .then((data) => {
        setExpenses(data)
        alert(`导入成功！共 ${data.length} 条记录`)
      })
      .catch((err) => alert('导入失败：' + err.message))
    // 清空 input，允许重复选择同一文件
    e.target.value = ''
  }, [])

  return {
    expenses,
    loaded,
    addExpense,
    updateExpense,
    deleteExpense,
    handleExport,
    handleImport,
    handleFileImport,
    fileInputRef,
  }
}