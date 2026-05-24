# 🛡️ ChildShield Cameroon

**Community-powered child safety and emergency response platform.**

> *"We're not competing with WhatsApp. We're giving the community the coordination layer that WhatsApp was never designed to provide."*

---

##  Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` in your browser.

---

##  Features

###  Missing Child Alerts
- 3-step alert form: child info → last seen location → contact details
- Real-time community notifications
- Sightings feed — anyone can report where they saw the child
- One-tap WhatsApp share with pre-formatted message

###  Anonymous Incident Reporting
- No login required, no identity stored
- Report suspicious persons, unsafe areas, harassment, attempted abductions
- Quick Exit button — closes immediately for safety
- Reports go to trained community moderators

###  Safe Zones Map
- Leaflet-powered interactive map
- Police stations, hospitals, NGOs, institutions marked
- Active alert pins on the map
- AI risk heatmap showing incident-dense zones
- List view with contact details

###  Get Help Now
- All Cameroon emergency numbers (17, 16, 18)
- Child Protection Hotline
- Step-by-step guides: what to do if a child reports abuse, etc.
- Quick Exit button for safety
- ChildVoice WhatsApp bot integration

###  Admin Dashboard
- Active alerts and KPI stats
- Monthly alert trend chart
- Incident type breakdown (donut chart)
- AI Risk Zone heatmap rankings
- Community resolution tracking

---

##  Architecture

```
Frontend:     React 18 + Vite (PWA)
Styling:      Tailwind CSS + Custom CSS Variables
Maps:         React-Leaflet + OpenStreetMap
State:        React Context (mock data → replace with Supabase)
Backend:      Supabase (PostgreSQL + Realtime + Auth)
Bot:          ChildVoice WhatsApp Bot (Twilio + Claude API)
Hosting:      Vercel (free tier)
```

---

##  Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local` from `.env.example`
4. Run the SQL schema from `src/lib/supabase.js` comments

Tables needed: `alerts`, `sightings`, `incidents`, `users`

---

##  ChildVoice WhatsApp Bot

The companion bot allows anyone to report via WhatsApp without downloading the app.

**Flow:**
1. User messages the bot: `"A child is missing near Mile 4"`
2. Bot (powered by Claude API) extracts: type, location, description
3. Report appears instantly on ChildShield dashboard
4. If missing child: community alert triggered

**Setup:** Twilio WhatsApp Sandbox → Webhook → Your backend endpoint

---

##  User Roles

| Role | Access |
|------|--------|
| Anonymous Public | Submit reports via bot, view active alerts |
| Verified User | Submit sightings, receive alerts for their zone |
| Community Moderator | Verify sightings, manage zone incidents |
| Regional Coordinator | Manage moderators, coordinate with authorities |
| Platform Admin | Full access, system management |

---

## 🇨🇲 Local Context

ChildShield is built specifically for Cameroon:
- Areas include Buea, Limbe, Douala, Yaoundé
- Bilingual support (English/French) — roadmap feature
- Integrates with existing community structures: quarter heads, churches, schools
- WhatsApp-first design (most common communication channel)
- Works on 2G/3G connections
- Optimized for low-end Android devices

---

## 📦 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

---

##  Built For

**AIMS Africa Science Week Hackathon 2026**  
Theme: *Harnessing Science & Innovation for Sustainable Child Safety and Community Protection in Africa*

**Team:** ChildShield Cameroon  
**Contact:** childshield.cm@gmail.com

---

## 📄 License

MIT — Built with ❤️ for African communities
