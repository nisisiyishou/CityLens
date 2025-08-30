import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grand Key Club',
  description: 'Golf club management app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libertinus+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body className='libertinus-serif-display-regular'>
        {/* Background image with overlay for transparency */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/Sydney Harbour Bridge.jpg")',
            zIndex: -2
          }}
        ></div>
        {/* Semi-transparent overlay to reduce image clarity */}
        <div className="fixed inset-0 bg-white bg-opacity-70 z-[-1]"></div>

        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}