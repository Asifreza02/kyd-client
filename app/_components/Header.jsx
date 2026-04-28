'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Home, Users, Sparkles, CalendarDays, UsersRound, ShieldCheck, User } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'

export function Header() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4"
    >
      <div className="flex h-16 items-center justify-between rounded-full border border-white/20 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg px-6">
        {/* Logo + Title */}
        <Link
          href="/"
          className="flex items-center space-x-2"
        >
          <div className="bg-primary/10 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold hidden sm:inline-block text-lg bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
            KYD
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50 dark:hover:bg-white/10">
              <Home className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Home</span>
            </Button>
          </Link>

          <Link href="/teachers">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50 dark:hover:bg-white/10">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Teachers</span>
            </Button>
          </Link>

          <Link href="/events">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50 dark:hover:bg-white/10 text-primary font-medium">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Events</span>
            </Button>
          </Link>

          <Link href="/communities">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50 dark:hover:bg-white/10 text-primary font-medium">
              <UsersRound className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Communities</span>
            </Button>
          </Link>



          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>

          {session?.user?.role === 'admin' && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50 dark:hover:bg-white/10 text-rose-500 font-medium mr-1">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Admin</span>
              </Button>
            </Link>
          )}

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
              <Button
                onClick={() => signOut({ callbackUrl: '/login' })}
                variant="ghost"
                size="sm"
                className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 ml-1"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
