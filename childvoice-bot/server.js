// ChildVoice WhatsApp Bot — ChildShield Cameroon
// Powered by Groq (free) + Twilio WhatsApp + Supabase
//
// Deploy to: Railway, Render, or any Node.js host (free tier)
// Twilio webhook URL: https://your-app.railway.app/webhook

const express = require('express')
const twilio = require('twilio')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ── Clients ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ── In-memory session store (replace with Redis/Supabase for production) ────
const sessions = new Map()

const getSession = (phone) => sessions.get(phone) || { step: 'greeting', data: {} }
const setSession = (phone, session) => sessions.set(phone, session)
const clearSession = (phone) => sessions.delete(phone)

// ── Language detection ───────────────────────────────────────────────────────
const detectLanguage = (text) => {
  const frWords = ['bonjour', 'aide', 'enfant', 'disparu', 'signaler', 'perdu', 'aidez', 'merci', 'oui', 'non']
  const lower = text.toLowerCase()
  return frWords.some(w => lower.includes(w)) ? 'fr' : 'en'
}

// ── Groq AI call ─────────────────────────────────────────────────────────────
const callGroq = async (systemPrompt, userMessage, lang = 'en') => {
  const langInstruction = lang === 'fr'
    ? 'Respond ONLY in French. Keep responses short and clear.'
    : 'Respond ONLY in English. Keep responses short and clear.'

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',   // Fast, free, multilingual
      max_tokens: 400,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}\n\n${langInstruction}\nYou are ChildVoice, the WhatsApp bot for ChildShield Cameroon — a child safety platform. Be compassionate, clear, and brief. Never ask more than one question per message.`
        },
        { role: 'user', content: userMessage }
      ]
    })
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || 'Sorry, please try again.'
}

// ── Extract structured data from free text using Groq ────────────────────────
const extractAlertData = async (conversationText, lang) => {
  const prompt = `Extract child safety alert information from this conversation and return ONLY a JSON object with these fields:
  { "name": "", "age": "", "gender": "", "description": "", "lastSeen": "", "contact": "" }
  If a field is not mentioned, leave it empty. Do not add any explanation.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      temperature: 0,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: conversationText }
      ]
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content?.trim() || '{}'
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {}
  }
}

// ── Save alert to Supabase ────────────────────────────────────────────────────
const saveAlert = async (alertData, phone) => {
  const { data, error } = await supabase
    .from('alerts')
    .insert([{
      name: alertData.name || 'Unknown',
      age: parseInt(alertData.age) || null,
      gender: alertData.gender || '',
      description: alertData.description || '',
      last_seen: alertData.lastSeen || '',
      contact: alertData.contact || phone,
      status: 'active',
      source: 'bot',
      created_at: new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Save incident to Supabase ─────────────────────────────────────────────────
const saveIncident = async (incidentData, phone) => {
  const { error } = await supabase
    .from('incidents')
    .insert([{
      type: incidentData.type || 'other',
      description: incidentData.description || '',
      location: incidentData.location || '',
      severity: 'medium',
      status: 'under_review',
      source: 'bot',
      time: new Date().toISOString(),
    }])

  if (error) console.error('Incident save error:', error)
}

// ── Message templates ─────────────────────────────────────────────────────────
const MSG = {
  en: {
    greeting: `*ChildShield ChildVoice* 🛡️\n\nHello! I'm here to help keep children safe in Cameroon.\n\nReply with:\n*1* - Report a missing child\n*2* - Report suspicious activity\n*3* - I need help urgently\n*4* - Find nearest safe zone`,
    greetingPrompt: 'How can I help you today? Reply 1, 2, 3, or 4.',
    emergencyNumbers: `🚨 *Emergency Numbers*\n\n📞 *17* - Police\n📞 *16* - Gendarmerie\n📞 *18* - Fire & Rescue\n📞 *+237 222 22 40 40* - Child Protection Hotline\n\nIf you are in immediate danger, call 17 now.`,
    safeZones: `📍 *Nearest Safe Zones*\n\n🚔 Buea Central Police: +237 233 32 22 22\n🏥 Buea Regional Hospital: +237 233 32 23 45\n🤝 RENATA Child Protection: +237 677 888 999\n\n🚔 Limbe Central Police: +237 233 33 22 11\n🏥 Limbe Regional Hospital: +237 233 33 23 56`,
    alertSent: (name) => `🚨 *Alert sent to ChildShield!*\n\n✅ Alert for *${name}* is now live on the platform\n✅ Community guardians in your area have been notified\n✅ Nearest police station has been pinged\n\nTrack sightings here:\n🔗 childshield.cm\n\nI will notify you the moment someone reports a sighting. Stay near your phone.`,
    incidentSaved: `✅ *Report received anonymously*\n\nA community moderator will review this within 2 hours.\n\nIf this is happening right now, call *17* (Police) immediately.\n\nThank you for keeping children safe. 🛡️`,
    confirmAlert: (summary) => `✅ *Alert Summary*\n\n${summary}\n\nReply *YES* to send this alert to the community, or *EDIT* to change something.`,
  },
  fr: {
    greeting: `*ChildShield ChildVoice* 🛡️\n\nBonjour! Je suis ici pour aider à protéger les enfants au Cameroun.\n\nRépondez avec:\n*1* - Signaler un enfant disparu\n*2* - Signaler une activité suspecte\n*3* - J'ai besoin d'aide urgente\n*4* - Trouver la zone sûre la plus proche`,
    alertSent: (name) => `🚨 *Alerte envoyée à ChildShield!*\n\n✅ L'alerte pour *${name}* est maintenant en direct\n✅ Les gardiens communautaires de votre zone ont été notifiés\n\nSuivez les signalements ici:\n🔗 childshield.cm`,
    incidentSaved: `✅ *Rapport reçu anonymement*\n\nUn modérateur communautaire examinera ceci dans 2 heures.\n\nSi cela se passe maintenant, appelez le *17* (Police) immédiatement.`,
  }
}

// ── Main conversation handler ─────────────────────────────────────────────────
const handleMessage = async (phone, message) => {
  const text = message.trim()
  const session = getSession(phone)
  const lang = session.lang || detectLanguage(text)

  // Always detect language and store it
  if (!session.lang) session.lang = lang

  const t = MSG[lang] || MSG.en

  // ── GREETING / MENU ────────────────────────────────────────────────────────
  if (session.step === 'greeting' || ['hi', 'hello', 'bonjour', 'salut', 'start', 'help', 'allo'].includes(text.toLowerCase())) {
    setSession(phone, { step: 'menu', lang, data: {} })
    return t.greeting
  }

  // ── MENU SELECTION ─────────────────────────────────────────────────────────
  if (session.step === 'menu') {
    if (text === '1') {
      setSession(phone, { step: 'missing_name', lang, data: { type: 'missing_child', conversation: [] } })
      return lang === 'fr' ? "Quel est le *nom complet* de l'enfant?" : "What is the child's *full name*?"
    }
    if (text === '2') {
      setSession(phone, { step: 'incident_desc', lang, data: { type: 'incident' } })
      return lang === 'fr'
        ? "Décrivez ce que vous avez vu. Incluez l'apparence de la personne, ce qu'elle faisait et l'heure."
        : "Describe what you saw. Include the person's appearance, what they were doing, and the time."
    }
    if (text === '3') {
      setSession(phone, { step: 'menu', lang, data: {} })
      return t.emergencyNumbers || MSG.en.emergencyNumbers
    }
    if (text === '4') {
      setSession(phone, { step: 'menu', lang, data: {} })
      return MSG.en.safeZones
    }
  }

  // ── MISSING CHILD FLOW ─────────────────────────────────────────────────────
  if (session.step === 'missing_name') {
    session.data.name = text
    session.data.conversation = [`Name: ${text}`]
    setSession(phone, { ...session, step: 'missing_age' })
    return lang === 'fr' ? `Quel âge a ${text}?` : `How old is ${text}?`
  }

  if (session.step === 'missing_age') {
    session.data.age = text
    session.data.conversation.push(`Age: ${text}`)
    setSession(phone, { ...session, step: 'missing_description' })
    return lang === 'fr'
      ? "Que porte-t-il/elle? Signes distinctifs (cicatrices, marques de naissance)?"
      : "What is the child wearing? Any distinguishing features (scars, birthmarks)?"
  }

  if (session.step === 'missing_description') {
    session.data.description = text
    session.data.conversation.push(`Description: ${text}`)
    setSession(phone, { ...session, step: 'missing_location' })
    return lang === 'fr'
      ? "Ou a-t-il/elle ete vu(e) pour la derniere fois? Soyez aussi precis que possible."
      : "Where was the child last seen? Be as specific as possible."
  }

  if (session.step === 'missing_location') {
    session.data.lastSeen = text
    session.data.conversation.push(`Last seen: ${text}`)
    setSession(phone, { ...session, step: 'missing_contact' })
    return lang === 'fr'
      ? "Votre numero de contact pour que la communaute puisse vous joindre?"
      : "Your contact number so the community can reach you?"
  }

  if (session.step === 'missing_contact') {
    session.data.contact = text
    session.data.conversation.push(`Contact: ${text}`)

    const summary = lang === 'fr'
      ? `👧 *Nom:* ${session.data.name}\n🎂 *Age:* ${session.data.age}\n📍 *Vu en dernier:* ${session.data.lastSeen}\n👗 *Description:* ${session.data.description}\n📞 *Contact:* ${session.data.contact}`
      : `👧 *Name:* ${session.data.name}\n🎂 *Age:* ${session.data.age}\n📍 *Last seen:* ${session.data.lastSeen}\n👗 *Description:* ${session.data.description}\n📞 *Contact:* ${session.data.contact}`

    setSession(phone, { ...session, step: 'missing_confirm' })
    return (t.confirmAlert || MSG.en.confirmAlert)(summary)
  }

  if (session.step === 'missing_confirm') {
    if (text.toLowerCase() === 'yes' || text.toLowerCase() === 'oui') {
      try {
        await saveAlert(session.data, phone)
        clearSession(phone)
        return (t.alertSent || MSG.en.alertSent)(session.data.name)
      } catch (err) {
        console.error('Save alert error:', err)
        return 'Alert saved locally. Please also call 17 to notify police.'
      }
    }
    if (text.toLowerCase() === 'edit' || text.toLowerCase() === 'modifier') {
      setSession(phone, { step: 'missing_name', lang, data: { type: 'missing_child', conversation: [] } })
      return lang === 'fr' ? "Recommençons. Quel est le nom complet de l'enfant?" : "Let's start over. What is the child's full name?"
    }
  }

  // ── INCIDENT FLOW ──────────────────────────────────────────────────────────
  if (session.step === 'incident_desc') {
    session.data.description = text
    setSession(phone, { ...session, step: 'incident_location' })
    return lang === 'fr' ? "Ou cela s'est-il passe?" : "Where did this happen?"
  }

  if (session.step === 'incident_location') {
    session.data.location = text
    try {
      await saveIncident(session.data, phone)
    } catch (err) {
      console.error('Save incident error:', err)
    }
    clearSession(phone)
    return t.incidentSaved || MSG.en.incidentSaved
  }

  // ── FALLBACK: Use Groq AI for anything unrecognized ────────────────────────
  const systemPrompt = `You are ChildVoice, the WhatsApp bot for ChildShield Cameroon.
Your job is to help users report missing children, suspicious activity, and abuse.
Current conversation context: The user sent "${text}" and we don't know what they mean.
Guide them back to one of these options:
1 - Report missing child
2 - Report suspicious activity  
3 - Emergency help numbers
4 - Find nearest safe zone
Keep your response under 3 sentences.`

  const aiResponse = await callGroq(systemPrompt, text, lang)
  setSession(phone, { step: 'menu', lang, data: {} })
  return aiResponse
}

// ── Twilio webhook endpoint ────────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse()

  try {
    const phone = req.body.From
    const message = req.body.Body

    if (!phone || !message) {
      twiml.message('Invalid request.')
      return res.type('text/xml').send(twiml.toString())
    }

    console.log(`[${phone}] Received: ${message}`)
    const reply = await handleMessage(phone, message)
    console.log(`[${phone}] Replied: ${reply.slice(0, 80)}...`)

    twiml.message(reply)
  } catch (err) {
    console.error('Webhook error:', err)
    twiml.message('Sorry, something went wrong. Please try again or call 17 for emergencies.')
  }

  res.type('text/xml').send(twiml.toString())
})

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ChildVoice bot is running',
    powered_by: 'Groq + LLaMA 3.1',
    platform: 'ChildShield Cameroon'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`ChildVoice bot running on port ${PORT}`))
