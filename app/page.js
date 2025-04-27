'use client'

import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import Hero from "./_components/Hero";


export default function Home() {
  return (
    <div className="mx-10">
      <Header/>
      <Hero/>
      <Footer/>
    </div>
  );
}
