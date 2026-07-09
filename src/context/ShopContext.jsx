import { createContext, useContext, useState } from 'react'
import { products as initialProducts, recentSales as initialSales, categories as initialCategories } from '../data/dummyData'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)
  const [recentSales, setRecentSales] = useState(initialSales)
  const [categories, setCategories] = useState(initialCategories.filter((c) => c !== 'All'))

  const addProduct = (product) => {
    setProducts((prev) => [{ id: Date.now(), icon: 'package', ...product }, ...prev])
  }

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Increase or decrease a product's stock quantity directly from the Inventory page.
  const adjustStock = (id, amount) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p))
    )
  }

  const addSale = (sale) => {
    const invoiceNumber = 1043 + recentSales.length
    setRecentSales((prev) => [
      {
        invoiceId: `INV-${invoiceNumber}`,
        status: 'Paid',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        ...sale,
      },
      ...prev,
    ])
  }

  const addCategory = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCategories((prev) => (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase()) ? prev : [...prev, trimmed]))
  }

  const deleteCategory = (name) => {
    setCategories((prev) => prev.filter((c) => c !== name))
  }

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        recentSales,
        addSale,
        categories,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within a ShopProvider')
  return ctx
}
