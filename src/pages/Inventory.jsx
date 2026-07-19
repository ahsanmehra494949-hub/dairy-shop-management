import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuSearch, LuPlus, LuPencil, LuTrash2, LuPackagePlus, LuChevronDown, LuCheck, LuFilter } from 'react-icons/lu'
import Layout from '../components/Layout'
import ProductModal from '../components/ProductModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import StockAdjustModal from '../components/StockAdjustModal'
import ProductIcon from '../components/ProductIcon'
import { EmptyState } from '../components/ProductsExtras'
import { getStockStatus } from '../data/dummyData'
import { useShop } from '../context/ShopContext'

const stockOptions = [
  { id: 'All', label: 'All' },
  { id: 'In Stock', label: 'In Stock' },
  { id: 'Low Stock', label: 'Low Stock' },
  { id: 'Out of Stock', label: 'Out of Stock' },
]

export default function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock, categories } = useShop()
  const location = useLocation()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')
  const [stockFilterOpen, setStockFilterOpen] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [stockTarget, setStockTarget] = useState(null)

  // If navigated here from Dashboard's "Add Product" quick action, open the modal automatically
  useEffect(() => {
    if (location.state?.openAdd) {
      setEditingProduct(null)
      setModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      const matchesStock = stockFilter === 'All' || getStockStatus(p.stock) === stockFilter
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, search, category, stockFilter])

  const paginated = filtered

  const openAddModal = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleSave = (form) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, form)
    } else {
      addProduct(form)
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    deleteProduct(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <Layout title="Inventory">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-ink-900">Inventory</h1>
        <p className="text-sm text-ink-500 mt-1">Add products and manage stock levels in one place</p>
      </div>

      <div className="bg-white rounded-xl2 shadow-card p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
          >
            <LuPlus size={17} /> Add Product
          </button>
        </div>

        {/* Stock status filter — single dropdown, same pattern as the Invoices category filter */}
        <div className="relative w-full sm:w-64 mb-5">
          <button
            onClick={() => setStockFilterOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <LuFilter size={15} />
              {stockOptions.find((f) => f.id === stockFilter)?.label}
            </span>
            <LuChevronDown size={16} className={`transition-transform ${stockFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {stockFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStockFilterOpen(false)} />
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-cardHover border border-slate-100 overflow-hidden">
                {stockOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setStockFilter(f.id); setStockFilterOpen(false) }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                      stockFilter === f.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-ink-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                    {stockFilter === f.id && <LuCheck size={15} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {paginated.length === 0 ? (
          <EmptyState onAddProduct={openAddModal} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-500 border-b border-slate-100">
                    <th className="py-3 pr-4 font-medium">Product</th>
                    <th className="py-3 pr-4 font-medium">Category</th>
                    <th className="py-3 pr-4 font-medium">Price</th>
                    <th className="py-3 pr-4 font-medium">Stock</th>
                    <th className="py-3 pr-4 font-medium">Unit</th>
                    <th className="py-3 pr-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => {
                    return (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <ProductIcon icon={p.icon} />
                            <span className="font-medium text-ink-900 whitespace-nowrap">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-ink-700 whitespace-nowrap">{p.category}</td>
                        <td className="py-3 pr-4 font-medium text-ink-900 whitespace-nowrap">Rs {p.price}</td>
                        <td className="py-3 pr-4 text-ink-700 whitespace-nowrap">{p.stock}</td>
                        <td className="py-3 pr-4 text-ink-700 whitespace-nowrap">{p.unit}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setStockTarget(p)}
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              aria-label="Adjust stock"
                              title="Add / Remove stock"
                            >
                              <LuPackagePlus size={16} />
                            </button>
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                              aria-label="Edit"
                            >
                              <LuPencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              aria-label="Delete"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProduct}
        categories={categories}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        productName={deleteTarget?.name}
      />
      <StockAdjustModal
        open={!!stockTarget}
        onClose={() => setStockTarget(null)}
        product={stockTarget}
        onAdjust={(amount) => adjustStock(stockTarget.id, amount)}
      />
    </Layout>
  )
}
