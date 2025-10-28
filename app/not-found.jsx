'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center text-center min-h-[calc(100vh-theme(spacing.14)-theme(spacing.16))]">
      <SearchX className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold tracking-tight mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Oops! The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <span>Go back to Home</span>
      </Link>
    </div>
  )
}