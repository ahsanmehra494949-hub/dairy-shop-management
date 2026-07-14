import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #eef5ff',
  boxShadow: '0 8px 24px -12px rgba(33,88,221,0.25)',
  fontSize: 13,
}

export function SalesOverviewChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2f74f5" />
            <stop offset="100%" stopColor="#589cff" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`Rs ${v.toLocaleString()}`, 'Sales']} />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="url(#lineGlow)"
          strokeWidth={3}
          dot={{ r: 4, fill: '#2158dd', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function WeeklySalesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`Rs ${v.toLocaleString()}`, 'Sales']} />
        <Bar dataKey="sales" fill="#589cff" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ReportsTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`Rs ${v.toLocaleString()}`, 'Amount']} />
        <Bar dataKey="amount" fill="#2158dd" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
