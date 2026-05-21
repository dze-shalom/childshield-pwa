import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { LanguageProvider } from './contexts/LanguageContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import NewAlert from './pages/NewAlert'
import AlertDetail from './pages/AlertDetail'
import AnonymousReport from './pages/AnonymousReport'
import AbuseReport from './pages/AbuseReport'
import SafeZones from './pages/SafeZones'
import GetHelp from './pages/GetHelp'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
      <div className="min-h-screen bg-[#080E1A] flex">
        <BottomNav />
        <main className="flex-1 md:ml-52 min-w-0">
          <div className="max-w-3xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/alert/new" element={<NewAlert />} />
              <Route path="/alert/:id" element={<AlertDetail />} />
              <Route path="/report" element={<AnonymousReport />} />
              <Route path="/abuse-report" element={<AbuseReport />} />
              <Route path="/map" element={<SafeZones />} />
              <Route path="/help" element={<GetHelp />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
      </LanguageProvider>
    </AppProvider>
  )
}
