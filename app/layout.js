import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Footer } from './_components/Footer'
import { Header } from './_components/Header'
import { cn } from '@/lib/utils'
import { NextAuthProvider } from './providers/SessionProvider'

export const metadata = {
  title: 'DeptInfoHub - Know Your Department',
  description:
    'Information hub for department teachers, class notes, and previous year questions.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={cn('relative h-full font-sans antialiased', GeistSans.variable)}>
        <NextAuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
