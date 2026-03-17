'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function CallbackPage() {
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/home'
      }
    })

    // Also check if already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/home'
      }
    })
  }, [])

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-4 animate-fade-up">
        <div className="w-10 h-10 rounded-full border-2 border-amber-glow border-t-transparent animate-spin mx-auto" />
        <p className="text-text-secondary text-sm">Signing you in…</p>
      </div>
    </main>
  )
}
