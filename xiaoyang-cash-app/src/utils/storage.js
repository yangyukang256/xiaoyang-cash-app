/**
 * 小羊记账 - 数据持久化工具
 * 使用 localStorage 在浏览器本地存储数据
 */

import { getCategoryBySubId } from '../data/categories'

const STORAGE_KEY = 'xiaoyang-cash-app-data'

/**
 * 从本地存储加载数据
 */
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('读取数据失败：', e)
    return []
  }
}

/**
 * 保存数据到本地存储
 */
export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    return true
  } catch (e) {
    console.error('保存数据失败：', e)
    return false
  }
}

/**
 * 导出数据为 CSV 文件（可用 Excel/WPS 直接打开）
 */
export function exportToCsv(expenses) {
  // CSV 表头
  const headers = ['日期', '类型', '一级分类', '二级分类', '金额', '备注']
  const rows = [headers]

  // 按时间倒序排列（最新的在最上面）
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  sorted.forEach((item) => {
    const info = getCategoryBySubId(item.subCategoryId, item.type)
    const typeLabel = item.type === 'income' ? '收入' : '支出'
    const mainName = info?.main.name || '未分类'
    const subName = info?.sub.name || '其他'
    const amount = item.type === 'income'
      ? Number(item.amount).toFixed(2)
      : `-${Number(item.amount).toFixed(2)}`

    rows.push([
      item.date,
      typeLabel,
      mainName,
      subName,
      amount,
      // 备注里如果有逗号/引号，用双引号包起来
      item.note ? `"${item.note.replace(/"/g, '""')}"` : '',
    ])
  })

  // 转成 CSV 文本（逗号分隔，UTF-8 BOM 以便 Excel 正确识别中文）
  const BOM = '﻿'
  const csvContent = rows.map((row) => row.join(',')).join('\n')
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `小羊记账-${new Date().toLocaleDateString('zh-CN')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * 从JSON文件导入数据（恢复备份）
 */
export function importFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (!Array.isArray(data)) {
          reject(new Error('文件格式不正确'))
          return
        }
        resolve(data)
      } catch {
        reject(new Error('文件解析失败'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}