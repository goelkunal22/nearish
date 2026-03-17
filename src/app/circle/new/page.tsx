'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function NewCirclePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const inviteCode = generateCode()

    const { data: circle, error: circleError } = await supabase
      .from('circles')
      .insert({ name: name.trim(), created_by: user.id, invite_code: inviteCode })
      .select()
      .single()

    if (circleError) {
      setError(circleError.message)
      setLoading(false)
      return
    }

    await supabase.from('circle_members').insert({ circle_id: circle.id, user_id: user.id })
    router.push(`/circle/invite?code=${inviteCode}&name=${encodeURIComponent(name)}`)
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-glow/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 animate-fade-up relative">
        <div>
          <Link href="/home" className="text-text-muted text-sm hover:text-text-secondary transition-colors">
            ← back
          </Link>
          <h1 className="font-serif text-4xl italic text-text-primary mt-6 mb-2">Name your circle</h1>
          <p className="text-text-secondary text-sm">This is what your friends will see when they join.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="The usual suspects"
            maxLength={40}
            className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber-muted transition-colors text-sm"
            required
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3.5 bg-amber-glow text-bg-base font-medium text-sm rounded-xl hover:bg-amber-soft transition-colors glow-amber disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create circle'}
          </button>
        </form>

        <p className="text-text-muted text-sm text-center">
          Have an invite code?{' '}
          <Link href="/circle/join" className="text-amber-glow hover:text-amber-soft transition-colors">
            Join a circle
          </Link>
        </p>
      </div>
    </main>
  )
}
