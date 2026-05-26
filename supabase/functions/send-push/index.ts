// Supabase Edge Function — send-push
// Triggered by a Supabase Database Webhook on alerts INSERT.
// Sends a Web Push notification to every subscribed user.
//
// Deploy:  supabase functions deploy send-push
// Secrets: supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:you@example.com

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
)

Deno.serve(async (req) => {
  try {
    const body = await req.json()
    // Supabase database webhooks send { type, table, record, ... }
    const alert = body.record

    if (!alert) return new Response('No record', { status: 400 })

    const payload = JSON.stringify({
      title: '🚨 Missing Child Alert',
      body: `${alert.name} · ${alert.age} yrs · Last seen: ${alert.last_seen}`,
      tag: alert.id,
      url: `/alert/${alert.id}`,
    })

    // Fetch all push subscriptions
    const { data: subs, error } = await supabase.from('push_subscriptions').select('endpoint, p256dh, auth')
    if (error) throw error

    const results = await Promise.allSettled(
      (subs ?? []).map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        )
      )
    )

    const failed = results.filter((r) => r.status === 'rejected')
    return new Response(JSON.stringify({ sent: results.length, failed: failed.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
})
