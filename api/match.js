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

  const foundNameLine = found.name
    ? `Name (child said): ${found.name}`
    : `Name: not provided`

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
            content: `You are a child safety matching assistant for Cameroon. Compare a missing child alert with a found child report and decide if they are likely the same child.

SCORING RULES:
- If the found child provided a name AND it matches (or is similar/shortened form of) the missing child's name → this is VERY strong evidence; confidence should be 80–95% unless other details clearly conflict.
- If gender is explicitly provided for both and they are different → return match "no", confidence ≤ 10.
- Age within 2 years → supporting evidence. Age difference > 4 years → weakening evidence.
- Description similarities (clothing, height, features) → supporting evidence.
- Location proximity → mild supporting evidence.
- "Unknown" gender or age means no conflict, not a mismatch.

CONFIDENCE GUIDE:
- 80–100 → high (name match + consistent details)
- 55–79 → medium (strong partial match without name, or name match with some detail uncertainty)
- 40–54 → low (weak partial match)
- < 40 → no match

Return ONLY valid JSON, no markdown:`,
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
${foundNameLine}
Approximate age: ${found.ageEstimate || 'unknown'}
Gender: ${found.gender || 'unknown'}
Description: ${found.description}
Location found: ${found.location}

Respond with ONLY:
{"match":"high"|"medium"|"low"|"no","confidence":0-100,"reason":"one sentence explaining the key evidence"}`,
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

  const nameHint = found.name ? `\n🏷️ *Child said their name is:* ${found.name}` : ''
  const body =
`🔔 *ChildShield — Possible Match Found*

Someone has reported finding a child that matches your missing alert for *${alert.name}*.

📍 *Found at:* ${found.location}
👶 *Description given:* ${found.description}${nameHint}

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
