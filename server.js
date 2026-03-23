# Sasa Pay — Backend Server
USSD + M-Pesa STK Push loan collection system for Kenya.

## Tech Stack
- Node.js + Express
- SQLite (better-sqlite3) — swap for PostgreSQL in production
- Safaricom Daraja API (M-Pesa STK Push)
- Africa's Talking (USSD gateway)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and fill in your credentials (see below).

### 3. Run the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `MPESA_CONSUMER_KEY` | From Safaricom Daraja app |
| `MPESA_CONSUMER_SECRET` | From Safaricom Daraja app |
| `MPESA_PASSKEY` | Lipa Na M-Pesa passkey from Daraja |
| `MPESA_PAYBILL` | Your Paybill number (use 174379 for sandbox) |
| `MPESA_SHORTCODE` | Same as Paybill (use 174379 for sandbox) |
| `MPESA_CALLBACK_URL` | Public HTTPS URL — e.g. https://yourdomain.com/mpesa/callback |
| `ADMIN_SECRET` | Secret header for admin API calls |

---

## API Endpoints

### USSD (Africa's Talking webhook)
```
POST /ussd
```
Africa's Talking will POST here when a client dials your code.
Configure this URL in your Africa's Talking dashboard.

### M-Pesa Callbacks
```
POST /mpesa/callback    — payment confirmed/failed
POST /mpesa/timeout     — payment timed out
```
Set these as your Daraja callback URLs.

### Admin API
All admin routes require the header: `x-admin-secret: YOUR_ADMIN_SECRET`

```
POST   /admin/clients                    — register a new client
GET    /admin/clients                    — list all clients (query: ?status=active&search=john)
GET    /admin/clients/:id               — get client + payment history
PATCH  /admin/clients/:id               — update client details
POST   /admin/clients/:id/manual-payment — record a cash/manual payment
GET    /admin/payments                   — list recent 100 payments
```

### Register a client (example)
```bash
curl -X POST http://localhost:3000/admin/clients \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your_secret" \
  -d '{
    "id_number": "12345678",
    "full_name": "John Kamau",
    "phone": "0712345678",
    "loan_type": "personal",
    "loan_amount": 10000
  }'
```

---

## USSD Flow (what clients experience)

```
Client dials *XXX#
  → Enter ID number
  → See loan balance
  → Choose: Pay / View Statement
  → Enter amount
  → Confirm
  → M-Pesa PIN prompt sent automatically
  → Client enters PIN
  → Payment confirmed, balance updated
```

---

## Testing Locally (ngrok)

Safaricom's callback URL must be publicly accessible HTTPS.
For local testing, use ngrok:

```bash
npx ngrok http 3000
```

Copy the https URL and update MPESA_CALLBACK_URL in your .env.

---

## Going Live Checklist

- [ ] Register on Safaricom Daraja (developer.safaricom.co.ke)
- [ ] Apply for Paybill number + Lipa Na M-Pesa passkey
- [ ] Register on Africa's Talking (africastalking.com)
- [ ] Apply for USSD shortcode
- [ ] Deploy server to Render / Railway / DigitalOcean
- [ ] Set MPESA_ENV=production in .env
- [ ] Update callback URLs to production domain
- [ ] Set a strong ADMIN_SECRET
- [ ] Switch from SQLite to PostgreSQL for production scale

---

## Folder Structure

```
sasapay/
├── server.js           — Express app entry point
├── .env.example        — Environment variable template
├── package.json
├── config/
│   └── db.js           — SQLite database setup
├── routes/
│   ├── ussd.js         — USSD session handler
│   ├── mpesa.js        — M-Pesa callback handler
│   └── admin.js        — Admin API (register clients, view payments)
└── utils/
    └── mpesa.js        — Daraja API (token + STK push)
```
