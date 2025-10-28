import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Home, Users } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 mx-8 z-50 w-full border-b text-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-cyan-800" />
          <span className="font-bold sm:inline-block text-2xl">
            KnowYourDepartment
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" className="text-md font-medium">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
          <Link href="/teachers">
            <Button variant="ghost" className="text-md font-medium">
              <Users className="mr-2 h-4 w-4" /> Teachers
            </Button>
          </Link>
          <Link href="/notes">
            <Button variant="ghost" className="text-md font-medium">
              <BookOpen className="mr-2 h-4 w-4" /> Notes
            </Button>
          </Link>
          <Link href="/pyqs">
            <Button variant="ghost" className="text-md font-large">
              <FileText className="mr-2 h-4 w-4 " /> PYQs
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

