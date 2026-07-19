import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LuFileChartColumn,
  LuTrendingUp,
  LuReceipt,
  LuDollarSign,
  LuChartColumn,
} from "react-icons/lu";
import Layout from "../components/Layout";
import InvoiceViewModal from "../components/InvoiceViewModal";
import { ReportsTrendChart, ReportsRevenueLineChart } from "../components/Charts";
import { useShop } from "../context/ShopContext";

const FILTERS = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isInRange(dateStr, filter) {
  const date = new Date(dateStr);
  if (isNaN(date)) return true;
  const now = new Date();

  if (filter === "day") {
    return date.toDateString() === now.toDateString();
  }
  if (filter === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo && date <= now;
  }
  if (filter === "month") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  if (filter === "year") {
    return date.getFullYear() === now.getFullYear();
  }
  return true;
}

// Builds the bar-chart series for the currently selected report period.
function buildChartData(invoices, filter) {
  if (filter === "year") {
    const totals = Object.fromEntries(MONTHS.map((m) => [m, 0]));
    invoices.forEach((inv) => {
      const d = new Date(inv.date);
      if (!isNaN(d)) totals[MONTHS[d.getMonth()]] += Number(inv.amount);
    });
    return MONTHS.map((m) => ({ label: m, amount: totals[m] }));
  }

  const totals = {};
  invoices.forEach((inv) => {
    totals[inv.date] = (totals[inv.date] || 0) + Number(inv.amount);
  });
  return Object.entries(totals)
    .map(([label, amount]) => ({ label, amount, _t: new Date(label).getTime() }))
    .sort((a, b) => a._t - b._t)
    .map(({ label, amount }) => ({ label, amount }));
}

export default function Reports() {
  const { customers } = useShop();
  const [filter, setFilter] = useState("month");
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Flatten every customer's invoices into one list, tagging the customer info.
  const allInvoices = useMemo(() => {
    return customers.flatMap((c) =>
      (c.invoices || []).map((inv) => ({ ...inv, customerName: c.name, customerPhone: c.phone, customer: c }))
    );
  }, [customers]);

  const filteredInvoices = useMemo(
    () => allInvoices.filter((inv) => isInRange(inv.date, filter)).sort((a, b) => b.id - a.id),
    [allInvoices, filter]
  );

  const chartData = useMemo(() => buildChartData(filteredInvoices, filter), [filteredInvoices, filter]);

  const totalSales = filteredInvoices.reduce((sum, i) => sum + Number(i.amount), 0);
  const paidTotal = filteredInvoices.filter((i) => i.type === "paid").reduce((sum, i) => sum + Number(i.amount), 0);
  const udhaarTotal = filteredInvoices.filter((i) => i.type === "udhaar").reduce((sum, i) => sum + Number(i.amount), 0);

  const activeLabel = FILTERS.find((f) => f.id === filter)?.label;

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Reports & Analytics</h1>
            <p className="text-sm text-ink-500 mt-1">View sales, profit and invoice reports</p>
          </div>

          {/* Period tabs live right under the page title */}
          <div className="flex gap-1.5 bg-white border p-1 rounded-xl w-fit">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.id ? "bg-primary-600 text-white" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Card title="Total Sales" value={`Rs ${totalSales.toLocaleString()}`} icon={LuReceipt} />
          <Card title="Paid" value={`Rs ${paidTotal.toLocaleString()}`} icon={LuTrendingUp} />
          <Card title="Invoices" value={filteredInvoices.length} icon={LuFileChartColumn} />
          <Card title="Credit" value={`Rs ${udhaarTotal.toLocaleString()}`} icon={LuDollarSign} />
        </div>

        {/* TREND CHART for the selected period */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-xl2 p-5 shadow-card border border-slate-50"
        >
          <div className="flex items-center gap-2 mb-1">
            <LuChartColumn size={18} className="text-primary-600" />
            <h3 className="font-semibold text-ink-900">{activeLabel} Report Trend</h3>
          </div>
          <p className="text-xs text-ink-500 mb-2">Invoice totals for the selected {filter} view</p>

          {chartData.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-sm text-ink-500">
              No invoice data for this period.
            </div>
          ) : (
            <ReportsTrendChart data={chartData} />
          )}
        </motion.div>

        {/* REVENUE/PROFIT LINE — sits right under the bar chart above */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white rounded-xl2 p-5 shadow-card border border-slate-50"
        >
          <div className="flex items-center gap-2 mb-1">
            <LuTrendingUp size={18} className="text-primary-600" />
            <h3 className="font-semibold text-ink-900">Revenue Trend</h3>
          </div>
          <p className="text-xs text-ink-500 mb-2">Profit &amp; revenue movement for the selected {filter} view</p>

          {chartData.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-sm text-ink-500">
              No invoice data for this period.
            </div>
          ) : (
            <ReportsRevenueLineChart data={chartData} />
          )}
        </motion.div>

        <div className="bg-white rounded-2xl border shadow-card overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">Invoices</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left">Invoice #</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">INV-{invoice.id}</td>
                    <td className="p-4">{invoice.customerName}</td>
                    <td className="p-4">{invoice.description}</td>
                    <td className="p-4 font-medium">Rs {Number(invoice.amount).toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.type === "paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {invoice.type === "paid" ? "Paid" : "Credit"}
                      </span>
                    </td>
                    <td className="p-4">{invoice.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewingInvoice(invoice)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-ink-500">
                      No invoices found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <InvoiceViewModal
        open={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
        customer={viewingInvoice?.customer}
      />
    </Layout>
  );
}

function Card({ title, value, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-2xl border shadow-card">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-2 text-ink-900">{value}</h2>
        </div>

        <div className="bg-primary-50 text-primary-600 p-3 rounded-xl">
          <Icon size={25} />
        </div>
      </div>
    </motion.div>
  );
}
