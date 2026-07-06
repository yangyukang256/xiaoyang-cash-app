/**
 * 小羊记账 - 2级分类数据
 *
 * 结构：一级大类 → 二级小类
 * 每项都有 icon（图标）和 id（唯一标识）
 * 分为支出分类和收入分类
 */

/** 支出分类 */
export const EXPENSE_CATEGORIES = [
  {
    id: 'food',
    name: '餐饮美食',
    icon: '🍜',
    subCategories: [
      { id: 'breakfast', name: '早餐' },
      { id: 'lunch', name: '午餐' },
      { id: 'dinner', name: '晚餐' },
      { id: 'fruits', name: '水果零食' },
      { id: 'drinks', name: '饮品奶茶' },
      { id: 'takeout', name: '外卖' },
    ],
  },
  {
    id: 'transport',
    name: '交通出行',
    icon: '🚇',
    subCategories: [
      { id: 'bus', name: '公交地铁' },
      { id: 'taxi', name: '出租车/网约车' },
      { id: 'bike', name: '共享单车' },
      { id: 'fuel', name: '加油' },
      { id: 'parking', name: '停车费' },
      { id: 'long-distance', name: '高铁/飞机' },
    ],
  },
  {
    id: 'housing',
    name: '居住生活',
    icon: '🏠',
    subCategories: [
      { id: 'rent', name: '房租' },
      { id: 'utilities', name: '水电燃气' },
      { id: 'property', name: '物业费' },
      { id: 'internet', name: '网费' },
      { id: 'household', name: '家居日用品' },
      { id: 'repair', name: '维修' },
    ],
  },
  {
    id: 'shopping',
    name: '购物消费',
    icon: '👕',
    subCategories: [
      { id: 'clothing', name: '服装鞋帽' },
      { id: 'digital', name: '数码产品' },
      { id: 'daily', name: '日用品' },
      { id: 'beauty', name: '美妆护肤' },
      { id: 'gift', name: '礼物' },
      { id: 'pet', name: '宠物' },
    ],
  },
  {
    id: 'entertainment',
    name: '休闲娱乐',
    icon: '🎮',
    subCategories: [
      { id: 'movie', name: '电影演出' },
      { id: 'game', name: '游戏充值' },
      { id: 'sports', name: '运动健身' },
      { id: 'travel', name: '旅游出行' },
      { id: 'party', name: '聚会聚餐' },
    ],
  },
  {
    id: 'health',
    name: '医疗健康',
    icon: '🏥',
    subCategories: [
      { id: 'clinic', name: '看病挂号' },
      { id: 'medicine', name: '药品' },
      { id: 'checkup', name: '体检' },
      { id: 'supplement', name: '保健品' },
    ],
  },
  {
    id: 'education',
    name: '教育学习',
    icon: '📚',
    subCategories: [
      { id: 'course', name: '课程培训' },
      { id: 'books', name: '书籍' },
      { id: 'stationery', name: '文具用品' },
      { id: 'certificate', name: '考证报名' },
    ],
  },
  {
    id: 'communication',
    name: '通讯通信',
    icon: '📱',
    subCategories: [
      { id: 'phone-bill', name: '话费充值' },
      { id: 'data-plan', name: '流量套餐' },
    ],
  },
  {
    id: 'finance',
    name: '金融理财',
    icon: '💰',
    subCategories: [
      { id: 'credit-card', name: '信用卡还款' },
      { id: 'loan', name: '借贷支出' },
      { id: 'insurance', name: '保险费用' },
    ],
  },
  {
    id: 'other',
    name: '其他',
    icon: '📦',
    subCategories: [
      { id: 'red-packet', name: '红包支出' },
      { id: 'donation', name: '捐赠' },
      { id: 'delivery', name: '快递费' },
      { id: 'misc', name: '其他' },
    ],
  },
]

/** 收入分类 */
export const INCOME_CATEGORIES = [
  {
    id: 'salary',
    name: '工资薪资',
    icon: '💰',
    subCategories: [
      { id: 'monthly-salary', name: '月薪' },
      { id: 'bonus', name: '奖金' },
      { id: 'performance', name: '绩效' },
      { id: 'allowance', name: '补贴' },
      { id: 'year-end', name: '年终奖' },
    ],
  },
  {
    id: 'business',
    name: '经营副业',
    icon: '🏪',
    subCategories: [
      { id: 'main-business', name: '主营业务' },
      { id: 'side-business', name: '副业收入' },
      { id: 'part-time', name: '兼职' },
    ],
  },
  {
    id: 'investment',
    name: '投资理财',
    icon: '💳',
    subCategories: [
      { id: 'stock', name: '股票收益' },
      { id: 'fund', name: '基金收益' },
      { id: 'interest', name: '利息收益' },
      { id: 'rental', name: '租金收入' },
    ],
  },
  {
    id: 'gift-money',
    name: '红包礼金',
    icon: '🧧',
    subCategories: [
      { id: 'festival-redpacket', name: '节日红包' },
      { id: 'wedding-gift', name: '婚礼礼金' },
      { id: 'birthday-gift', name: '生日礼金' },
    ],
  },
  {
    id: 'other-income',
    name: '其他收入',
    icon: '📦',
    subCategories: [
      { id: 'second-hand', name: '二手出售' },
      { id: 'refund', name: '退款' },
      { id: 'lottery', name: '中奖' },
      { id: 'misc-income', name: '其他' },
    ],
  },
]

/**
 * 获取指定类型的分类列表
 */
export function getCategoriesByType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

/**
 * 工具函数：根据类型和二级分类ID获取完整分类信息
 */
export function getCategoryBySubId(subCategoryId, type = 'expense') {
  const list = getCategoriesByType(type)
  for (const cat of list) {
    const sub = cat.subCategories.find((s) => s.id === subCategoryId)
    if (sub) {
      return { main: cat, sub }
    }
  }
  return null
}

/**
 * 工具函数：根据类型和二级分类ID获取显示文本
 */
export function getCategoryLabel(subCategoryId, type = 'expense') {
  const info = getCategoryBySubId(subCategoryId, type)
  if (!info) return '未分类'
  return `${info.main.icon} ${info.main.name} / ${info.sub.name}`
}