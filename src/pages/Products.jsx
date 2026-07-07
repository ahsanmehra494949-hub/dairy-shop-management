import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuSearch, LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu'
import Layout from '../components/Layout'
import ProductModal from '../components/ProductModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { EmptyState, Pagination } from '../components/ProductsExtras'
import { categories, getStockStatus } from '../data/dummyData'
import { useShop } from '../context/ShopContext'

const PAGE_SIZE = 6

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop()
  const location = useLocation()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

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
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
    <Layout title="Products">
      <div className="bg-white rounded-xl2 shadow-card border border-slate-50 p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={17} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all"
            />
          </div>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
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
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => {
                    const status = getStockStatus(p.stock)
                    return (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-lg">{p.image}</span>
                            <span className="font-medium text-ink-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-ink-700">{p.category}</td>
                        <td className="py-3 pr-4 font-medium text-ink-900">Rs {p.price}</td>
                        <td className="py-3 pr-4 text-ink-700">{p.stock}</td>
                        <td className="py-3 pr-4 text-ink-700">{p.unit}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-1.5">
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
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProduct}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        productName={deleteTarget?.name}
      />
    </Layout>
  )
}
