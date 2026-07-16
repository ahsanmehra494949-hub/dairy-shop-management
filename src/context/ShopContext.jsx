import { createContext, useContext, useState } from 'react'
import { products as initialProducts, recentSales as initialSales, categories as initialCategories, customers as initialCustomers } from '../data/dummyData'

const ShopContext = createContext(null)

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)
  const [recentSales, setRecentSales] = useState(initialSales)
  const [categories, setCategories] = useState(initialCategories.filter((c) => c !== 'All'))
  const [customers, setCustomers] = useState(initialCustomers)
  const [invoices, setInvoices] = useState([]) // global invoice history: POS Sale + Custom
  const [invoiceCounter, setInvoiceCounter] = useState(1001)

  // Shop + Owner info shown on printed invoices. Editable from Settings > Shop Information.
  const [shopInfo, setShopInfo] = useState({
    name: 'Fresh Dairy Shop',
    address: 'Main Market',
    contact: '0300-0000000',
    ownerName: 'Shop Owner',
    ownerContact: '',
  })

  const updateShopInfo = (updates) => {
    setShopInfo((prev) => ({ ...prev, ...updates }))
  }

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
        date: formatDate(new Date()),
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

  // ---- Customers ----
  const addCustomer = (customer) => {
    const newCustomer = {
      id: Date.now(),
      orders: 0,
      total: 0,
      status: 'Active',
      invoices: [],
      payments: [],
      ...customer,
    }
    setCustomers((prev) => [newCustomer, ...prev])
    return newCustomer
  }

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  const changeCustomerStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    )
  }

  const getCustomer = (id) => customers.find((c) => String(c.id) === String(id))

  // Adds an invoice (Paid or Credit/udhaar) to a customer's own ledger, and updates their orders/total.
  // `type: 'udhaar'` invoices track paidAmount separately so they can be settled partially, over time,
  // possibly across several separate udhaar invoices for the same customer.
  const addInvoice = (customerId, invoice) => {
    const amount = Number(invoice.amount || 0)
    const newInvoice = {
      id: Date.now(),
      date: formatDate(new Date()),
      paidAmount: invoice.type === 'paid' ? amount : 0,
      paymentHistory: [],
      ...invoice,
    }
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              orders: c.orders + 1,
              total: c.total + amount,
              invoices: [newInvoice, ...(c.invoices || [])],
            }
          : c
      )
    )
    return newInvoice
  }

  // Records a payment received from a customer against their udhaar (credit).
  // If `invoiceId` is given, the payment is applied to that specific udhaar invoice only (capped at
  // its remaining balance). If not given, the amount is auto-applied oldest-first (FIFO) across all
  // of that customer's open udhaar invoices — useful for a general "advance" payment.
  const receivePayment = (customerId, amount, note = '', invoiceId = null) => {
    let remainingToApply = Number(amount)
    const paymentDate = formatDate(new Date())
    const payment = { id: Date.now(), amount: Number(amount), note, date: paymentDate, invoiceId: invoiceId || null }

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c

        let invoicesToApply = (c.invoices || [])
        if (invoiceId) {
          invoicesToApply = invoicesToApply.filter((inv) => inv.id === invoiceId)
        } else {
          // Oldest udhaar invoices first (list is stored newest-first, so reverse for FIFO).
          invoicesToApply = invoicesToApply
            .filter((inv) => inv.type === 'udhaar' && Number(inv.amount) - Number(inv.paidAmount || 0) > 0)
            .slice()
            .reverse()
        }

        const updatedInvoices = c.invoices.map((inv) => {
          if (remainingToApply <= 0) return inv
          const isTarget = invoicesToApply.some((t) => t.id === inv.id)
          if (!isTarget) return inv
          const due = Number(inv.amount) - Number(inv.paidAmount || 0)
          if (due <= 0) return inv
          const applied = Math.min(due, remainingToApply)
          remainingToApply -= applied
          return {
            ...inv,
            paidAmount: Number(inv.paidAmount || 0) + applied,
            paymentHistory: [...(inv.paymentHistory || []), { date: paymentDate, amount: applied, note }],
          }
        })

        return {
          ...c,
          invoices: updatedInvoices,
          payments: [payment, ...(c.payments || [])],
        }
      })
    )
    return payment
  }

  // ---- Global Invoices (POS Sale + Custom) ----
  // Creates a full invoice record used by both the POS and Invoices pages.
  const createInvoiceRecord = ({
    source, // 'pos' | 'custom'
    items, // [{ productId, name, price, qty }]
    subtotal,
    discountPercent = 0,
    taxPercent = 0,
    total,
    paymentMode, // 'paid' | 'credit'
    customerId = null,
    customerName = 'Walk-in Customer',
    customerPhone = '',
    customerAddress = '',
  }) => {
    const now = new Date()
    const newInvoice = {
      id: Date.now(),
      number: `INV-${invoiceCounter}`,
      source,
      items,
      subtotal,
      discountPercent,
      taxPercent,
      total,
      paymentMode,
      customerId,
      customerName,
      customerPhone,
      customerAddress,
      date: formatDate(now),
      time: formatTime(now),
    }

    setInvoiceCounter((n) => n + 1)
    setInvoices((prev) => [newInvoice, ...prev])

    // Reduce stock for every product sold in this invoice.
    items.forEach((item) => adjustStock(item.productId, -item.qty))

    // If tied to a saved customer, also reflect it on their own profile ledger.
    let customerInvoiceId = null
    if (customerId) {
      const ledgerInvoice = addInvoice(customerId, {
        type: paymentMode === 'paid' ? 'paid' : 'udhaar',
        amount: total,
        description: items.map((i) => i.name).join(', ') || `${items.length} item(s)`,
      })
      customerInvoiceId = ledgerInvoice.id
    }

    return { ...newInvoice, customerId, customerInvoiceId }
  }

  const updateInvoiceRecord = (id, updates) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)))
  }

  const deleteInvoiceRecord = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
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
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        changeCustomerStatus,
        getCustomer,
        addInvoice,
        receivePayment,
        invoices,
        createInvoiceRecord,
        updateInvoiceRecord,
        deleteInvoiceRecord,
        shopInfo,
        updateShopInfo,
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
