# Nexora Backend (Gemini API Proxy)

Secure Node.js/Express proxy for Google **Gemini** API.
- Hides API key from frontend
- CORS protection (set `ALLOWED_ORIGIN`)
- Simple daily quota counter (default 1500/day)
- Ready for local dev and free hosting

## Quick Start

1) Copy env file
```bash
cp .env.example .env
# edit .env and paste your real GEMINI_API_KEY
```

2) Install & run (Node 18+)
```bash
npm install
npm run dev   # auto-restart with nodemon
# or: npm start
```

3) Test
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from Nexora"}'
```

## Environment Variables

```
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173
DAILY_QUOTA=1500
MODEL=gemini-1.5-flash
```

- Set `ALLOWED_ORIGIN` to your React app URL (Vercel URL).
- Change `MODEL` to `gemini-1.5-pro` if you prefer.

## Frontend Usage (React)

```js
async function askNexora(text){
  const res = await fetch('https://YOUR-BACKEND-URL/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ message: text })
  })
  const data = await res.json()
  return data.reply
}
```

## Deploy (Render or Vercel)

### Render (easy, free)
- New Web Service → Connect repo → Build Command: `npm install` → Start Command: `npm start`
- Add Environment:
  - `GEMINI_API_KEY`
  - `ALLOWED_ORIGIN` = your frontend origin (e.g., `https://nexora-eight-pearl.vercel.app`)
  - `DAILY_QUOTA` (optional)

### Vercel (as server)
- Create a **Server** project (Node.js). Or use `vercel.json` with `functions`.
- Set env vars in Project Settings → Environment Variables.
- Ensure region supports Node runtimes.

## Notes
- Quota counter is in-memory and resets when the server restarts (good enough for free tiers). For persistent quota, use Redis/DB.
- This backend is **stateless** and safe to expose.
