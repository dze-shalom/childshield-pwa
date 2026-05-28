import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ── Groq comparison ───────────────────────────────────────────────────────────

const GROQ_TIMEOUT_MS = 8000
const MATCH_BATCH_SIZE = 5

async function compareWithGroq(alert, found) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS)

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 150,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a child safety matching assistant. Compare two child descriptions and return ONLY a valid JSON object — no markdown, no explanation outside the JSON.',
          },
          {
            role: 'user',
            content: `MISSING CHILD ALERT:
Name: ${alert.name}
Age: ${alert.age} years old
Gender: ${alert.gender}
Description: ${alert.description}
Last seen: ${alert.last_seen}

FOUND CHILD REPORT:
Approximate age: ${found.ageEstimate || 'unknown'}
Gender: ${found.gender || 'unknown'}
Description: ${found.description}
Location found: ${found.location}

Are these likely the same child? Respond with ONLY:
{"match":"high"|"medium"|"low"|"no","confidence":0-100,"reason":"one sentence"}`,
          },
        ],
      }),
    })
    clearTimeout(timer)
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() || '{}'
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim())
    } catch {
      return { match: 'no', confidence: 0, reason: 'Parse error' }
    }
  } catch (err) {
    clearTimeout(timer)
    return { match: 'no', confidence: 0, reason: err.name === 'AbortError' ? 'Timeout' : 'Error' }
  }
}

// ── WhatsApp notification to parent ──────────────────────────────────────────

async function notifyParent(alert, found) {
  const sid   = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from  = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

  if (!sid || !token || !alert.contact) return

  const digits = alert.contact.replace(/\s+/g, '').replace(/^00/, '+')
  const to = digits.startsWith('+') ? `whatsapp:${digits}` : `whatsapp:+${digits}`

  const body =
`🔔 *ChildShield — Possible Match Found*

Someone has reported finding a child that matches your missing alert for *${alert.name}*.

📍 *Found at:* ${found.location}
👶 *Description given:* ${found.description}

📞 *Contact the finder now:* ${found.contact}

Please call or WhatsApp them immediately to confirm.

_ChildShield — Community Child Safety_
_If this is a mistake, ignore this message._`

  const creds = Buffer.from(`${sid}:${token}`).toString('base64')
  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }),
    }
  ).catch(err => console.error('WhatsApp send error:', err))
}

// ── Run comparisons in capped batches ────────────────────────────────────────

async function compareBatched(alerts, found) {
  const results = []
  for (let i = 0; i < alerts.length; i += MATCH_BATCH_SIZE) {
    const batch = alerts.slice(i, i + MATCH_BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (alert) => {
        const result = await compareWithGroq(alert, found)
        return {
          alert: {
            id: alert.id,
            name: alert.name,
            age: alert.age,
            gender: alert.gender,
            description: alert.description,
            lastSeen: alert.last_seen,
            contact: alert.contact,
            createdBy: alert.created_by,
          },
          confidence: result.confidence ?? 0,
          level: result.match ?? 'no',
          reason: result.reason ?? '',
        }
      })
    )
    results.push(...batchResults)
  }
  return results
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { found } = req.body
  if (!found?.description || !found?.location) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('id, name, age, gender, description, last_seen, contact, created_by')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: 'Failed to fetch alerts' })
  if (!alerts?.length) return res.status(200).json({ matches: [] })

  const results = await compareBatched(alerts, found)

  const matches = results
    .filter(r => r.level !== 'no' && r.confidence >= 40)
    .sort((a, b) => b.confidence - a.confidence)

  const toNotify = matches.filter(m => m.confidence >= 65)
  await Promise.all(toNotify.map(m => notifyParent(m.alert, found)))

  return res.status(200).json({
    matches,
    notified: toNotify.map(m => m.alert.name),
  })
}
