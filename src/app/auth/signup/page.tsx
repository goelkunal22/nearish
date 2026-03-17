'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center space-y-4 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-amber-faint border border-amber-muted flex items-center justify-center mx-auto mb-6">
            <span className="text-amber-glow text-2xl">✉</span>
          </div>
          <h2 className="font-serif text-3xl italic text-text-primary">Check your email</h2>
          <p className="text-text-secondary leading-relaxed">
            We sent a magic link to <strong className="text-text-primary">{email}</strong>. Click it to join Nearish — no password needed.
          </p>
          <p className="text-text-muted text-sm pt-4">Check your spam folder if it doesn't arrive in a minute.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-glow/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 animate-fade-up relative">
        <div>
          <Link href="/" className="text-text-muted text-sm hover:text-text-secondary transition-colors">
            ← nearish
          </Link>
          <h1 className="font-serif text-4xl italic text-text-primary mt-6 mb-2">Start your circle</h1>
          <p className="text-text-secondary text-sm">Invite your closest friends after you're in.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-text-muted text-xs uppercase tracking-widest block mb-2">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="What your friends call you"
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber-muted transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="text-text-muted text-xs uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber-muted transition-colors text-sm"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-glow text-bg-base font-medium text-sm rounded-xl hover:bg-amber-soft transition-colors glow-amber disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Sending magic link…' : 'Send magic link'}
          </button>
        </form>

        <p className="text-text-muted text-sm text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-glow hover:text-amber-soft transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
