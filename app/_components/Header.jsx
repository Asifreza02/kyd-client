import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Home, Users , ListFilterPlus} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-50 border-b text-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 md:px-4">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-1 sm:mr-2 md:mr-6 flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-cyan-800" />
          <span className="font-bold hidden sm:inline-block text-2xl">
            KnowYourDepartment
          </span>
        </Link>
        <nav className="flex flex-1 items-center md:space-x-4 justify-between">
          <div className='flex item-center justify-center md:gap-2'>
          <Link href="/">
            <Button variant="ghost" className="text-md font-medium">
              <Home className="mr-1 sm:mr-2 h-4 w-4" /><span className='hidden md:inline'>Home</span>
            </Button>
          </Link>
          <Link href="/teachers">
            <Button variant="ghost" className="text-md font-medium">
              <Users className="mr-1 sm:mr-2 h-4 w-4" /> <span className='hidden md:inline'>Teachers</span>
            </Button>
          </Link>
          <Link href="/notes">
            <Button variant="ghost" className="text-md font-medium">
              <BookOpen className="mr-1 sm:mr-2 h-4 w-4" /> <span className='hidden md:inline'>Notes</span>
            </Button>
          </Link>
          <Link href="/pyqs">
            <Button variant="ghost" className="text-md font-large">
              <FileText className="mr-1 sm:mr-2 h-4 w-4 " /> <span className='hidden md:inline'>PYQs</span>
            </Button>
          </Link>
          </div>
          <div className='flex item-center justify-center gap-2 md:gap-4'>
          <Link href="/ai">
            <Button variant="ghost" className="text-md font-large">
              <ListFilterPlus className="mr-1 sm:mr-2 h-4 w-4 " /> <span className='hidden md:inline'>Asked AI</span>
            </Button>
          </Link>
          <div>
             {isAuthenticated ? (
            <div>
              <Button variant="ghost" className="md:text-md md:font-large bg-cyan-700 text-white hover:bg-cyan-800" onClick={() => signOut()}>
                LOGOUT
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="md:text-md md:font-large bg-cyan-700 text-white hover:bg-cyan-800">
                LOGIN
              </Button>
            </Link>
          )}
          </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

