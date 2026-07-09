import {
  LuMilk,
  LuIceCreamBowl,
  LuPackage,
  LuDroplet,
  LuCupSoda,
  LuBox,
} from 'react-icons/lu'

// Central list of selectable product icons. Add more here any time.
export const PRODUCT_ICONS = [
  { id: 'milk', label: 'Milk', icon: LuMilk },
  { id: 'yogurt', label: 'Yogurt', icon: LuIceCreamBowl },
  { id: 'cheese', label: 'Cheese', icon: LuBox },
  { id: 'butter', label: 'Butter', icon: LuDroplet },
  { id: 'cream', label: 'Cream', icon: LuDroplet },
  { id: 'beverage', label: 'Beverage', icon: LuCupSoda },
  { id: 'package', label: 'Other', icon: LuPackage },
]

const ICON_MAP = Object.fromEntries(PRODUCT_ICONS.map((i) => [i.id, i.icon]))

// Sensible default icon per category, used when adding a product for the first time.
export function defaultIconForCategory(category = '') {
  const key = category.toLowerCase()
  if (key.includes('milk')) return 'milk'
  if (key.includes('yog')) return 'yogurt'
  if (key.includes('cheese')) return 'cheese'
  if (key.includes('butter')) return 'butter'
  if (key.includes('cream')) return 'cream'
  if (key.includes('beverage') || key.includes('drink')) return 'beverage'
  return 'package'
}

export default function ProductIcon({ icon, size = 18, className = '' }) {
  const Icon = ICON_MAP[icon] || LuPackage
  return (
    <span className={`w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 ${className}`}>
      <Icon size={size} />
    </span>
  )
}
