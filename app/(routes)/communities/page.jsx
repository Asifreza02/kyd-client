'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UsersRound, Sparkles, CheckCircle2, ChevronRight, BookOpen, MessageCircle, Crown, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CommunitiesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [communities, setCommunities] = useState([]);
    const [joinedIds, setJoinedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createError, setCreateError] = useState(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await fetch('/api/communities');
                if (res.ok) {
                    const data = await res.json();
                    setCommunities(data);
                }
            } catch (err) {
                console.error("Failed to fetch communities", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunities();
    }, []);

    // Fetch user's joined communities
    useEffect(() => {
        if (status !== 'authenticated') return;
        const fetchMyApps = async () => {
            try {
                const res = await fetch('/api/applications/my');
                if (res.ok) {
                    const apps = await res.json();
                    setJoinedIds(new Set(apps.map(a => a.communityId?._id || a.communityId)));
                }
            } catch (err) {
                console.error("Failed to fetch my applications", err);
            }
        };
        fetchMyApps();
    }, [status]);

    const handleApply = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.target);
        const applicationData = {
            communityId: selectedCommunity._id,
            department: formData.get('department'),
            year: formData.get('year'),
            reason: formData.get('reason'),
        };

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(applicationData)
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to submit application");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsSuccess(false);
        setError(null);
        setSelectedCommunity(null);
    };

    if (loading) {
        return <div className="min-h-screen pt-32 flex justify-center text-zinc-500">Loading communities...</div>;
    }

    const joinedCommunities = communities.filter(c => joinedIds.has(c._id));
    const otherCommunities = communities.filter(c => !joinedIds.has(c._id));

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 text-primary"
                    >
                        <UsersRound className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
                        Student Communities
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl mb-8">
                        Find your tribe, build your skills, and make lifelong connections. Explore and join communities led by your peers.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>

                    {/* Create Community Button */}
                    {status === 'authenticated' && (
                        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) { setCreateSuccess(false); setCreateError(null); } }}>
                            <DialogTrigger asChild>
                                <Button className="mt-8 rounded-xl px-8 py-6 font-semibold shadow-md hover:shadow-lg transition-all gap-2">
                                    <Plus className="w-5 h-5" /> Create a Community
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                {!createSuccess ? (
                                    <>
                                        <div className="bg-zinc-50 dark:bg-zinc-900 px-6 py-8 border-b border-zinc-100 dark:border-zinc-800 relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold mb-2">Create a New Community</DialogTitle>
                                                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                                    Fill out the details below. Your community will be submitted for admin approval before it goes live. You will automatically become the leader.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </div>
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            setIsCreating(true);
                                            setCreateError(null);
                                            const fd = new FormData(e.target);
                                            const body = {
                                                name: fd.get('name'),
                                                description: fd.get('description'),
                                                category: fd.get('category'),
                                                tags: fd.get('tags'),
                                                image: fd.get('image') || undefined,
                                            };
                                            try {
                                                const res = await fetch('/api/communities', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(body),
                                                });
                                                if (res.ok) {
                                                    setCreateSuccess(true);
                                                } else {
                                                    const data = await res.json();
                                                    setCreateError(data.error || 'Failed to create community');
                                                }
                                            } catch (err) {
                                                setCreateError('An unexpected error occurred');
                                            } finally {
                                                setIsCreating(false);
                                            }
                                        }} className="p-6 space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="comm-name" className="text-zinc-700 dark:text-zinc-300 font-medium">Community Name *</Label>
                                                <Input id="comm-name" name="name" required placeholder="e.g. AI Research Club" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="comm-category" className="text-zinc-700 dark:text-zinc-300 font-medium">Category *</Label>
                                                <Input id="comm-category" name="category" required placeholder="e.g. Technical, Cultural, Sports" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="comm-tags" className="text-zinc-700 dark:text-zinc-300 font-medium">Tags (comma separated)</Label>
                                                <Input id="comm-tags" name="tags" placeholder="e.g. AI, Machine Learning, Python" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="comm-image" className="text-zinc-700 dark:text-zinc-300 font-medium">Banner Image URL (optional)</Label>
                                                <Input id="comm-image" name="image" type="url" placeholder="https://example.com/banner.jpg" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="comm-desc" className="text-zinc-700 dark:text-zinc-300 font-medium">Description *</Label>
                                                <textarea
                                                    id="comm-desc"
                                                    name="description"
                                                    required
                                                    rows={4}
                                                    className="flex w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
                                                    placeholder="Describe your community's purpose, activities, and what members can expect..."
                                                />
                                            </div>
                                            {createError && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">{createError}</div>}
                                            <DialogFooter className="pt-4">
                                                <Button type="submit" disabled={isCreating} className="w-full rounded-xl py-6 font-semibold">
                                                    {isCreating ? (
                                                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
                                                    ) : (
                                                        'Submit for Approval'
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </>
                                ) : (
                                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', bounce: 0.5 }}
                                            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4"
                                        >
                                            <CheckCircle2 className="w-10 h-10" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold">Community Submitted!</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                                            Your community has been submitted for review. An admin will approve it shortly, after which it will appear on the communities page. You will be set as the leader automatically.
                                        </p>
                                        <Button variant="outline" className="rounded-full px-8" onClick={() => { setIsCreateOpen(false); setCreateSuccess(false); }}>Close</Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* ── Joined Communities Section ── */}
                {joinedCommunities.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <Crown className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Your Communities</h2>
                            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 ml-4"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {joinedCommunities.map((community) => (
                                <CommunityCard
                                    key={community._id}
                                    community={community}
                                    isJoined={true}
                                    onSelectCommunity={setSelectedCommunity}
                                    handleApply={handleApply}
                                    isSubmitting={isSubmitting}
                                    isSuccess={isSuccess}
                                    error={error}
                                    resetForm={resetForm}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── All / Other Communities ── */}
                {otherCommunities.length > 0 && (
                    <>
                        {joinedCommunities.length > 0 && (
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <UsersRound className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Explore Communities</h2>
                                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 ml-4"></div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {otherCommunities.map((community) => (
                                <CommunityCard
                                    key={community._id}
                                    community={community}
                                    isJoined={false}
                                    onSelectCommunity={setSelectedCommunity}
                                    handleApply={handleApply}
                                    isSubmitting={isSubmitting}
                                    isSuccess={isSuccess}
                                    error={error}
                                    resetForm={resetForm}
                                />
                            ))}
                        </div>
                    </>
                )}

                {communities.length === 0 && (
                    <div className="text-center text-zinc-500 py-12">
                        No communities found. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Community Card Component ──
function CommunityCard({ community, isJoined, onSelectCommunity, handleApply, isSubmitting, isSuccess, error, resetForm }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Card className={`h-full overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group ${
                isJoined ? 'ring-2 ring-emerald-500/30 border-emerald-200 dark:border-emerald-800/50' : ''
            }`}>
                <div className="h-48 overflow-hidden relative">
                    <img 
                        src={community.image} 
                        alt={community.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <Badge className="bg-primary/90 hover:bg-primary border-0 shadow-sm backdrop-blur-md">
                            {community.category}
                        </Badge>
                        <div className="flex items-center text-white/90 text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                            <UsersRound className="w-3.5 h-3.5 mr-1.5" />
                            {community.memberCount} Members
                        </div>
                    </div>
                    {isJoined && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 border-0 shadow-lg text-white gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Member
                            </Badge>
                        </div>
                    )}
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">{community.name}</CardTitle>
                    <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 mr-2">Community Lead:</span>
                        {community.lead}
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                        {community.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {community.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs rounded-md font-medium border border-zinc-200 dark:border-zinc-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto flex-col gap-2">
                    <Link href={`/communities/${community._id}`} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full rounded-xl py-5 font-semibold border-primary/30 text-primary hover:bg-primary/5 transition-all gap-2"
                        >
                            <MessageCircle className="w-4 h-4" /> Community Chat
                        </Button>
                    </Link>

                    {isJoined ? (
                        <div className="w-full rounded-xl py-3 font-semibold text-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Joined
                        </div>
                    ) : (
                        <Dialog onOpenChange={(open) => { if(!open) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button 
                                    className="w-full rounded-xl py-6 font-semibold shadow-md hover:shadow-lg transition-all"
                                    onClick={() => onSelectCommunity(community)}
                                >
                                    Apply to Join <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                {!isSuccess ? (
                                    <>
                                        <div className="bg-zinc-50 dark:bg-zinc-900 px-6 py-8 border-b border-zinc-100 dark:border-zinc-800 relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold mb-2">Join {community.name}</DialogTitle>
                                                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                                    Fill out this form to send your application directly to the community lead, {community.lead}.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </div>
                                        <form onSubmit={handleApply} className="p-6 space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300 font-medium">Full Name</Label>
                                                <Input id="name" required placeholder="John Doe" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/50" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="department" className="text-zinc-700 dark:text-zinc-300 font-medium">Department</Label>
                                                    <Input id="department" name="department" required placeholder="e.g. Computer Science" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="year" className="text-zinc-700 dark:text-zinc-300 font-medium">Year of Study</Label>
                                                    <Input id="year" name="year" required placeholder="e.g. 2nd Year" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/50" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reason" className="text-zinc-700 dark:text-zinc-300 font-medium">Why do you want to join?</Label>
                                                <textarea 
                                                    id="reason" 
                                                    name="reason"
                                                    required 
                                                    rows={4}
                                                    className="flex w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                                    placeholder="Tell us about your interests and what you hope to contribute..."
                                                />
                                            </div>
                                            {error && <div className="text-red-500 text-sm">{error}</div>}
                                            <DialogFooter className="pt-4">
                                                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl py-6 font-semibold">
                                                    {isSubmitting ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        >
                                                            <Sparkles className="w-5 h-5" />
                                                        </motion.div>
                                                    ) : (
                                                        "Submit Application"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </>
                                ) : (
                                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", bounce: 0.5 }}
                                            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4"
                                        >
                                            <CheckCircle2 className="w-10 h-10" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold">Application Sent!</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                                            Thanks for applying to {community?.name}. The community lead will review your application and get back to you soon.
                                        </p>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="rounded-full px-8">Close</Button>
                                        </DialogTrigger>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
