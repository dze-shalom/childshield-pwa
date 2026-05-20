# ChildShield Cameroon — Deployment Guide

Everything you need to go from code to live in under an hour.
All services used have **free tiers** that cover this project fully.

---

## Overview

| Service | Purpose | Cost |
|---------|---------|------|
| Supabase | Database + Realtime | Free |
| Vercel | Host the PWA | Free |
| Groq | AI for ChildVoice bot | Free |
| Twilio | WhatsApp messaging | Free sandbox |
| Railway | Host the bot server | Free |

---

## PART 1 — SUPABASE (Database)

### Step 1.1 — Create your project

1. Go to **https://supabase.com**
2. Click **Start your project** — sign up with GitHub
3. Click **New project**
4. Fill in:
   - **Name:** `childshield-cameroon`
   - **Database Password:** choose a strong password and **save it**
   - **Region:** `West EU (Ireland)` — closest free region to Cameroon
5. Click **Create new project** — wait about 2 minutes

---

### Step 1.2 — Create the database tables

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste this SQL and click **Run**:

```sql
-- ALERTS TABLE
create table alerts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer,
  gender text,
  description text,
  last_seen text,
  last_seen_time timestamptz default now(),
  status text default 'active',
  photo_url text,
  lat float,
  lng float,
  contact text,
  created_by text,
  source text default 'app',
  created_at timestamptz default now()
);

-- SIGHTINGS TABLE
create table sightings (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid references alerts(id) on delete cascade,
  reported_by text default 'Anonymous',
  location text,
  description text,
  lat float,
  lng float,
  verified boolean default false,
  time timestamptz default now()
);

-- INCIDENTS TABLE
create table incidents (
  id uuid primary key default gen_random_uuid(),
  type text,
  type_label text,
  description text,
  location text,
  lat float,
  lng float,
  severity text default 'medium',
  status text default 'under_review',
  source text default 'app',
  time timestamptz default now()
);

-- Enable Row Level Security (RLS) — allow public read/write for now
alter table alerts enable row level security;
alter table sightings enable row level security;
alter table incidents enable row level security;

create policy "Allow all" on alerts for all using (true) with check (true);
create policy "Allow all" on sightings for all using (true) with check (true);
create policy "Allow all" on incidents for all using (true) with check (true);
```

4. You should see **Success. No rows returned** — that means it worked.

---

### Step 1.3 — Enable Realtime

1. In the left sidebar click **Database** then **Replication**
2. Under **Supabase Realtime**, toggle ON for:
   - `alerts`
   - `sightings`
3. Click **Save**

---

### Step 1.4 — Get your API keys

1. In the left sidebar click **Project Settings** (gear icon at the bottom)
2. Click **API**
3. Copy and save these two values:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`

You will need these in the next step.

---

## PART 2 — DEPLOY THE PWA (Vercel)

### Step 2.1 — Push your code to GitHub

On your laptop, open a terminal in the `childshield-pwa` folder:

```bash
# If you haven't set up git yet
git init
git add .
git commit -m "Initial ChildShield commit"

# Create a new repo on github.com then:
git remote add origin https://github.com/YOUR_USERNAME/childshield-pwa.git
git branch -M main
git push -u origin main
```

---

### Step 2.2 — Create a Vercel account

1. Go to **https://vercel.com**
2. Click **Sign Up** — use **Continue with GitHub**
3. Authorize Vercel to access your GitHub

---

### Step 2.3 — Import your project

1. On your Vercel dashboard click **Add New... > Project**
2. Find `childshield-pwa` in the list and click **Import**
3. Vercel will detect it as a Vite project automatically
4. **Before clicking Deploy**, click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL from Step 1.4 |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 1.4 |

5. Click **Deploy**
6. Wait about 60 seconds
7. Vercel gives you a URL like `childshield-pwa.vercel.app` — **this is your live app**

---

### Step 2.4 — Add a custom domain (optional but impressive for the pitch)

1. In your Vercel project, click **Settings > Domains**
2. Add `childshield.cm` if you own it, or use the free Vercel URL
3. The free URL is fine for the hackathon

---

### Step 2.5 — Test your deployment

Open your Vercel URL on your phone. You should see:
- The ChildShield home screen
- A banner at the top/bottom asking to **Install App** (PWA prompt)
- All 5 navigation tabs working

**To install on Android:**
- Tap the menu icon in Chrome
- Tap **Add to Home Screen**
- The app installs like a native app

---

## PART 3 — DEPLOY CHILDVOICE BOT

### Step 3.1 — Get your Groq API key (free)

1. Go to **https://console.groq.com**
2. Click **Sign In** — use Google account
3. Click **API Keys** in the left sidebar
4. Click **Create API Key**
5. Name it `childvoice-bot`
6. Copy the key — it starts with `gsk_` — **save it immediately** (you only see it once)

---

### Step 3.2 — Set up Twilio WhatsApp Sandbox

1. Go to **https://console.twilio.com**
2. Sign up for a free account
3. In the left sidebar go to **Messaging > Try it out > Send a WhatsApp message**
4. Follow the instructions to **join the sandbox**:
   - Send `join <your-word>` to the sandbox number from your WhatsApp
5. Save the **Sandbox number** — looks like `+1 415 523 8886`
6. You will set the webhook URL in Step 3.5

---

### Step 3.3 — Get your Twilio credentials

1. On your Twilio dashboard, go to **Account > API keys & tokens**
2. Copy and save:
   - **Account SID** — starts with `AC...`
   - **Auth Token** — click to reveal

---

### Step 3.4 — Deploy the bot to Railway (free)

**Railway** is the easiest free Node.js host. No credit card needed.

1. Go to **https://railway.app**
2. Click **Login** — use GitHub
3. Click **New Project > Deploy from GitHub repo**
4. Select your `childshield-pwa` repository
5. Railway will show all folders — click **childvoice-bot**
6. Click **Deploy**

Now add your environment variables:
1. In your Railway project, click your service
2. Click **Variables**
3. Add each one:

| Variable | Value |
|----------|-------|
| `GROQ_API_KEY` | Your Groq key from Step 3.1 |
| `TWILIO_ACCOUNT_SID` | From Step 3.3 |
| `TWILIO_AUTH_TOKEN` | From Step 3.3 |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` |
| `SUPABASE_URL` | Your Supabase URL from Step 1.4 |
| `SUPABASE_SERVICE_KEY` | Your Supabase **service_role** key (not anon — get it from Project Settings > API) |
| `PORT` | `3001` |

4. Railway automatically redeploys — wait 30 seconds
5. Click **Settings > Networking > Generate Domain**
6. Copy your Railway URL — looks like `childvoice-bot.up.railway.app`

---

### Step 3.5 — Connect Twilio to your bot

1. Go back to your Twilio sandbox settings
2. In the **Sandbox Configuration** section, find:
   **"When a message comes in"**
3. Enter your Railway URL + `/webhook`:
   ```
   https://childvoice-bot.up.railway.app/webhook
   ```
4. Set the method to **HTTP POST**
5. Click **Save**

---

### Step 3.6 — Test ChildVoice

Send a WhatsApp message to your Twilio sandbox number:

```
hello
```

You should receive the ChildVoice greeting menu within seconds. Try:
- Send `1` to start a missing child report
- Send `2` to report suspicious activity
- Send `3` to get emergency numbers

Check your Supabase dashboard — go to **Table Editor > alerts** — you should see test records appearing.

---

## PART 4 — CONNECT EVERYTHING

### Step 4.1 — Update the PWA to use real Supabase

In `src/lib/supabase.js`, the environment variables are already set up. Since you added them in Vercel, they will be active automatically.

To verify: open your live Vercel app, submit a test alert, then check your Supabase **Table Editor > alerts** — the alert should appear.

---

### Step 4.2 — Replace mock data with live data (quick update)

In `src/contexts/AppContext.jsx`, the app currently uses mock data. To connect to Supabase:

Replace the top of `AppContext.jsx` with:

```javascript
import { supabase } from '../lib/supabase'

// In your AppProvider, replace useState(mockAlerts) with:
const [alerts, setAlerts] = useState([])

useEffect(() => {
  // Load initial alerts
  supabase.from('alerts').select('*, sightings(*)').order('created_at', { ascending: false })
    .then(({ data }) => { if (data) setAlerts(data) })

  // Subscribe to new alerts in real time
  const channel = supabase.channel('alerts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
      supabase.from('alerts').select('*, sightings(*)').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setAlerts(data) })
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [])
```

Push this change to GitHub — Vercel redeploys automatically.

---

## PART 5 — CHECKLIST BEFORE YOUR PITCH

Go through this before presenting to judges:

- [ ] Vercel app opens on your phone
- [ ] PWA installs to home screen (test on Android)
- [ ] Submit a test alert — appears in Supabase table
- [ ] ChildVoice bot responds to WhatsApp message
- [ ] Bot report appears in Supabase alerts table
- [ ] Map loads with safe zone pins
- [ ] Dashboard shows stats
- [ ] Anonymous report submits without login
- [ ] Abuse report Quick Exit button closes the page

---

## PART 6 — DEMO SCRIPT FOR THE PITCH

**The 3-minute demo that wins:**

1. Open ChildShield on your phone — show it installed as a PWA on the home screen

2. Say: *"In Cameroon today, if a child goes missing, the mother posts on WhatsApp Status. It works — but it's slow, it expires, and there's no coordination. Here's what ChildShield does instead."*

3. Tap **Report Missing Child** — fill in the form live

4. Show the alert appearing on the home feed

5. Show the WhatsApp share message that's pre-generated

6. Switch to your laptop — open the ChildVoice WhatsApp on your phone, send `1` — show the bot responding and the report appearing live on the dashboard

7. Say: *"The same platform. Two entry points. The community coordinates — and every report feeds the AI heatmap."*

8. Open the Dashboard — show the heatmap risk zones

9. Show the **Safe Reporting** flow — say: *"Sexual abuse is the most underreported threat. We built a completely private flow for survivors. The Quick Exit button closes the page instantly."*

**That's your pitch. 3 minutes. Live demo.**

---

## Troubleshooting

**PWA not installing:**
- Must be served over HTTPS — Vercel handles this automatically
- Must be opened in Chrome on Android

**Bot not responding:**
- Check Railway logs for errors
- Make sure your Twilio webhook URL ends with `/webhook`
- Make sure you joined the sandbox (Step 3.2)

**Supabase not connecting:**
- Double-check environment variables in Vercel — no spaces, no quotes
- Make sure RLS policies are set (Step 1.2)

**Build failing on Vercel:**
- Check that `package.json` is in the root of the folder you're deploying
- The build command should be `npm run build`, output folder `dist`

---

## Support

If anything breaks, the fastest fix is:
- Railway logs: click your service > **Deployments** > click the latest > **View Logs**
- Vercel logs: **Functions** tab in your project
- Supabase logs: **Logs** section in the left sidebar
