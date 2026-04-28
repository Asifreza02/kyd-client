'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    CalendarDays, MapPin, Clock, ArrowLeft, Share2, ExternalLink, 
    User, Tag, Loader2, Calendar, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${params.id}`);
                if (!res.ok) throw new Error('Event not found');
                const data = await res.json();
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchEvent();
    }, [params.id]);

    const getEventTag = () => {
        if (!event?.date) return 'Upcoming';
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDate < today) return 'Past';
        if (eventDate.toDateString() === today.toDateString()) return 'Happening Now';
        return 'Upcoming';
    };

    const getTagStyle = (tag) => {
        switch (tag) {
            case 'Past': return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700';
            case 'Happening Now': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 animate-pulse';
            case 'Upcoming': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const getDaysUntil = (dateStr) => {
        if (!dateStr) return null;
        const eventDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff < 0) return `${Math.abs(diff)} days ago`;
        return `In ${diff} days`;
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: event.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {}
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-950 px-4">
                <div className="text-center">
                    <CalendarDays className="w-20 h-20 text-zinc-300 dark:text-zinc-700 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-3">Event Not Found</h1>
                    <p className="text-zinc-500 mb-8 max-w-md">
                        The event you're looking for doesn't exist or may have been removed.
                    </p>
                    <Button onClick={() => router.push('/events')} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </Button>
                </div>
            </div>
        );
    }

    const tag = getEventTag();
    const daysUntil = getDaysUntil(event.date);
    const imageUrl = event.image || `https://picsum.photos/seed/${(event.title || '').replace(/\s+/g, '')}/1200/600`;

    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
            {/* Hero Banner */}
            <div className="relative h-[50vh] min-h-[400px] max-h-[550px] w-full overflow-hidden">
                <img 
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 to-transparent" />

                {/* Top navigation bar */}
                <div className="absolute top-0 left-0 right-0 pt-20 px-4 md:px-8 z-10">
                    <div className="container mx-auto max-w-5xl flex items-center justify-between">
                        <Button 
                            variant="ghost" 
                            className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm gap-2 rounded-full"
                            onClick={() => router.push('/events')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All Events
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm gap-2 rounded-full"
                            onClick={handleShare}
                        >
                            <Share2 className="w-4 h-4" />
                            {copied ? 'Link Copied!' : 'Share'}
                        </Button>
                    </div>
                </div>

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 pb-10 px-4 md:px-8">
                    <motion.div 
                        className="container mx-auto max-w-5xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge 
                                variant="outline" 
                                className={`${getTagStyle(tag)} border px-3 py-1 text-xs font-semibold`}
                            >
                                {tag}
                            </Badge>
                            <Badge variant="outline" className="bg-white/10 text-white/90 border-white/20 backdrop-blur-sm px-3 py-1 text-xs">
                                {event.category || 'Event'}
                            </Badge>
                            {daysUntil && (
                                <span className="text-white/70 text-sm font-medium">
                                    {daysUntil}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl">
                            {event.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto max-w-5xl px-4 md:px-8 -mt-6 relative z-10 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <motion.div 
                        className="lg:col-span-2 space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        {/* Quick Info Bar */}
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 dark:divide-zinc-800">
                                    <div className="flex items-center gap-3 p-5">
                                        <div className="bg-primary/10 p-2.5 rounded-xl">
                                            <CalendarDays className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Date</p>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{formatDate(event.date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-5">
                                        <div className="bg-blue-500/10 p-2.5 rounded-xl">
                                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Time</p>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.time || 'TBA'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-5">
                                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                                            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Venue</p>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* About Section */}
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                            <CardContent className="p-6 md:p-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-primary rounded-full" />
                                    About This Event
                                </h2>
                                <div className="prose prose-zinc dark:prose-invert max-w-none">
                                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                                        {event.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Registration CTA for upcoming events */}
                        {tag !== 'Past' && (
                            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-white to-blue-50/50 dark:from-primary/10 dark:via-zinc-900 dark:to-blue-950/30 shadow-sm overflow-hidden">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">
                                                {tag === 'Happening Now' ? '🔴 Event is Live!' : '🎯 Interested in attending?'}
                                            </h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {event.registrationLink 
                                                    ? 'Click below to register or learn more.'
                                                    : 'Contact the organizer for more information.'}
                                            </p>
                                        </div>
                                        {event.registrationLink ? (
                                            <Button 
                                                className="gap-2 shrink-0 shadow-md"
                                                onClick={() => window.open(event.registrationLink, '_blank')}
                                            >
                                                Register Now
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" className="gap-2 shrink-0" disabled>
                                                Registration Info TBA
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                    >
                        {/* Event Details Card */}
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm sticky top-28">
                            <CardContent className="p-6 space-y-5">
                                <h3 className="font-bold text-lg">Event Details</h3>

                                <div className="space-y-4">
                                    {event.organizer && (
                                        <div className="flex items-start gap-3">
                                            <div className="bg-amber-500/10 p-2 rounded-lg mt-0.5">
                                                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Organized By</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.organizer}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className="bg-violet-500/10 p-2 rounded-lg mt-0.5">
                                            <Tag className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Category</p>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.category || 'General'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-rose-500/10 p-2 rounded-lg mt-0.5">
                                            <Calendar className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Status</p>
                                            <Badge className={`mt-1 text-xs ${getTagStyle(tag)} border`}>
                                                {tag}
                                            </Badge>
                                        </div>
                                    </div>

                                    {event.submittedBy && (
                                        <div className="flex items-start gap-3">
                                            <div className="bg-cyan-500/10 p-2 rounded-lg mt-0.5">
                                                <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Submitted By</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.submittedBy}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-zinc-100 dark:border-zinc-800" />

                                {/* Share Button */}
                                <Button 
                                    variant="outline" 
                                    className="w-full gap-2" 
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-4 h-4" />
                                    {copied ? 'Copied!' : 'Share Event'}
                                </Button>

                                {/* Back Button */}
                                <Button 
                                    variant="ghost" 
                                    className="w-full gap-2 text-zinc-500" 
                                    onClick={() => router.push('/events')}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to All Events
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
