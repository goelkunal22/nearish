'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

function JoinContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [code, setCode] = useState(params.get('code') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data: circle } = await supabase
      .from('circles')
      .select('*')
      .eq('invite_code', code.trim().toUpperCase())
      .single()

    if (!circle) {
      setError('Code not found. Double-check and try again.')
      setLoading(false)
      return
    }

    const { error: joinError } = await supabase
      .from('circle_members')
      .insert({ circle_id: circle.id, user_id: user.id })

    if (joinError && !joinError.message.includes('duplicate')) {
      setError('Could not join. You might already be a member.')
      setLoading(false)
      return
    }

    router.push('/home')
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-glow/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 animate-fade-up relative">
        <div>
          <Link href="/home" className="text-text-muted text-sm hover:text-text-secondary transition-colors">
            ← back
          </Link>
          <h1 className="font-serif text-4xl italic text-text-primary mt-6 mb-2">Join a circle</h1>
          <p className="text-text-secondary text-sm">Enter the invite code your friend shared with you.</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={8}
            className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber-muted transition-colors font-serif text-2xl tracking-widest text-center uppercase"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || code.length < 4}
            className="w-full py-3.5 bg-amber-glow text-bg-base font-medium text-sm rounded-xl hover:bg-amber-soft transition-colors glow-amber disabled:opacity-50"
          >
            {loading ? 'Joining…' : 'Join circle'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  )
}
