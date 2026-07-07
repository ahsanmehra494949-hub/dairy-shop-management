import { LuPackageOpen } from 'react-icons/lu'

export function EmptyState({ onAddProduct }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
        <LuPackageOpen size={28} />
      </div>
      <h3 className="font-display font-semibold text-ink-900 mb-1">No products found</h3>
      <p className="text-sm text-ink-500 max-w-xs mb-5">
        Try a different search term or category filter, or add your first product to get started.
      </p>
      <button
        onClick={onAddProduct}
        className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Add Product
      </button>
    </div>
  )
}

export function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-1 pt-4 mt-2 border-t border-slate-100">
      <p className="text-xs text-ink-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-1.5">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              p === page ? 'bg-primary-600 text-white' : 'text-ink-700 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
