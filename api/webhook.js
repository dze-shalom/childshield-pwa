import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const sessions = new Map()

const callGroq = async (systemPrompt, userMessage) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 400,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || 'Please try again.'
}

const MENU = `*ChildShield ChildVoice* 🛡️\n\nHello! Reply with:\n*1* - Report a missing child\n*2* - Report suspicious activity\n*3* - Emergency numbers\n*4* - Nearest safe zone`

const EMERGENCY = `*Emergency Numbers*\n\n17 - Police\n16 - Gendarmerie\n18 - Fire & Rescue\n+237 222 22 40 40 - Child Protection Hotline`

const SAFE_ZONES = `*Nearest Safe Zones*\n\nBuea Central Police: +237 233 32 22 22\nBuea Hospital: +237 233 32 23 45\nRENATA: +237 677 888 999\nLimbe Police: +237 233 33 22 11`

const handleMessage = async (phone, text) => {
  const session = sessions.get(phone) || { step: 'menu', data: {} }
  const t = text.trim().toLowerCase()

  if (['hi','hello','start','bonjour','allo'].includes(t) || session.step === 'menu') {
    if (['1'].includes(t) || session.step === 'name') {
      if (t === '1') {
        sessions.set(phone, { step: 'name', data: {} })
        return "What is the child's full name?"
      }
    }
    if (t === '2') {
      sessions.set(phone, { step: 'incident_desc', data: {} })
      return "Describe what you saw — appearance, what they were doing, and where."
    }
    if (t === '3') { sessions.set(phone, { step: 'menu', data: {} }); return EMERGENCY }
    if (t === '4') { sessions.set(phone, { step: 'menu', data: {} }); return SAFE_ZONES }
    sessions.set(phone, { step: 'menu', data: {} })
    return MENU
  }

  if (session.step === 'name') {
    sessions.set(phone, { ...session, step: 'age', data: { ...session.data, name: text } })
    return `How old is ${text}?`
  }
  if (session.step === 'age') {
    sessions.set(phone, { ...session, step: 'desc', data: { ...session.data, age: text } })
    return "What are they wearing? Any distinguishing features?"
  }
  if (session.step === 'desc') {
    sessions.set(phone, { ...session, step: 'location', data: { ...session.data, description: text } })
    return "Where were they last seen?"
  }
  if (session.step === 'location') {
    sessions.set(phone, { ...session, step: 'contact', data: { ...session.data, lastSeen: text } })
    return "Your contact number?"
  }
  if (session.step === 'contact') {
    const d = { ...session.data, contact: text }
    const summary = `Name: ${d.name}\nAge: ${d.age}\nLast seen: ${d.lastSeen}\nDescription: ${d.description}\nContact: ${d.contact}`
    sessions.set(phone, { step: 'confirm', data: d })
    return `*Alert Summary*\n\n${summary}\n\nReply *YES* to send or *EDIT* to start over.`
  }
  if (session.step === 'confirm') {
    if (t === 'yes' || t === 'oui') {
      await supabase.from('alerts').insert([{
        name: session.data.name, age: parseInt(session.data.age),
        description: session.data.description, last_seen: session.data.lastSeen,
        contact: session.data.contact, status: 'active', source: 'bot',
        created_at: new Date().toISOString()
      }])
      sessions.delete(phone)
      return `*Alert sent!*\n\nThe ChildShield community has been notified.\n\nTrack sightings: childshield.cm\n\nCall 17 to also notify police directly.`
    }
    if (t === 'edit') {
      sessions.set(phone, { step: 'name', data: {} })
      return "Let's start over. What is the child's full name?"
    }
  }
  if (session.step === 'incident_desc') {
    sessions.set(phone, { step: 'incident_loc', data: { description: text } })
    return "Where did this happen?"
  }
  if (session.step === 'incident_loc') {
    await supabase.from('incidents').insert([{
      description: session.data.description, location: text,
      type: 'suspicious', severity: 'medium', status: 'under_review',
      source: 'bot', time: new Date().toISOString()
    }])
    sessions.delete(phone)
    return "Report received anonymously. A moderator will review within 2 hours.\n\nIf this is happening now, call 17."
  }

  // Fallback to Groq
  const reply = await callGroq(
    "You are ChildVoice, a WhatsApp bot for ChildShield Cameroon child safety platform. Guide the user to reply 1 (missing child), 2 (suspicious activity), 3 (emergency numbers), or 4 (safe zones). Be brief and compassionate.",
    text
  )
  sessions.set(phone, { step: 'menu', data: {} })
  return reply
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const phone = req.body?.From
  const message = req.body?.Body

  if (!phone || !message) return res.status(400).send('Bad request')

  const reply = await handleMessage(phone, message)

  res.setHeader('Content-Type', 'text/xml')
  res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`)
}