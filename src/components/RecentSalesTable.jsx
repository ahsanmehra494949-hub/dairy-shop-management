const statusStyles = {
  Paid: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Refunded: 'bg-rose-50 text-rose-600',
}

export default function RecentSalesTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-500 border-b border-slate-100">
            <th className="py-3 pr-4 font-medium">Invoice ID</th>
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Product</th>
            <th className="py-3 pr-4 font-medium">Qty</th>
            <th className="py-3 pr-4 font-medium">Amount</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.invoiceId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
              <td className="py-3 pr-4 font-medium text-ink-900">{row.invoiceId}</td>
              <td className="py-3 pr-4 text-ink-700">{row.customer}</td>
              <td className="py-3 pr-4 text-ink-700">{row.product}</td>
              <td className="py-3 pr-4 text-ink-700">{row.qty}</td>
              <td className="py-3 pr-4 font-medium text-ink-900">Rs {row.amount}</td>
              <td className="py-3 pr-4 text-ink-500">{row.date}</td>
              <td className="py-3 pr-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[row.status]}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
