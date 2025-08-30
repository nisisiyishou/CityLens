import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
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