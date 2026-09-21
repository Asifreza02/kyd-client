'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, UsersRound, ArrowRight, Clock, MapPin, Sparkles, BookOpen, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Hero from "./_components/Hero";
import TeacherCard from "./_components/TeacherCard";
import Stats from "./_components/Stats";
import Resources from "./_components/Resources";
import MyCommunities from "./_components/MyCommunities";
import AiAssistant from "./_components/AiAssistant";
import { teachersData, eventsData } from "@/lib/data";

export default function Home() {
  const [teachers, setTeachers] = useState(teachersData);
  const [events, setEvents] = useState(eventsData);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch teachers from API
    fetch('/api/teachers')
      .then(res => res.ok ? res.json() : teachersData)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setTeachers(data);
      })
      .catch(() => setTeachers(teachersData));

    // Fetch events from API
    fetch('/api/events')
      .then(res => res.ok ? res.json() : eventsData)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data.filter(e => !e.status || e.status === 'approved'));
        }
      })
      .catch(() => setEvents(eventsData));

    // Fetch communities from API
    fetch('/api/communities')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCommunities(data.filter(c => !c.status || c.status === 'approved'));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Platform Stats */}
      <Stats />

      {/* 3. User's Joined Communities (if logged in) */}
      <MyCommunities />

      {/* 4. Featured Campus Events */}
      <section id="events" className="container px-4 md:px-6 py-12 md:py-20 mx-auto max-w-6xl">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
            <CalendarDays className="w-3.5 h-3.5" /> What's Happening
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">Featured Campus Events</h2>
          <div className="w-20 h-1 bg-primary rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event, index) => (
            <motion.div
              key={event._id || event.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="group h-full overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={event.image || `https://picsum.photos/seed/${index}/600/400`}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-primary text-white border-0 shadow-sm text-xs">
                    {event.category || 'Event'}
                  </Badge>
                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
                    {event.date}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                    {event.description}
                  </p>
                  <div className="space-y-1 text-xs text-zinc-500">
                    {event.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
                  <Link href="/events" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-primary font-medium hover:bg-primary/5">
                      View Event <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/events">
            <Button variant="outline" className="rounded-full px-6 gap-2">
              Explore All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. Student Communities Showcase */}
      {communities.length > 0 && (
        <section id="communities" className="container px-4 md:px-6 py-12 md:py-20 mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
              <UsersRound className="w-3.5 h-3.5" /> Student Life
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">Popular Communities</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-primary rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.slice(0, 3).map((community, index) => (
              <motion.div
                key={community._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="group h-full overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={community.image || `https://picsum.photos/seed/comm${index}/600/400`}
                      alt={community.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-purple-600 text-white border-0 shadow-sm text-xs">
                      {community.category || 'Club'}
                    </Badge>
                    <span className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
                      <UsersRound className="w-3 h-3" /> {community.memberCount || 50}+ Members
                    </span>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {community.name}
                    </CardTitle>
                    <p className="text-xs text-zinc-400">Lead: {community.lead || 'Student Lead'}</p>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {community.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
                    <Link href="/communities" className="w-full">
                      <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20">
                        Join Community <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/communities">
              <Button variant="outline" className="rounded-full px-6 gap-2">
                View All Communities <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* 6. Faculty Directory */}
      <section id="faculty" className="container px-4 md:px-6 py-12 md:py-24 mx-auto max-w-6xl">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Department Leadership
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">Our Faculty</h2>
          <div className="w-20 h-1 bg-primary rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher, index) => (
            <TeacherCard key={teacher._id || teacher.id || index} teacher={teacher} index={index} />
          ))}
        </div>
      </section>

      {/* 7. Study Resources (Notes & PYQs) */}
      <Resources />

      {/* 8. Floating Gemini AI Assistant */}
      <AiAssistant />
    </main>
  );
}
