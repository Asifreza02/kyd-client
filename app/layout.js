import { GeistSans } from 'geist/font/sans'; // Keep Geist Sans
import './globals.css';
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { cn } from '@/lib/utils';


export const metadata = {
  title: 'DeptInfoHub - Know Your Department',
  description: 'Information hub for department teachers, class notes, and previous year questions.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="h-full">
       {/* Apply Geist Sans font variable */}
       <body className={cn("relative h-full font-sans antialiased", GeistSans.variable)}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        
      </body>
    </html>
  );
}
