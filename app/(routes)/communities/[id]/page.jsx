'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, UsersRound, Lock, LogIn, MessageCircle, Shield, 
    CalendarDays, Tag, Crown, Users, Info, Hash, Share2, ChevronRight,
    CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ChatRoom from '@/app/_components/ChatRoom';
import Link from 'next/link';

export default function CommunityDetailPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const communityId = params.id;

    const [community, setCommunity] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);
    const [membershipLoading, setMembershipLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!communityId) return;
        const fetchCommunity = async () => {
            try {
                const res = await fetch(`/api/communities/${communityId}`);
                if (res.ok) setCommunity(await res.json());
            } catch (err) {
                console.error('Failed to fetch community', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunity();
    }, [communityId]);

    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated' || !community) {
            setMembershipLoading(false);
            return;
        }
        const userId = session?.user?.id;
        const isAdmin = session?.user?.role === 'admin';
        const isLeader = community.leaderId === userId;
        const isManager = community.managers?.includes(userId);
        const isMem = community.members?.includes(userId);
        setIsMember(isAdmin || isLeader || isManager || isMem);
        setMembershipLoading(false);
    }, [community, status, session]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: community.name, url: window.location.href });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {}
    };

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-zinc-500 text-sm">Loading community...</p>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <UsersRound className="w-8 h-8 text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold">Community Not Found</h2>
                <p className="text-zinc-500">This community doesn't exist or has been removed.</p>
                <Link href="/communities">
                    <Button variant="outline" className="rounded-full mt-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Communities
                    </Button>
                </Link>
            </div>
        );
    }

    const isLeaderOrManager = session?.user && (community.leaderId === session.user.id || community.managers?.includes(session.user.id));
    const tabs = [
        { id: 'about', label: 'About', icon: Info },
        { id: 'chat', label: 'Chat', icon: MessageCircle },
        { id: 'members', label: 'Members', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
            {/* Hero Banner */}
            <div className="relative h-[35vh] min-h-[280px] max-h-[380px] w-full overflow-hidden">
                <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20" />

                <div className="absolute top-0 left-0 right-0 pt-20 px-4 md:px-8 z-10">
                    <div className="container mx-auto max-w-5xl flex items-center justify-between">
                        <Link href="/communities">
                            <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm gap-2 rounded-full">
                                <ArrowLeft className="w-4 h-4" /> Communities
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            {isLeaderOrManager && (
                                <Link href={`/communities/${community._id}/manage`}>
                                    <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm gap-2 rounded-full">
                                        <Shield className="w-4 h-4" /> Manage
                                    </Button>
                                </Link>
                            )}
                            <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm gap-2 rounded-full" onClick={handleShare}>
                                <Share2 className="w-4 h-4" /> {copied ? 'Copied!' : 'Share'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 pb-8 px-4 md:px-8">
                    <motion.div className="container mx-auto max-w-5xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge className="bg-primary/90 hover:bg-primary border-0 shadow-sm backdrop-blur-md">{community.category}</Badge>
                            <span className="text-white/70 text-sm flex items-center gap-1.5">
                                <UsersRound className="w-3.5 h-3.5" /> {community.memberCount} members
                            </span>
                            {isMember && (
                                <Badge className="bg-emerald-600/90 border-0 text-white gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Member
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">{community.name}</h1>
                        <p className="text-white/60 text-sm mt-2 flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5" /> Led by <span className="text-white/80 font-medium">{community.lead}</span>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-16 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto max-w-5xl px-4 md:px-8">
                    <div className="flex gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container mx-auto max-w-5xl px-4 md:px-8 py-8">
                {activeTab === 'about' && <AboutTab community={community} formatDate={formatDate} isMember={isMember} />}
                {activeTab === 'chat' && <ChatTab community={community} communityId={communityId} session={session} status={status} isMember={isMember} membershipLoading={membershipLoading} />}
                {activeTab === 'members' && <MembersTab community={community} isMember={isMember} session={session} status={status} />}
            </div>
        </div>
    );
}

// ── About Tab ──
function AboutTab({ community, formatDate, isMember }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                    <CardContent className="p-6 md:p-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-primary rounded-full" /> About
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{community.description}</p>
                    </CardContent>
                </Card>
                {community.tags?.length > 0 && (
                    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-primary" /> Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {community.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm rounded-lg">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {!isMember && (
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-white to-blue-50/50 dark:from-primary/10 dark:via-zinc-900 dark:to-blue-950/30 shadow-sm">
                        <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" /> Want to Join?
                                </h3>
                                <p className="text-sm text-zinc-500">Apply from the communities page to become a member.</p>
                            </div>
                            <Link href="/communities">
                                <Button className="gap-2 shrink-0 shadow-md">
                                    Browse Communities <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </motion.div>

            <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                        <h3 className="font-bold text-lg">Community Info</h3>
                        <div className="space-y-4">
                            <InfoRow icon={Crown} color="amber" label="Community Lead" value={community.lead} />
                            <InfoRow icon={Tag} color="violet" label="Category" value={community.category} />
                            <InfoRow icon={Users} color="blue" label="Members" value={`${community.memberCount} members`} />
                            {community.createdAt && (
                                <InfoRow icon={CalendarDays} color="emerald" label="Founded" value={formatDate(community.createdAt)} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function InfoRow({ icon: Icon, color, label, value }) {
    const colorMap = {
        amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    };
    return (
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg mt-0.5 ${colorMap[color]}`}><Icon className="w-4 h-4" /></div>
            <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
            </div>
        </div>
    );
}

// ── Chat Tab ──
function ChatTab({ community, communityId, session, status, isMember, membershipLoading }) {
    if (status === 'unauthenticated') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-12">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                    <LogIn className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Login Required</h3>
                <p className="text-zinc-500 max-w-md mb-6">You need to be logged in to access the community chat.</p>
                <Link href="/login"><Button className="rounded-xl px-8 py-6 font-semibold shadow-md"><LogIn className="w-4 h-4 mr-2" /> Sign In</Button></Link>
            </motion.div>
        );
    }
    if (!membershipLoading && !isMember) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-12">
                <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Members Only</h3>
                <p className="text-zinc-500 max-w-md mb-6">You need to be an approved member of <strong>{community.name}</strong> to access the chat.</p>
                <Link href="/communities"><Button className="rounded-xl px-8 py-6 font-semibold shadow-md"><ArrowLeft className="w-4 h-4 mr-2" /> Apply to Join</Button></Link>
            </motion.div>
        );
    }
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ChatRoom communityId={communityId} communityName={community.name} user={session.user} />
        </motion.div>
    );
}

// ── Members Tab ──
function MembersTab({ community, isMember, session, status }) {
    if (status === 'unauthenticated' || !isMember) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-12">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Members Only</h3>
                <p className="text-zinc-500 max-w-md">Join this community to see the full member list.</p>
            </motion.div>
        );
    }

    const allMembers = [
        { id: community.leaderId, name: community.lead, role: 'Leader' },
        ...(community.managers || []).map(m => ({ id: m, name: `Manager ${m}`, role: 'Manager' })),
        ...(community.members || []).map(m => ({ id: m, name: `Member ${m}`, role: 'Member' })),
    ];

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-cyan-500', 'bg-pink-500'];
    const getColor = (name) => colors[Math.abs([...(name || '')].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0)) % colors.length];

    const roleStyle = {
        Leader: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        Manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        Member: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> All Members</h2>
                        <Badge variant="secondary">{allMembers.length} total</Badge>
                    </div>
                    {allMembers.length === 0 ? (
                        <p className="text-zinc-500 text-sm text-center py-8">No members yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {allMembers.map((member, i) => (
                                <div key={`${member.id}-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div className={`w-10 h-10 rounded-full ${getColor(member.name)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                                        {getInitials(member.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{member.name}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleStyle[member.role]}`}>{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
