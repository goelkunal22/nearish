import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nearish — Stay close to your people',
  description: 'The private space for your closest friends. No likes. No feeds. Just the people who matter.',
  openGraph: {
    title: 'Nearish',
    description: 'Stay close to your people',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grain">
        <div className="min-h-dvh flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
