import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import NewAlert from './pages/NewAlert'
import AlertDetail from './pages/AlertDetail'
import AnonymousReport from './pages/AnonymousReport'
import AbuseReport from './pages/AbuseReport'
import SafeZones from './pages/SafeZones'
import GetHelp from './pages/GetHelp'
import Dashboard from './pages/Dashboard'
import FoundChildReport from './pages/FoundChildReport'
import Login from './pages/Login'
import Register from './pages/Register'
import ChildVoice from './pages/ChildVoice'
import ProtectedRoute from './components/ProtectedRoute'
import OfflineBanner from './components/OfflineBanner'

export default function App() {
  return (
    <ThemeProvider>
    <AppProvider>
      <LanguageProvider>
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-app)' }}>
        <OfflineBanner />
        <BottomNav />
        <main className="flex-1 md:ml-52 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* ── Protected: login required to submit ── */}
            <Route path="/alert/new" element={<ProtectedRoute><NewAlert /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><AnonymousReport /></ProtectedRoute>} />
            <Route path="/abuse-report" element={<ProtectedRoute><AbuseReport /></ProtectedRoute>} />
            <Route path="/found-child" element={<ProtectedRoute><FoundChildReport /></ProtectedRoute>} />

            {/* ── Public: anyone can view ── */}
            <Route path="/alert/:id" element={<AlertDetail />} />
            <Route path="/map" element={<SafeZones />} />
            <Route path="/help" element={<GetHelp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/childvoice" element={<ChildVoice />} />
          </Routes>
        </main>
      </div>
      </LanguageProvider>
    </AppProvider>
    </ThemeProvider>
  )
}
