'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Suspense } from 'react'

function InviteContent() {
  const params = useSearchParams()
  const code = params.get('code') || ''
  const name = params.get('name') || 'Your circle'
  const [copied, setCopied] = useState(false)

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/circle/join?code=${code}`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-glow/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 animate-fade-up relative text-center">
        <div className="w-20 h-20 rounded-full bg-amber-faint border border-amber-muted flex items-center justify-center mx-auto">
          <span className="text-3xl">◎</span>
        </div>

        <div>
          <h1 className="font-serif text-4xl italic text-text-primary mb-2">
            {name} is ready
          </h1>
          <p className="text-text-secondary text-sm">Share this code with your people. Only they can join.</p>
        </div>

        {/* Invite code display */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-6 space-y-4">
          <p className="text-text-muted text-xs uppercase tracking-widest">Invite code</p>
          <p className="font-serif text-5xl italic text-amber-glow tracking-widest">{code}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full py-3.5 bg-amber-glow text-bg-base font-medium text-sm rounded-xl hover:bg-amber-soft transition-colors glow-amber"
          >
            {copied ? '✓ Copied link' : 'Copy invite link'}
          </button>
          <Link
            href="/home"
            className="block w-full py-3.5 border border-bg-border text-text-secondary text-sm rounded-xl hover:border-amber-muted transition-colors"
          >
            Go to my circle
          </Link>
        </div>

        <p className="text-text-muted text-xs">
          Friends can also join at nearish.app/join using code <strong className="text-text-primary">{code}</strong>
        </p>
      </div>
    </main>
  )
}

export default function InvitePage() {
  return (
    <Suspense>
      <InviteContent />
    </Suspense>
  )
}
