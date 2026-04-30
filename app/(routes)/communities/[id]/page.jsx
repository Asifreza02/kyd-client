'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, UsersRound, Lock, LogIn, MessageCircle, Shield, 
    CalendarDays, Tag, Crown, Users, Info, Hash, Share2, ChevronRight,
    CheckCircle2, Loader2, Sparkles, Megaphone, ScrollText, Plus, X, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
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
                    <div className="flex overflow-x-auto gap-1 no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'about' && <AboutTab community={community} formatDate={formatDate} isMember={isMember} />}
                        {activeTab === 'announcements' && <AnnouncementsTab community={community} isLeaderOrManager={isLeaderOrManager} onRefresh={() => router.refresh()} isMember={isMember} status={status} membershipLoading={membershipLoading} />}
                        {activeTab === 'chat' && <ChatTab community={community} communityId={communityId} session={session} status={status} isMember={isMember} membershipLoading={membershipLoading} />}
                        {activeTab === 'members' && <MembersTab community={community} isMember={isMember} session={session} status={status} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── About Tab ──
function AboutTab({ community, formatDate, isMember }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-primary rounded-full" /> Description
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{community.description}</p>
                    </CardContent>
                </Card>

                {community.rules?.length > 0 && (
                    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                        <CardContent className="p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ScrollText className="w-5 h-5 text-primary" /> Community Rules
                            </h2>
                            <div className="space-y-4">
                                {community.rules.map((rule, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-primary/20 group">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            {idx + 1}
                                        </div>
                                        <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed pt-1.5">{rule}</p>
                                    </div>
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
                                    <Sparkles className="w-5 h-5 text-primary" /> Join the Community
                                </h3>
                                <p className="text-sm text-zinc-500">Apply now to access the chat and connect with other members.</p>
                            </div>
                            <Link href="/communities">
                                <Button className="gap-2 shrink-0 shadow-md">
                                    Apply to Join <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6">
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
                        {community.tags?.length > 0 && (
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-3">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {community.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-2.5 py-1 text-xs rounded-lg">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
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

// ── Announcements Tab ──
function AnnouncementsTab({ community, isLeaderOrManager, onRefresh, isMember, status, membershipLoading }) {
    if (status === 'unauthenticated' || (!membershipLoading && !isMember)) {
        return (
            <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 py-20 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Members Only</h3>
                <p className="text-zinc-500 max-w-md mb-8">You must be a member of <strong>{community.name}</strong> to view announcements.</p>
                <Link href="/communities"><Button className="rounded-xl px-10 py-6 font-semibold shadow-lg">Apply to Join</Button></Link>
            </div>
        );
    }

    const [isPosting, setIsPosting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [announcements, setAnnouncements] = useState(community.announcements || []);

    const handlePost = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const fd = new FormData(e.target);
        const newAnn = {
            title: fd.get('title'),
            content: fd.get('content'),
            author: community.lead, // Simple for now
            date: new Date().toISOString()
        };

        try {
            const res = await fetch(`/api/communities/${community._id}/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAnn)
            });
            if (res.ok) {
                const updated = await res.json();
                setAnnouncements(updated.announcements);
                setIsPosting(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
                    <p className="text-zinc-500 text-sm">Stay updated with official news from the community lead.</p>
                </div>
                {isLeaderOrManager && (
                    <Dialog open={isPosting} onOpenChange={setIsPosting}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                                <Plus className="w-4 h-4" /> Post New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Post Announcement</DialogTitle>
                                <DialogDescription>Share an update with all community members.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePost} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input name="title" required placeholder="Announcement Title" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <textarea 
                                        name="content" 
                                        required 
                                        rows={5} 
                                        placeholder="What's happening?" 
                                        className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Post Announcement
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {announcements.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-dashed">
                    <Megaphone className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 font-medium">No announcements yet</p>
                    <p className="text-zinc-400 text-sm mt-1">Check back later for updates from the lead.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.sort((a,b) => new Date(b.date) - new Date(a.date)).map((ann, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md transition-all group">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-[10px] uppercase tracking-wider font-bold">
                                            Official
                                        </Badge>
                                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                                            <CalendarDays className="w-3 h-3" />
                                            {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl mt-3 group-hover:text-primary transition-colors">{ann.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {ann.author?.[0] || 'L'}
                                        </div>
                                        <span className="text-xs font-medium text-zinc-500">Posted by {ann.author}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Chat Tab ──
function ChatTab({ community, communityId, session, status, isMember, membershipLoading }) {
    if (status === 'unauthenticated') {
        return (
            <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 py-20 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                    <LogIn className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Login Required</h3>
                <p className="text-zinc-500 max-w-md mb-8">Join the conversation! Log in to access the community chat room.</p>
                <Link href="/login"><Button className="rounded-xl px-10 py-6 font-semibold shadow-lg">Sign In to Chat</Button></Link>
            </div>
        );
    }
    if (!membershipLoading && !isMember) {
        return (
            <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 py-20 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Exclusive for Members</h3>
                <p className="text-zinc-500 max-w-md mb-8">You need to be an approved member of <strong>{community.name}</strong> to enter the chat.</p>
                <Link href="/communities"><Button className="rounded-xl px-10 py-6 font-semibold shadow-lg">Apply to Join</Button></Link>
            </div>
        );
    }
    return (
        <div className="max-w-4xl mx-auto">
            <ChatRoom communityId={communityId} communityName={community.name} user={session.user} />
        </div>
    );
}

// ── Members Tab ──
function MembersTab({ community, isMember, session, status }) {
    if (status === 'unauthenticated' || !isMember) {
        return (
            <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 py-20 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                    <UsersRound className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Members Only</h3>
                <p className="text-zinc-500 max-w-md">Become a member to see who else is in this community.</p>
            </div>
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
        Leader: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50',
        Manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50',
        Member: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200/50',
    };

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Community Members</CardTitle>
                        <p className="text-zinc-500 text-sm mt-1">Connect with {allMembers.length} students in this community.</p>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">{allMembers.length} Total</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allMembers.map((member, i) => (
                        <div key={`${member.id}-${i}`} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl ${getColor(member.name)} flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm group-hover:rotate-3 transition-transform`}>
                                {getInitials(member.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{member.name}</p>
                                <Badge className={`mt-1.5 text-[10px] uppercase font-bold border ${roleStyle[member.role]}`}>
                                    {member.role}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
