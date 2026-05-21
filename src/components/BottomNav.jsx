import { NavLink } from 'react-router-dom'
import { Home, MapPin, AlertTriangle, LayoutDashboard, LifeBuoy, Shield, AlertCircle } from 'lucide-react'
import InstallApp from './InstallApp'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'

export default function BottomNav() {
  const { t } = useLanguage()
  const navItems = [
    { to: '/', icon: Home, label: t('nav', 'home') },
    { to: '/map', icon: MapPin, label: t('nav', 'safeZones') },
    { to: '/report', icon: AlertTriangle, label: t('nav', 'report') },
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav', 'dashboard') },
    { to: '/help', icon: LifeBuoy, label: t('nav', 'getHelp') },
  ]

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-52 z-50 bg-[#0D1526]/95 backdrop-blur-xl border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 flex-shrink-0">
          <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-red-400" />
          </div>
          <div>
            <p className="font-syne font-bold text-white text-sm leading-none">ChildShield</p>
            <p className="text-white/30 text-[10px] mt-0.5">Cameroon</p>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems().map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-sm font-outfit font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Install app */}
        <div className="px-3 pt-2 flex-shrink-0">
          <InstallApp />
        </div>

        {/* Language switcher */}
        <div className="px-4 pb-3 flex-shrink-0">
          <LanguageSwitcher />
        </div>

        {/* Quick alert button */}
        <div className="px-3 pb-5 flex-shrink-0">
          <NavLink
            to="/alert/new"
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-colors w-full"
          >
            <AlertCircle size={18} className="text-white flex-shrink-0" />
            <span className="text-sm font-outfit font-semibold text-white">{t('nav', 'missing')}</span>
          </NavLink>
        </div>
      </nav>

      {/* ── Mobile bottom bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D1526]/95 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems().map(({ to, icon: Icon, label }) => (
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
    </>
  )
}
