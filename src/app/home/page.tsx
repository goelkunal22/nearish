'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Moment, Circle, Profile } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function HomePage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [circle, setCircle] = useState<Circle | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [newMoment, setNewMoment] = useState('')
  const [posting, setPosting] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile(profileData)

    // Load first circle user belongs to
    const { data: memberData } = await supabase
      .from('circle_members')
      .select('circle_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (memberData) {
      const { data: circleData } = await supabase
        .from('circles')
        .select('*')
        .eq('id', memberData.circle_id)
        .single()
      setCircle(circleData)

      // Load moments with profiles
      const { data: momentsData } = await supabase
        .from('moments')
        .select('*, profile:profiles(*)')
        .eq('circle_id', memberData.circle_id)
        .order('created_at', { ascending: false })
        .limit(20)
      setMoments(momentsData || [])
    }

    setLoading(false)
  }

  async function postMoment(e: React.FormEvent) {
    e.preventDefault()
    if (!newMoment.trim() || !circle) return
    setPosting(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('moments')
      .insert({ circle_id: circle.id, user_id: user!.id, content: newMoment.trim() })
      .select('*, profile:profiles(*)')
      .single()

    if (data) {
      setMoments(prev => [data, ...prev])
      setNewMoment('')
    }
    setPosting(false)
  }

  async function sendNudge(toUserId: string) {
    if (!circle) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('nudges').insert({
      from_user: user!.id,
      to_user: toUserId,
      circle_id: circle.id,
    })
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-amber-glow border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!circle) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center space-y-6 animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-amber-faint border border-amber-muted flex items-center justify-center mx-auto">
            <span className="text-3xl">◎</span>
          </div>
          <h2 className="font-serif text-3xl italic text-text-primary">No circle yet</h2>
          <p className="text-text-secondary">Create one and invite your closest friends.</p>
          <div className="flex flex-col gap-3">
            <Link href="/circle/new" className="px-6 py-3 bg-amber-glow text-bg-base text-sm font-medium rounded-xl hover:bg-amber-soft transition-colors glow-amber">
              Create a circle
            </Link>
            <Link href="/circle/join" className="px-6 py-3 border border-bg-border text-text-secondary text-sm rounded-xl hover:border-amber-muted transition-colors">
              Join with invite code
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh max-w-lg mx-auto px-4 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-base/90 backdrop-blur-sm pt-6 pb-4 border-b border-bg-border mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif text-xl italic text-text-primary">{circle.name}</span>
            <p className="text-text-muted text-xs mt-0.5">Your circle</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/circle/invite" className="text-amber-glow text-xs border border-amber-muted px-3 py-1.5 rounded-full hover:bg-amber-faint transition-colors">
              + Invite
            </Link>
            <button
              onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }}
              className="text-text-muted text-xs hover:text-text-secondary transition-colors"
            >
              ←
            </button>
          </div>
        </div>
      </header>

      {/* Post moment */}
      <form onSubmit={postMoment} className="mb-8 animate-fade-up">
        <div className="bg-bg-card border border-bg-border rounded-2xl p-4 space-y-3">
          <p className="text-text-muted text-xs uppercase tracking-widest">Share a moment</p>
          <textarea
            value={newMoment}
            onChange={e => setNewMoment(e.target.value)}
            placeholder="What are you doing right now?"
            rows={2}
            className="w-full bg-transparent text-text-primary placeholder:text-text-faint text-sm resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newMoment.trim() || posting}
              className="px-5 py-2 bg-amber-glow text-bg-base text-xs font-medium rounded-full hover:bg-amber-soft transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {posting ? '…' : 'Share'}
            </button>
          </div>
        </div>
      </form>

      {/* Feed */}
      <div className="space-y-4">
        {moments.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            <p className="text-3xl mb-3">◌</p>
            <p>No moments yet. Be the first.</p>
          </div>
        )}
        {moments.map((moment, i) => (
          <div
            key={moment.id}
            className="bg-bg-card border border-bg-border rounded-2xl p-4 space-y-3 animate-fade-up"
            style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-faint border border-amber-muted flex items-center justify-center shrink-0">
                  <span className="text-xs text-amber-glow font-medium">
                    {moment.profile?.name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">{moment.profile?.name || 'Someone'}</p>
                  <p className="text-text-muted text-xs">
                    {formatDistanceToNow(new Date(moment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {profile && moment.user_id !== profile.id && (
                <button
                  onClick={() => sendNudge(moment.user_id)}
                  className="text-text-muted hover:text-amber-glow transition-colors text-xs shrink-0"
                  title="Send a nudge"
                >
                  ♡
                </button>
              )}
            </div>
            <p className="text-text-secondary text-sm leading-relaxed pl-11">{moment.content}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
