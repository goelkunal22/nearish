# Nearish — Deployment Guide
## You'll be live in about 30 minutes. Follow every step exactly.

---

## Step 1 — Set up Supabase (your database)

1. Go to **supabase.com** and create a free account(hemtuC-1buvhi-piqxex)
2. Click "New project" — give it a name like "nearish"
3. Choose a region close to you, set a database password (save it)
4. Wait ~2 minutes for it to spin up
5. Go to **SQL Editor** (left sidebar)
6. Paste the entire contents of `supabase-schema.sql` into the editor
7. Click **Run** — you should see "Success"
8. Go to **Project Settings → API**
9. Copy your **Project URL** and **anon public key** — you'll need these next. (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXZtanVwb2RtZXJqbnRqdWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDY1NTYsImV4cCI6MjA4OTI4MjU1Nn0.bXQN6Ymmw1Z5e9KsR5KqS6sdY-1wWCZGxUzIFx5ynf0)
sb_publishable_Tcj9AMFnLxxyLMCp8U3Ciw_t8YS6SpC
https://dfivmjupodmerjntjubw.supabase.co
---cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=sb_publishable_Tcj9AMFnLxxyLMCp8U3Ciw_t8YS6SpC
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXZtanVwb2RtZXJqbnRqdWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDY1NTYsImV4cCI6MjA4OTI4MjU1Nn0.bXQN6Ymmw1Z5e9KsR5KqS6sdY-1wWCZGxUzIFx5ynf0
EOF

## Step 2 — Set up your local environment

1. Install **Node.js** from nodejs.org if you don't have it
2. Open a terminal (Mac: CMD+Space, type Terminal)
3. Navigate to this folder:
   ```
   cd path/to/nearish
   ```
4. Create your environment file:
   ```
   cp .env.local.example .env.local
   ```
5. Open `.env.local` and replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. Install dependencies:
   ```
   npm install
   ```
7. Run it locally:
   ```
   npm run dev
   ```
8. Open **http://localhost:3000** — you should see the Nearish landing page

---

## Step 3 — Deploy to Vercel (make it live on the internet)

1. Push your code to GitHub:
   - Go to github.com, create a new repo called "nearish"
   - Follow GitHub's instructions to push your local code
2. Go to **vercel.com**, sign up with GitHub
3. Click "Add New Project" → import your nearish repo
4. Before deploying, add your environment variables:
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy**
6. Wait ~2 minutes — Vercel gives you a live URL like `nearish.vercel.app`

---

## Step 4 — Configure Supabase auth redirect

1. Go back to Supabase → **Authentication → URL Configuration**
2. Add your Vercel URL to "Site URL":
   ```
   https://nearish.vercel.app
   ```
3. Add to "Redirect URLs":
   ```
   https://nearish.vercel.app/auth/callback
   ```
4. Save

---

## You're live. Here's what works right now:

- ✅ Beautiful landing page
- ✅ Sign up / sign in via magic link (no passwords)
- ✅ Create a named friend circle
- ✅ Share invite code with friends
- ✅ Friends join with the code
- ✅ Post micro-moments to your circle
- ✅ See what your friends are up to in real time
- ✅ Send nudges to friends

---

## Something broken? Paste the exact error message to Claude.

The most common issues:
- **"Invalid API key"** → double check your .env.local values, no spaces
- **White screen** → run `npm run dev` and look at the terminal for the error
- **Auth not working** → make sure the redirect URL is added in Supabase

---

## What we build next (once this is live):

- Push notifications when friends post
- Weekly ritual question for the whole circle
- Ambient status ("just got home", "at the gym")
- Multiple circles per user
- Mobile-optimized PWA (installable on phone)
