import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
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
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}