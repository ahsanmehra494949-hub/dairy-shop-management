import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LuArrowLeft,
  LuPhone,
  LuMail,
  LuMapPin,
  LuPlus,
  LuReceipt,
  LuEye,
} from 'react-icons/lu'
import Layout from '../components/Layout'
import InvoiceModal from '../components/InvoiceModal'
import InvoiceViewModal from '../components/InvoiceViewModal'
import { useShop } from '../context/ShopContext'

export default function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCustomer, addInvoice } = useShop()
  const customer = getCustomer(id)

  const [activeTab, setActiveTab] = useState('udhaar')
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState(null)

  if (!customer) {
    return (
      <Layout title="Customer Profile">
        <div className="bg-white rounded-2xl border p-10 text-center">
          <p className="text-ink-500 mb-4">Customer not found.</p>
          <button
            onClick={() => navigate('/customers')}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium"
          >
            Back to Customers
          </button>
        </div>
      </Layout>
    )
  }

  const invoices = customer.invoices || []
  const paidInvoices = invoices.filter((i) => i.type === 'paid')
  const udhaarInvoices = invoices.filter((i) => i.type === 'udhaar')
  const activeInvoices = activeTab === 'paid' ? paidInvoices : udhaarInvoices

  const paidTotal = paidInvoices.reduce((sum, i) => sum + Number(i.amount), 0)
  const udhaarTotal = udhaarInvoices.reduce((sum, i) => sum + Number(i.amount), 0)

  const handleSaveInvoice = (form) => {
    addInvoice(customer.id, form)
    setInvoiceModalOpen(false)
    setActiveTab(form.type)
  }

  const initials = customer.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Layout title="Customer Profile">
      <div className="space-y-6">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-primary-600 transition-colors"
        >
          <LuArrowLeft size={16} /> Back to Customers
        </button>

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-ink-900">{customer.name}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <LuPhone size={14} /> {customer.phone}
                  </span>
                  {customer.email && (
                    <span className="flex items-center gap-1.5">
                      <LuMail size={14} /> {customer.email}
                    </span>
                  )}
                  {customer.address && (
                    <span className="flex items-center gap-1.5">
                      <LuMapPin size={14} /> {customer.address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setInvoiceModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shrink-0"
            >
              <LuPlus size={17} /> New Invoice
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatBox label="Total Orders" value={customer.orders} />
            <StatBox label="Total Spend" value={`Rs ${Number(customer.total || 0).toLocaleString()}`} />
            <StatBox label="Paid" value={`Rs ${paidTotal.toLocaleString()}`} tone="emerald" />
            <StatBox label="Credit" value={`Rs ${udhaarTotal.toLocaleString()}`} tone="amber" />
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="flex border-b">
            <TabButton
              label={`Credit (${udhaarInvoices.length})`}
              active={activeTab === 'udhaar'}
              onClick={() => setActiveTab('udhaar')}
            />
            <TabButton
              label={`Paid (${paidInvoices.length})`}
              active={activeTab === 'paid'}
              onClick={() => setActiveTab('paid')}
            />
          </div>

          {activeInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                <LuReceipt size={24} />
              </div>
              <p className="text-sm text-ink-500">
                No {activeTab === 'paid' ? 'paid' : 'udhaar'} invoices yet for this customer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-ink-500">Invoice #</th>
                    <th className="p-4 text-left font-medium text-ink-500">Description</th>
                    <th className="p-4 text-left font-medium text-ink-500">Amount</th>
                    <th className="p-4 text-left font-medium text-ink-500">Date</th>
                    <th className="p-4 text-right font-medium text-ink-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="p-4 font-medium text-ink-900">INV-{invoice.id}</td>
                      <td className="p-4 text-ink-700">{invoice.description}</td>
                      <td className="p-4 font-medium text-ink-900">Rs {Number(invoice.amount).toLocaleString()}</td>
                      <td className="p-4 text-ink-700">{invoice.date}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewingInvoice(invoice)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors text-sm font-medium"
                        >
                          <LuEye size={15} /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <InvoiceModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        defaultType={activeTab}
      />

      <InvoiceViewModal
        open={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
        customer={customer}
      />
    </Layout>
  )
}

function StatBox({ label, value, tone }) {
  const toneClass =
    tone === 'emerald' ? 'text-emerald-600' : tone === 'amber' ? 'text-amber-600' : 'text-ink-900'
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-ink-500">{label}</p>
      <p className={`text-lg font-bold mt-1 ${toneClass}`}>{value}</p>
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-ink-500 hover:text-ink-900'
      }`}
    >
      {label}
    </button>
  )
}
