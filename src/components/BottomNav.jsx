import { NavLink } from 'react-router-dom'
import { Home, MapPin, AlertTriangle, LayoutDashboard, LifeBuoy } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/map', icon: MapPin, label: 'Safe Zones' },
  { to: '/report', icon: AlertTriangle, label: 'Report' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/help', icon: LifeBuoy, label: 'Get Help' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D1526]/95 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-outfit font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
