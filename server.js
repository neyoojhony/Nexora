import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import morgan from 'morgan'

dotenv.config()

const app = express()

// --- Config ---
const PORT = process.env.PORT || 5000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.MODEL || 'gemini-1.5-flash'
const DAILY_QUOTA = Number(process.env.DAILY_QUOTA || 1500)

if (!GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY in environment.')
  process.exit(1)
}

// --- Middlewares ---
app.use(morgan('tiny'))
app.use(express.json())

// CORS
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGIN === '*' || origin === ALLOWED_ORIGIN) return cb(null, true)
      return cb(new Error('Not allowed by CORS'), false)
    },
    credentials: false,
  })
)

// --- Simple in-memory daily quota (resets on restart) ---
let today = new Date().toDateString()
let used = 0

function checkReset() {
  const now = new Date().toDateString()
  if (now !== today) {
    today = now
    used = 0
  }
}

// --- Health ---
app.get('/health', (req, res) => {
  checkReset()
  res.json({ ok: true, date: today, used, quota: DAILY_QUOTA, model: MODEL })
})

// --- Chat endpoint ---
app.post('/chat', async (req, res) => {
  try {
    checkReset()

    if (used >= DAILY_QUOTA) {
      return res.status(429).json({ error: 'Daily limit reached', used, quota: DAILY_QUOTA })
    }

    const { message, history } = req.body || {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing `message` string in body' })
    }

    // Build contents per Gemini REST format
    const contents = []
    if (Array.isArray(history)) {
      for (const turn of history) {
        if (turn.role && turn.text) {
          contents.push({ role: turn.role === 'user' ? 'user' : 'model', parts: [{ text: turn.text }] })
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] })

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`
    const payload = { contents }

    const resp = await axios.post(url, payload, { timeout: 30000 })
    used += 1

    const candidates = resp.data?.candidates || []
    const text = candidates[0]?.content?.parts?.[0]?.text || ''

    res.json({ reply: text, usage: { used, quota: DAILY_QUOTA }, model: MODEL })
  } catch (err) {
    const data = err.response?.data
    console.error('Gemini error:', data || err.message)
    const status = err.response?.status || 500
    res.status(status).json({ error: 'Gemini API failed', details: data || err.message })
  }
})

// --- Start ---
app.listen(PORT, () => {
  console.log(`✅ Nexora backend running on http://localhost:${PORT}`)
  console.log(`   Allowed origin: ${ALLOWED_ORIGIN}`)
})
