'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Clock, Loader2, ArrowRight, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function EventsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const categories = ['All', 'Cultural', 'Departmental', 'Sports', 'Others'];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) throw new Error('Failed to fetch events');
                const data = await res.json();
                // Only show approved events on the user-facing page
                setEvents(data.filter(e => !e.status || e.status === 'approved'));
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = filter === 'All' 
        ? events 
        : events.filter(event => event.category === filter);

    const getTagColor = (tag) => {
        if (!tag) return 'bg-primary hover:bg-primary/90 text-white';
        switch (tag.toLowerCase()) {
            case 'past': return 'bg-zinc-500 hover:bg-zinc-600 text-white';
            case 'ongoing': return 'bg-green-500 hover:bg-green-600 text-white';
            case 'future': return 'bg-blue-500 hover:bg-blue-600 text-white';
            default: return 'bg-primary hover:bg-primary/90 text-white';
        }
    };

    // Determine tag based on event date
    const getEventTag = (event) => {
        if (event.tag) return event.tag;
        if (!event.date) return 'Upcoming';
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDate < today) return 'Past';
        if (eventDate.toDateString() === today.toDateString()) return 'Ongoing';
        return 'Future';
    };

    // Format date nicely
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950">
            <div className="container mx-auto max-w-6xl">
                {/* Hero Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                        <CalendarDays className="w-4 h-4" />
                        Campus Events
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-center">
                        College Events
                    </h1>
                    <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-2xl mb-10">
                        Stay updated with the latest happenings around the campus. From cultural fests to sports tournaments, find everything here.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={filter === category ? "default" : "outline"}
                                className="rounded-full"
                                onClick={() => setFilter(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <CalendarDays className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                        <p className="text-xl font-medium text-zinc-400 dark:text-zinc-500">
                            No events found
                        </p>
                        <p className="text-sm text-zinc-400 mt-2">
                            {filter !== 'All' ? `No ${filter.toLowerCase()} events at the moment.` : 'Check back later for upcoming events.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((event) => {
                                const tag = getEventTag(event);
                                const eventId = event._id || event.id;
                                return (
                                    <motion.div
                                        key={eventId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                    >
                                        <Card 
                                            className="group h-full overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer hover:-translate-y-1"
                                            onClick={() => router.push(`/events/${eventId}`)}
                                        >
                                            {/* Image */}
                                            <div className="h-52 overflow-hidden relative">
                                                <img 
                                                    src={event.image || `https://picsum.photos/seed/${(event.title || '').replace(/\s+/g, '')}/600/400`} 
                                                    alt={event.title} 
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                                />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                                {/* Tag */}
                                                <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getTagColor(tag)} backdrop-blur-sm`}>
                                                    {tag}
                                                </div>
                                                {/* Date overlay on image */}
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <p className="text-sm font-medium opacity-90">{formatDate(event.date)}</p>
                                                </div>
                                            </div>

                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-xs">
                                                        {event.category || 'Event'}
                                                    </Badge>
                                                    {event.organizer && (
                                                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {event.organizer}
                                                        </span>
                                                    )}
                                                </div>
                                                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="flex-1 pt-0">
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>
                                                <div className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                                                    {event.time && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-primary/70" />
                                                            <span className="text-xs">{event.time}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                                        <span className="text-xs">{event.location}</span>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="pt-0">
                                                <Button className="w-full group/btn gap-2" variant="secondary">
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
