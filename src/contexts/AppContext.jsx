import { createContext, useContext, useState } from 'react'
import { mockAlerts, mockIncidents } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [incidents, setIncidents] = useState(mockIncidents)
  const [user, setUser] = useState({ role: 'public', name: 'Guest' }) // roles: public, verified, moderator, admin
  const [notifications, setNotifications] = useState(2)

  const addAlert = (alert) => {
    const newAlert = {
      ...alert,
      id: `a${Date.now()}`,
      status: 'active',
      sightings: [],
      createdAt: new Date().toISOString(),
    }
    setAlerts((prev) => [newAlert, ...prev])
    return newAlert
  }

  const addSighting = (alertId, sighting) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, sightings: [...a.sightings, { ...sighting, id: `s${Date.now()}`, time: new Date().toISOString(), verified: false }] }
          : a
      )
    )
  }

  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: `i${Date.now()}`,
      status: 'under_review',
      time: new Date().toISOString(),
    }
    setIncidents((prev) => [newIncident, ...prev])
  }

  const resolveAlert = (alertId) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a)))
  }

  return (
    <AppContext.Provider value={{ alerts, incidents, user, setUser, notifications, addAlert, addSighting, addIncident, resolveAlert }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
