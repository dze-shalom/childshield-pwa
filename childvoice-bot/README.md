# ChildVoice WhatsApp Bot

The WhatsApp entry point for ChildShield Cameroon. Anyone can report a missing child or suspicious activity by messaging the bot — no app download, no account needed.

## Powered By (All Free)

| Service | Purpose | Cost |
|---------|---------|------|
| **Groq API** | AI language understanding (LLaMA 3.1) | Free tier |
| **Twilio WhatsApp** | Receive and send WhatsApp messages | Free sandbox for testing |
| **Supabase** | Store reports in the same database as the PWA | Free tier |
| **Railway / Render** | Host the bot server | Free tier |

## Setup

### 1. Get your Groq API key (free)
- Go to https://console.groq.com
- Create an account
- Generate an API key
- No credit card required

### 2. Set up Twilio WhatsApp Sandbox
- Go to https://console.twilio.com
- Navigate to Messaging > Try it Out > Send a WhatsApp Message
- Follow the sandbox activation steps
- Set webhook URL to: `https://your-deployed-bot.railway.app/webhook`

### 3. Deploy the bot
```bash
cd childvoice-bot
cp .env.example .env
# Fill in your API keys in .env
npm install
npm start
```

For production deployment on Railway (free):
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### 4. Test it
Send a WhatsApp message to your Twilio sandbox number:
- Send `hello` to see the menu
- Send `1` to start a missing child report
- Send `2` to report suspicious activity
- Send `3` for emergency numbers

## How It Works

```
User WhatsApp message
        ↓
  Twilio Webhook (POST /webhook)
        ↓
  Session state check (in-memory)
        ↓
  If clear flow: scripted guided response
        ↓
  If ambiguous: Groq LLaMA 3.1 interprets
        ↓
  Structured data extracted and saved to Supabase
        ↓
  Alert appears live on ChildShield dashboard
        ↓
  WhatsApp reply sent back to user
```

## Conversation Flows

**Missing Child:** Greeting → Name → Age → Description → Last Seen → Contact → Confirm → Alert Sent

**Suspicious Activity:** Description → Location → Saved Anonymously

**Emergency Help:** Immediately returns all emergency numbers (17, 16, 18, MINAS hotline)

**Safe Zones:** Returns nearest police, hospital, and NGO contacts

## Why Groq over Claude?

- Groq is completely free with generous rate limits
- LLaMA 3.1-8b-instant is extremely fast (tokens in milliseconds)
- Handles English and French natively
- No credit card required to get started
- Perfect for a community platform serving Cameroon
