# MOONI dashboard

Next.js App Router demo. Run `npm ci && npm run dev` in this directory. Configure `GOOGLE_MAPS_API_KEY` in `.env.local` to enable real distance/time calculations with Google Routes API (Routes API enabled and billing configured). The fare is `30 + km * 8 + min * 2` MXN.

Trip records and state changes persist in the current browser's localStorage; they do not synchronize across users or devices. When no key is configured, the trip form uses a clearly labeled 5 km / 10 minute sample so the demo can be exercised. The map and flow monitor are explicitly illustrative. The admin panel is currently public and therefore must not display secrets or customer data in production. The WhatsApp screen explains that a real Meta integration is pending; no QR pairing is available. No Supabase or Airtable project was available in the connected account during implementation, so production database integration remains pending. Configure authentication and a private database before collecting real passenger details.

Deploy the `mooni-dashboard` directory as the Vercel root directory. Never place secret keys under `NEXT_PUBLIC_`.
