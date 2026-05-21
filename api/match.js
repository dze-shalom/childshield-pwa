import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function callGroq(systemPrompt, userPrompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || '{}'
}

async function compareDescriptions(alert, found) {
  const system = `You are a child safety matching assistant.
Compare two child descriptions and return ONLY a valid JSON object — no other text, no markdown.
JSON format: {"match":"high"|"medium"|"low"|"no","confidence":0-100,"reason":"one clear sentence"}`

  const user = `MISSING CHILD ALERT:
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

Are these likely the same child?`

  try {
    const raw = await callGroq(system, user)
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { match: 'no', confidence: 0, reason: 'Could not parse response' }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { found } = req.body
  if (!found?.description || !found?.location) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Fetch all active missing child alerts
  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('id, name, age, gender, description, last_seen, contact, created_by, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: 'Failed to fetch alerts' })
  if (!alerts?.length) return res.status(200).json({ matches: [] })

  // Compare found child against each active alert using Groq
  const results = await Promise.all(
    alerts.map(async (alert) => {
      const result = await compareDescriptions(alert, found)
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

  // Return only actual matches, sorted by confidence
  const matches = results
    .filter((r) => r.level !== 'no' && r.confidence >= 40)
    .sort((a, b) => b.confidence - a.confidence)

  return res.status(200).json({ matches })
}
