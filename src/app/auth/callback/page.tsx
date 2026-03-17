'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function CallbackPage() {
  useEffect(() => {
    const supabase = createClient()

    async function handleCallback() {
      // Get hash params (magic link puts tokens in hash)
      const hash = window.location.hash
      const params = new URLSearchParams(hash.replace('#', '?').replace('#', ''))

      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (!error) {
          window.location.href = '/home'
          return
        }
      }

      // Also check query params (token_hash flow)
      const urlParams = new URLSearchParams(window.location.search)
      const token_hash = urlParams.get('token_hash')
      const type = urlParams.get('type')

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
        if (!error) {
          window.location.href = '/home'
          return
        }
      }

      // Check if already signed in
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.location.href = '/home'
        return
      }

      // Nothing worked — go back to login
      window.location.href = '/auth/login?error=auth_failed'
    }

    handleCallback()
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
