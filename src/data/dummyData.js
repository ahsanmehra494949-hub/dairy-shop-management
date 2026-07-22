// Dummy data only — no backend/API, per project spec.

export const summaryStats = {
  todaySales: 48250,
  todayProfit: 12680,
  totalProducts: 86,
  lowStockProducts: 7,
}

// Sales Overview data grouped by filter period — each entry has both
// sales and profit so the dashboard chart can plot them together.
export const salesOverviewByPeriod = {
  day: [
    { label: 'Mon', sales: 32000, profit: 8200 },
    { label: 'Tue', sales: 41000, profit: 10500 },
    { label: 'Wed', sales: 38500, profit: 9600 },
    { label: 'Thu', sales: 45200, profit: 11800 },
    { label: 'Fri', sales: 51000, profit: 13400 },
    { label: 'Sat', sales: 62300, profit: 16900 },
    { label: 'Sun', sales: 48250, profit: 12680 },
  ],
  week: [
    { label: 'Week 1', sales: 210000, profit: 54600 },
    { label: 'Week 2', sales: 245000, profit: 63700 },
    { label: 'Week 3', sales: 198000, profit: 49500 },
    { label: 'Week 4', sales: 267500, profit: 71800 },
  ],
  month: [
    { label: 'Jan', sales: 780000, profit: 198000 },
    { label: 'Feb', sales: 820000, profit: 209000 },
    { label: 'Mar', sales: 865000, profit: 224000 },
    { label: 'Apr', sales: 910000, profit: 236000 },
    { label: 'May', sales: 875000, profit: 221000 },
    { label: 'Jun', sales: 940000, profit: 248000 },
    { label: 'Jul', sales: 920500, profit: 241000 },
  ],
  year: [
    { label: '2022', sales: 8200000, profit: 2050000 },
    { label: '2023', sales: 9450000, profit: 2410000 },
    { label: '2024', sales: 10680000, profit: 2790000 },
    { label: '2025', sales: 11920000, profit: 3120000 },
    { label: '2026', sales: 6540000, profit: 1730000 },
  ],
}

export const recentSales = [
  { invoiceId: 'INV-1042', customer: 'Ahsan Raza', product: 'Full Cream Milk', qty: 5, amount: 750, date: '07 Jul 2026', status: 'Paid' },
  { invoiceId: 'INV-1041', customer: 'Sana Malik', product: 'Greek Yogurt', qty: 2, amount: 480, date: '07 Jul 2026', status: 'Paid' },
  { invoiceId: 'INV-1040', customer: 'Bilal Khan', product: 'Paneer', qty: 1, amount: 320, date: '06 Jul 2026', status: 'Pending' },
  { invoiceId: 'INV-1039', customer: 'Ayesha Noor', product: 'Butter', qty: 3, amount: 690, date: '06 Jul 2026', status: 'Paid' },
  { invoiceId: 'INV-1038', customer: 'Usman Tariq', product: 'Cream', qty: 2, amount: 400, date: '05 Jul 2026', status: 'Refunded' },
  { invoiceId: 'INV-1037', customer: 'Hira Fatima', product: 'Lassi', qty: 6, amount: 540, date: '05 Jul 2026', status: 'Paid' },
]

export const categories = ['All', 'Milk', 'Yogurt', 'Cheese', 'Butter & Cream', 'Beverages']

export const products = [
  { id: 1, name: 'Full Cream Milk', category: 'Milk', price: 150, stock: 120, unit: 'Liter', icon: 'milk' },
  { id: 2, name: 'Skimmed Milk', category: 'Milk', price: 140, stock: 8, unit: 'Liter', icon: 'milk' },
  { id: 3, name: 'Greek Yogurt', category: 'Yogurt', price: 240, stock: 45, unit: 'KG', icon: 'yogurt' },
  { id: 4, name: 'Plain Yogurt', category: 'Yogurt', price: 180, stock: 60, unit: 'KG', icon: 'yogurt' },
  { id: 5, name: 'Paneer', category: 'Cheese', price: 320, stock: 5, unit: 'KG', icon: 'cheese' },
  { id: 6, name: 'Cheddar Cheese', category: 'Cheese', price: 480, stock: 22, unit: 'Packet', icon: 'cheese' },
  { id: 7, name: 'Salted Butter', category: 'Butter & Cream', price: 230, stock: 34, unit: 'Packet', icon: 'butter' },
  { id: 8, name: 'Fresh Cream', category: 'Butter & Cream', price: 200, stock: 6, unit: 'Liter', icon: 'cream' },
  { id: 9, name: 'Mango Lassi', category: 'Beverages', price: 90, stock: 75, unit: 'Packet', icon: 'beverage' },
  { id: 10, name: 'Plain Lassi', category: 'Beverages', price: 80, stock: 3, unit: 'Packet', icon: 'beverage' },
  { id: 11, name: 'Ghee', category: 'Butter & Cream', price: 950, stock: 18, unit: 'KG', icon: 'butter' },
  { id: 12, name: 'Toned Milk', category: 'Milk', price: 130, stock: 90, unit: 'Liter', icon: 'milk' },
]

export function getStockStatus(stock) {
  if (stock <= 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

export const customers = [
  {
    id: 1,
    name: 'Ali Khan',
    email: 'ali.khan@example.com',
    phone: '0300-1234567',
    address: 'Shop 12, Main Market, Lahore',
    orders: 12,
    total: 25000,
    status: 'Active',
    invoices: [
      { id: 101, type: 'paid', amount: 5000, description: 'Milk & Yogurt supply', date: '05 Jul 2026' },
      { id: 102, type: 'udhaar', amount: 2000, description: 'Cheese order', date: '08 Jul 2026' },
    ],
  },
  {
    id: 2,
    name: 'Ahmed Raza',
    email: 'ahmed.raza@example.com',
    phone: '0312-9876543',
    address: 'House 45, Model Town, Lahore',
    orders: 8,
    total: 14500,
    status: 'Active',
    invoices: [
      { id: 103, type: 'paid', amount: 3200, description: 'Weekly milk supply', date: '03 Jul 2026' },
    ],
  },
  {
    id: 3,
    name: 'Sara Ahmed',
    email: 'sara.ahmed@example.com',
    phone: '0321-5556789',
    address: 'Flat 3B, Gulberg, Lahore',
    orders: 5,
    total: 8900,
    status: 'Inactive',
    invoices: [
      { id: 104, type: 'udhaar', amount: 1500, description: 'Butter & cream order', date: '01 Jul 2026' },
    ],
  },
]
