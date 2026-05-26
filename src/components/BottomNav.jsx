import { NavLink } from 'react-router-dom'
import { Home, MapPin, AlertTriangle, LayoutDashboard, LifeBuoy, Shield, AlertCircle, UserCircle, LogOut, Sun, Moon } from 'lucide-react'
import InstallApp from './InstallApp'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import { useApp } from '../contexts/AppContext'
import { useTheme } from '../contexts/ThemeContext'

export default function BottomNav() {
  const { t } = useLanguage()
  const { user, logout } = useApp()
  const { isDark, toggleTheme } = useTheme()
  const isGuest = !user || !user.id
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
      <nav className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-52 z-50 backdrop-blur-xl border-r"
           style={{ backgroundColor: 'var(--bg-sidebar-blur)', borderColor: 'var(--border)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b flex-shrink-0"
             style={{ borderColor: 'var(--border)' }}>
          <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-red-400" />
          </div>
          <div>
            <p className="font-syne font-bold text-white text-sm leading-none">ChildShield</p>
            <p className="text-white/30 text-[10px] mt-0.5">Cameroon</p>
          </div>
        </div>

        {/* User section */}
        <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          {isGuest ? (
            <div className="flex gap-2">
              <NavLink to="/login"
                className="flex-1 text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors">
                Sign In
              </NavLink>
              <NavLink to="/register"
                className="flex-1 text-center py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:text-red-700 text-xs font-medium transition-colors">
                Register
              </NavLink>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 text-sm font-bold">{(user.name || 'U')[0].toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{user.name}</p>
                  <p className="text-white/30 text-xs capitalize">{user.role}</p>
                </div>
              </div>
              <button onClick={logout}
                className="flex items-center gap-2 mt-1 px-2 py-1.5 w-full text-white/30 hover:text-white/60 text-xs transition-colors rounded-lg hover:bg-white/5">
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 bg-red-500/10'
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

        {/* Theme toggle */}
        <div className="px-3 pb-2 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--overlay-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm font-outfit font-medium">
              {isDark ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t pb-safe"
           style={{ backgroundColor: 'var(--bg-mobile-blur)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 bg-red-500/10'
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
          {/* Account / profile shortcut */}
          <NavLink
            to={isGuest ? '/login' : '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
                isActive ? 'text-red-400 bg-red-500/10' : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            {isGuest ? (
              <>
                <UserCircle size={20} strokeWidth={1.8} />
                <span className="text-[10px] font-outfit font-medium">Sign In</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-[9px] font-bold">{(user.name || 'U')[0].toUpperCase()}</span>
                </div>
                <span className="text-[10px] font-outfit font-medium text-white/60">
                  {(user.name || '').split(' ')[0]}
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </>
  )
}
