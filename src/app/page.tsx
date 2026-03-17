'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const floatingNames = ['Maya just left the gym', 'Tom is reading in a cafe', 'Sarah made sourdough again', 'Jake is thinking of you', 'Priya just got home']

export default function HomePage() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => (v + 1) % floatingNames.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-glow/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-amber-soft/5 blur-[80px] pointer-events-none" />

      {/* Logo */}
      <div className="mb-16 animate-fade-up">
        <span className="font-serif text-3xl text-text-primary tracking-tight">nearish</span>
        <span className="ml-2 text-amber-glow text-lg">·</span>
      </div>

      {/* Hero */}
      <div className="max-w-lg text-center space-y-6 animate-fade-up stagger-1">
        <h1 className="font-serif text-5xl md:text-6xl text-text-primary leading-[1.1] italic">
          Stay close to the people who matter
        </h1>
        <p className="text-text-secondary text-lg font-light leading-relaxed">
          A private space for your 5–10 real friends. No likes. No followers. Just the warmth of knowing what your people are up to.
        </p>
      </div>

      {/* Floating moment preview */}
      <div className="my-12 animate-fade-up stagger-2">
        <div className="relative h-10 overflow-hidden w-72">
          {floatingNames.map((name, i) => (
            <div
              key={name}
              className="absolute inset-0 flex items-center justify-center transition-all duration-700"
              style={{
                opacity: visible === i ? 1 : 0,
                transform: `translateY(${visible === i ? 0 : visible > i ? -20 : 20}px)`,
              }}
            >
              <span className="text-sm text-text-muted bg-bg-card border border-bg-border px-4 py-2 rounded-full">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-3">
        <Link
          href="/auth/signup"
          className="px-8 py-3.5 bg-amber-glow text-bg-base font-medium text-sm rounded-full hover:bg-amber-soft transition-colors glow-amber"
        >
          Start your circle
        </Link>
        <Link
          href="/auth/login"
          className="px-8 py-3.5 border border-bg-border text-text-secondary text-sm rounded-full hover:border-amber-muted hover:text-text-primary transition-colors"
        >
          Sign in
        </Link>
      </div>

      {/* Social proof nudge */}
      <p className="mt-10 text-text-faint text-xs animate-fade-up stagger-4">
        Free while in beta · No algorithm · No ads · Ever
      </p>

      {/* Bottom section — what makes it different */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 opacity-40">
          {[
            { icon: '◉', label: 'Micro-moments' },
            { icon: '◎', label: 'Gentle nudges' },
            { icon: '●', label: 'Weekly rituals' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-amber-glow text-xs mb-1">{item.icon}</div>
              <div className="text-text-muted text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
