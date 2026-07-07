import { createContext, useContext, useState } from 'react'
import { products as initialProducts, recentSales as initialSales } from '../data/dummyData'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)
  const [recentSales, setRecentSales] = useState(initialSales)

  const addProduct = (product) => {
    setProducts((prev) => [{ id: Date.now(), image: '🥛', ...product }, ...prev])
  }

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
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

  return (
    <ShopContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, recentSales, addSale }}
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
