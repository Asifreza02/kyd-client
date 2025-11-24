import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/Providers";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import Preloader from "./_components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Know Your Department",
  description: "Information about teachers, notes, and PYQs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Preloader />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
