import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
// Get them from: https://app.supabase.com → Project Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── TABLE SCHEMAS ─────────────────────────────────────────────────────────────
//
// alerts:
//   id uuid primary key, name text, age int, gender text, description text,
//   last_seen text, last_seen_time timestamptz, status text,
//   photo_url text, lat float, lng float, contact text,
//   created_by text, created_at timestamptz
//
// sightings:
//   id uuid primary key, alert_id uuid references alerts(id),
//   reported_by text, location text, description text,
//   lat float, lng float, photo_url text,
//   verified boolean default false, time timestamptz
//
// incidents:
//   id uuid primary key, type text, description text,
//   location text, lat float, lng float,
//   severity text, status text, time timestamptz
//
// users:
//   id uuid primary key, phone text unique, name text,
//   role text default 'verified', region text,
//   verified boolean default false, created_at timestamptz
//
// ─── REAL-TIME SUBSCRIPTIONS ───────────────────────────────────────────────────
//
// Subscribe to new alerts in your region:
//
// const channel = supabase
//   .channel('alerts')
//   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
//     console.log('New alert:', payload.new)
//     // Show push notification
//   })
//   .subscribe()
//
// ─────────────────────────────────────────────────────────────────────────────

export const alertsService = {
  async getActive() {
    const { data, error } = await supabase.from('alerts').select('*, sightings(*)').eq('status', 'active').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async create(alert) {
    const { data, error } = await supabase.from('alerts').insert([alert]).select().single()
    if (error) throw error
    return data
  },
  async addSighting(sighting) {
    const { data, error } = await supabase.from('sightings').insert([sighting]).select().single()
    if (error) throw error
    return data
  },
}

export const incidentsService = {
  async create(incident) {
    const { data, error } = await supabase.from('incidents').insert([incident]).select().single()
    if (error) throw error
    return data
  },
  async getAll() {
    const { data, error } = await supabase.from('incidents').select('*').order('time', { ascending: false })
    if (error) throw error
    return data
  },
}
