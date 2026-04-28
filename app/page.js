'use client';

import { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import TeacherCard from "./_components/TeacherCard";
import Stats from "./_components/Stats";
import Resources from "./_components/Resources";
import MyCommunities from "./_components/MyCommunities";
import { motion } from "framer-motion";

export default function Home() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/teachers');
        if (!res.ok) throw new Error('Failed to fetch teachers');
        const data = await res.json();
        setTeachers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Hero />
      <Stats />
      <MyCommunities />

      <section id="faculty" className="container px-4 md:px-6 py-12 md:py-24">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Our Faculty</h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, index) => (
              <TeacherCard key={teacher._id || index} teacher={teacher} index={index} />
            ))}
          </div>
        )}
      </section>

      <Resources />
    </main>
  );
}
