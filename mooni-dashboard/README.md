# MOONI dashboard

Next.js App Router demo. Run `npm ci && npm run dev` in this directory. Configure `GOOGLE_MAPS_API_KEY` in `.env.local` to enable real distance/time calculations with Google Routes API (Routes API enabled and billing configured). The fare is `30 + km * 8 + min * 2` MXN.

Trip records and state changes persist in the current browser's localStorage; they do not synchronize across users or devices. When no key is configured, the trip form uses a clearly labeled 5 km / 10 minute sample so the demo can be exercised. The map and flow monitor are explicitly illustrative. The admin panel is currently public and therefore must not display secrets or customer data in production. The WhatsApp screen explains that a real Meta integration is pending; no QR pairing is available. No Supabase or Airtable project was available in the connected account during implementation, so production database integration remains pending. Configure authentication and a private database before collecting real passenger details.

Deploy the `mooni-dashboard` directory as the Vercel root directory. Never place secret keys under `NEXT_PUBLIC_`.

Demo flow: visitors enter name and phone, origin, destination and an offer. A fictitious driver, Ahmed Hassan, accepts offers at least 80% of the suggested fare or counters at 90%. Accepting assigns the driver and animates arrival and travel over approximately one minute. The passenger registry, agreed price, assigned driver and driver's trip history are saved in browser localStorage. The QR opens the public demo URL; it does not link WhatsApp or synchronize data across browsers. A shared authenticated database is needed to collect all QR visitors in one admin panel.

## Shared records

The Supabase project `kcbpwlhpdriframzgaqn` has the tables from `supabase/schema.sql` applied. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `MOONI_ADMIN_PASSWORD` in the Vercel project environment (and locally in `.env.local` for testing). Never put the service key or admin password in `NEXT_PUBLIC_` variables. Only the server routes use the service key; RLS and revoked grants block direct browser access. Without these settings the site stays in browser-local demo mode. The public QR always points to the current deployed origin; the site's domain must be live before visitors can scan it.

The shared admin table polls every eight seconds after entry of the admin password. Before gathering real passenger phone numbers in production, add authentication for the entire admin view, a privacy notice and durable abuse protection for public registration endpoints. The current public form is a demo.
