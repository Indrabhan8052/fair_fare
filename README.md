# Fair Fare — MERN

A MERN (MongoDB, Express, React, Node) rewrite of the original Fair Fare vanilla-JS app.
Auth is plain email/password + JWT (no Firebase, no SMS OTP, no Google sign-in — see the
migration plan doc for why and how to add those back later).

## Structure
- `server/` — Express API + MongoDB models
- `client/` — React (Vite) frontend

## Quick start

### 1. MongoDB
Have a MongoDB instance running (local `mongod`, or a free MongoDB Atlas cluster) and its
connection string handy.

### 2. Server
```bash
cd server
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm install
npm run seed              # loads sample city data (Lucknow) into MongoDB
npm run dev                # starts API on http://localhost:5000
```

### 3. Client
```bash
cd client
npm install
npm run dev                # starts React app on http://localhost:5173
```

The client is configured (see `client/src/api/axios.js`) to call the API at
`http://localhost:5000/api` — change `VITE_API_URL` in a `client/.env` if your API runs
elsewhere.

## What's implemented
- JWT signup/login/logout, protected routes
- City + transit data served from MongoDB (`/api/cities`) instead of baked into the bundle
- Route/fare engine (metro, bus, combo, taxi-estimate) ported from the original `script.js`
  into `server/src/services/routeEngine.js` + `fareEngine.js`
- Leaflet map + place search (OpenStreetMap Nominatim, proxied through the server)
- Recent-search history tied to the logged-in user (MongoDB, not localStorage)
- Basic account page (avatar, preferences)

## What's intentionally not implemented (see migration plan)
- SMS OTP (would need Twilio)
- Google sign-in (would need a Google OAuth client)
- The in-app "configure Firebase/EmailJS keys" admin screen — replaced by `server/.env`
- Only one sample city (Lucknow) is seeded; add more cities by extending `server/seed/cityData.js`
  with the same station/line data that was in the original `METRO`/`PLACES` constants
