import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LuSearch,
  LuPlus,
  LuPencilLine,
  LuPrinter,
  LuDownload,
  LuPencil,
  LuTrash2,
  LuChevronDown,
  LuCheck,
  LuFilter,
} from 'react-icons/lu'
import Layout from '../components/Layout'
import CustomInvoiceModal from '../components/CustomInvoiceModal'
import InvoiceDetailModal from '../components/InvoiceDetailModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useShop } from '../context/ShopContext'

const sourceOptions = [
  { id: 'all', label: 'All Categories' },
  { id: 'custom', label: 'Custom' },
  { id: 'pos', label: 'POS Sale' },
]

export default function Invoices() {
  const { invoices, createInvoiceRecord, updateInvoiceRecord, deleteInvoiceRecord, receivePayment } = useShop()

  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all') // all | custom | pos
  const [filterOpen, setFilterOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [viewingInvoice, setViewingInvoice] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const customCount = invoices.filter((i) => i.source === 'custom').length

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.number.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase())
      const matchesSource = sourceFilter === 'all' || inv.source === sourceFilter
      return matchesSearch && matchesSource
    })
  }, [invoices, search, sourceFilter])

  const openNewInvoice = () => {
    setEditingInvoice(null)
    setModalOpen(true)
  }

  const openEditInvoice = (invoice) => {
    setEditingInvoice(invoice)
    setModalOpen(true)
  }

  const handleSubmit = (payload) => {
    const { advanceAmount, ...rest } = payload
    if (editingInvoice) {
      updateInvoiceRecord(editingInvoice.id, rest)
    } else {
      const created = createInvoiceRecord({ ...rest, source: 'custom' })
      if (created.customerInvoiceId && Number(advanceAmount) > 0) {
        receivePayment(created.customerId, Number(advanceAmount), 'Advance received at invoice creation', created.customerInvoiceId)
      }
    }
    setModalOpen(false)
    setEditingInvoice(null)
  }

  const handleDelete = () => {
    deleteInvoiceRecord(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <Layout title="Invoices">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Invoices</h1>
          <p className="text-sm text-ink-500 mt-1">All invoices generated from POS and custom entries</p>
        </div>

        {/* CUSTOM INVOICES STAT */}
        <div className="bg-white rounded-xl2 shadow-card border border-slate-50 p-5 flex items-center gap-4 max-w-xs">
          <span className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <LuPencilLine size={20} />
          </span>
          <div>
            <p className="text-sm text-ink-500">Custom Invoices</p>
            <p className="text-2xl font-bold text-ink-900">{customCount}</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Invoice # or customer name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        {/* CATEGORY FILTER — single dropdown */}
        <div className="relative w-full sm:w-64">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <LuFilter size={15} />
              {sourceOptions.find((f) => f.id === sourceFilter)?.label}
            </span>
            <LuChevronDown size={16} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-cardHover border border-slate-100 overflow-hidden">
                {sourceOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setSourceFilter(f.id); setFilterOpen(false) }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                      sourceFilter === f.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-ink-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                    {sourceFilter === f.id && <LuCheck size={15} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* NEW INVOICE */}
        <button
          onClick={openNewInvoice}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
        >
          <LuPlus size={18} /> New Invoice
        </button>

        {/* INVOICE LIST */}
        <div className="flex flex-col gap-4">
          {filtered.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl2 shadow-card border border-slate-50 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-lg font-bold text-primary-700">{invoice.number}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-50 text-violet-600">
                      {invoice.source === 'custom' ? 'Custom' : 'POS Sale'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        invoice.paymentMode === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {invoice.paymentMode === 'paid' ? 'Paid' : 'Credit'}
                    </span>
                  </div>
                </div>
                <p className="text-xl font-bold text-ink-900">Rs {invoice.total.toLocaleString()}</p>
              </div>

              <p className="text-sm font-medium text-ink-900">{invoice.customerName}</p>
              {invoice.customerPhone && <p className="text-xs text-ink-500">{invoice.customerPhone}</p>}
              <p className="text-xs text-ink-500 mt-1">
                {invoice.date}, {invoice.time} · {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-4 gap-2 mt-4">
                <ActionButton icon={LuPrinter} tone="blue" onClick={() => setViewingInvoice(invoice)} />
                <ActionButton icon={LuDownload} tone="emerald" onClick={() => setViewingInvoice(invoice)} />
                <ActionButton icon={LuPencil} tone="amber" onClick={() => openEditInvoice(invoice)} />
                <ActionButton icon={LuTrash2} tone="rose" onClick={() => setDeleteTarget(invoice)} />
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl2 border border-slate-50 p-10 text-center text-sm text-ink-500">
              No invoices yet. Create one from here or from the Point of Sale page.
            </div>
          )}
        </div>
      </div>

      <CustomInvoiceModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingInvoice(null) }}
        onSubmit={handleSubmit}
        initialData={editingInvoice}
      />

      <InvoiceDetailModal
        open={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete invoice?"
        message={<>This will permanently remove invoice <span className="font-medium text-ink-700">{deleteTarget?.number}</span>.</>}
      />
    </Layout>
  )
}

function ActionButton({ icon: Icon, tone, onClick }) {
  const toneClasses = {
    blue: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    rose: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  }
  return (
    <button onClick={onClick} className={`flex items-center justify-center py-2.5 rounded-xl transition-colors ${toneClasses[tone]}`}>
      <Icon size={17} />
    </button>
  )
}
