'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Crown, UsersRound, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyCommunities() {
    const { data: session, status } = useSession();
    const [communities, setCommunities] = useState([]);
    const [joinedIds, setJoinedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== 'authenticated') {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [commRes, appsRes] = await Promise.all([
                    fetch('/api/communities'),
                    fetch('/api/applications/my')
                ]);

                if (commRes.ok && appsRes.ok) {
                    const allCommunities = await commRes.json();
                    const myApps = await appsRes.json();
                    const ids = new Set(myApps.map(a => a.communityId?._id || a.communityId));
                    setJoinedIds(ids);
                    setCommunities(allCommunities.filter(c => ids.has(c._id)));
                }
            } catch (err) {
                console.error('Failed to fetch communities', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [status]);

    // Don't render anything if not logged in or no joined communities
    if (status !== 'authenticated' || (!loading && communities.length === 0)) {
        return null;
    }

    if (loading) {
        return (
            <section className="container px-4 md:px-6 py-12 md:py-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <Crown className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Communities</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="container px-4 md:px-6 py-12 md:py-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Crown className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Communities</h2>
                </div>
                <Link href="/communities">
                    <Button variant="ghost" className="text-sm gap-1 text-zinc-500 hover:text-primary">
                        View All <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community, index) => (
                    <motion.div
                        key={community._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                        <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300">
                            {/* Banner */}
                            <div className="h-32 overflow-hidden relative">
                                <img
                                    src={community.image}
                                    alt={community.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700 border-0 shadow-md text-white gap-1 text-xs">
                                        <CheckCircle2 className="w-3 h-3" /> Member
                                    </Badge>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-lg font-bold text-white drop-shadow-md truncate">{community.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0.5 bg-white/20 text-white border-0 backdrop-blur-sm">
                                            {community.category}
                                        </Badge>
                                        <span className="text-[11px] text-white/80">
                                            <UsersRound className="w-3 h-3 inline mr-1" />
                                            {community.memberCount} members
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-4 py-3">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                                    {community.description}
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/communities/${community._id}`} className="flex-1">
                                        <Button
                                            size="sm"
                                            className="w-full rounded-lg text-xs gap-1.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" /> Open Chat
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
